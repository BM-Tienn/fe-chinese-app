import React, { useCallback, useEffect, useRef, useState } from 'react';
import { analyzePronunciation } from '../../services/apiService';
import { Vocabulary } from '../../store/slices/analysisSlice';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { CloseIcon, MicIcon } from '../icons';

interface PronunciationPracticeModalProps {
  word: Vocabulary | null;
  onClose: () => void;
}

export const PronunciationPracticeModal: React.FC<
  PronunciationPracticeModalProps
> = ({ word, onClose }) => {
  const [status, setStatus] = useState<
    'idle' | 'recording' | 'processing' | 'feedback'
  >('idle');
  const [feedback, setFeedback] = useState<any>(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach(track => track.stop());
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (!word) return null;

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(243 244 246)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(59 130 246)';
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      let total = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        total += Math.abs(v - 1);
        const y = (v * canvas.height) / 2;
        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }

      const average = total / bufferLength;
      if (average < 0.01) {
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(stopRecording, 3000);
        }
      } else {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    draw();
  };

  const startRecording = async () => {
    setError('');
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('recording');

      // For waveform
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // For audio data
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = event =>
        audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.onstop = processAudio;
      mediaRecorderRef.current.start();

      // For speech-to-text preview
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        speechRecognitionRef.current = new SpeechRecognition();
        speechRecognitionRef.current.lang = 'zh-CN';
        speechRecognitionRef.current.interimResults = true;
        speechRecognitionRef.current.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setTranscript(currentTranscript);
        };
        speechRecognitionRef.current.start();
      }

      drawWaveform();
    } catch (err) {
      console.error('Lỗi truy cập micro:', err);
      setError('Không thể truy cập micro. Vui lòng cấp quyền cho trình duyệt.');
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const processAudio = () => {
    setStatus('processing');
    cleanup();
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1];
      await analyzePronunciationAudio(base64Audio);
    };
  };

  const analyzePronunciationAudio = async (audioBase64: string) => {
    const prompt = `Bạn là một giám khảo phát âm tiếng Trung chuyên nghiệp và nghiêm khắc. Học viên được yêu cầu phát âm từ "${word.hanzi}" (pinyin: ${word.pinyin}). Dưới đây là bản ghi âm của họ.
    Hãy so sánh bản ghi âm với phát âm chuẩn và đưa ra một phân tích chi tiết, bao gồm:
    1.  **score**: Chấm điểm trên thang 100, dựa trên mức độ gần với phát âm chuẩn.
    2.  **toneFeedback**: Nhận xét cụ thể về thanh điệu (đúng/sai, sai như thế nào, ví dụ: "thanh 4 đọc thành thanh 1").
    3.  **initialFeedback**: Nhận xét về phụ âm đầu (ví dụ: "âm 'zh' phát âm chưa đủ cong lưỡi").
    4.  **finalFeedback**: Nhận xét về vần/âm cuối (ví dụ: "vần 'ang' bị ngắt hơi sớm").
    5.  **summary**: Tổng kết ngắn gọn và đưa ra một mẹo quan trọng nhất để cải thiện.
    Hãy trả lời bằng tiếng Việt, định dạng JSON nghiêm ngặt.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'audio/webm', data: audioBase64 } },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json' },
    };

    try {
      const resultText = await analyzePronunciation(payload);
      setFeedback(resultText);
    } catch (err) {
      console.error('Lỗi khi phân tích phát âm:', err);
      setError('AI không thể phân tích bản ghi âm, vui lòng thử lại.');
    } finally {
      setStatus('feedback');
    }
  };

  const scoreColor =
    feedback?.score >= 80
      ? 'text-green-500'
      : feedback?.score >= 50
        ? 'text-yellow-500'
        : 'text-red-500';

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-2xl w-full max-w-md'
        onClick={e => e.stopPropagation()}
      >
        <div className='p-6 border-b'>
          <div className='flex justify-between items-start'>
            <h2 className='text-2xl font-bold text-gray-800'>Luyện phát âm</h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-100'
            >
              <CloseIcon />
            </button>
          </div>
          <p className='text-gray-500'>
            Từ vựng:{' '}
            <span className='font-semibold text-blue-600 text-lg'>
              {word.hanzi} ({word.pinyin})
            </span>
          </p>
        </div>

        <div className='p-6 min-h-[400px] flex flex-col justify-center items-center'>
          {status === 'idle' && (
            <div className='text-center'>
              <p className='mb-4 text-gray-600'>
                Nhấn nút bên dưới để bắt đầu ghi âm.
              </p>
              <button
                onClick={startRecording}
                className='inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105'
              >
                <MicIcon className='h-6 w-6 mr-2' />
                Bắt đầu ghi âm
              </button>
              {error && <p className='text-red-500 mt-4'>{error}</p>}
            </div>
          )}

          {status === 'recording' && (
            <div className='text-center w-full'>
              <p className='mb-2 text-gray-600 animate-pulse'>
                Đang lắng nghe...
              </p>
              <canvas
                ref={canvasRef}
                width='300'
                height='80'
                className='mx-auto bg-gray-100 rounded-lg'
              ></canvas>
              <div className='mt-2 h-12 text-center text-gray-700 text-lg italic bg-gray-50 p-2 rounded-md'>
                "{transcript || '...'}"
              </div>
              <button
                onClick={stopRecording}
                className='mt-4 inline-flex items-center px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700'
              >
                Dừng & Phân tích
              </button>
            </div>
          )}

          {status === 'processing' && (
            <LoadingSpinner text='AI đang phân tích...' />
          )}

          {status === 'feedback' &&
            (feedback ? (
              <div className='space-y-3 w-full'>
                <div className='text-center'>
                  <p className='text-gray-600'>Điểm của bạn</p>
                  <p className={`text-7xl font-bold ${scoreColor}`}>
                    {feedback.score}
                    <span className='text-3xl text-gray-400'>/100</span>
                  </p>
                </div>
                <div className='bg-gray-50 p-3 rounded-lg text-sm'>
                  <h4 className='font-semibold text-gray-700'>Thanh điệu</h4>
                  <p className='text-gray-600'>{feedback.toneFeedback}</p>
                </div>
                <div className='bg-gray-50 p-3 rounded-lg text-sm'>
                  <h4 className='font-semibold text-gray-700'>Âm đầu & cuối</h4>
                  <p className='text-gray-600'>
                    <strong>Âm đầu:</strong> {feedback.initialFeedback}
                    <br />
                    <strong>Âm cuối:</strong> {feedback.finalFeedback}
                  </p>
                </div>
                <div className='bg-blue-50 p-3 rounded-lg text-sm border-l-4 border-blue-400'>
                  <h4 className='font-semibold text-blue-800'>Mẹo cải thiện</h4>
                  <p className='text-blue-700'>{feedback.summary}</p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className='w-full mt-2 px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200'
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <p className='text-red-500'>{error || 'Đã có lỗi xảy ra.'}</p>
            ))}
        </div>
      </div>
    </div>
  );
};
