import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAIInteractionStats, getFullAIInteraction } from '../../services/apiService';
import { HistoryItem, clearFilters, fetchHistory, setFilters, setPagination } from '../../store/slices/historySlice';
import { AppDispatch, RootState } from '../../store/store';
import { HistoryDisplay } from '../common/HistoryDisplay';
import { LoadingSpinner } from '../common/LoadingSpinner';

// Helper functions
const getEndpointLabel = (endpoint: string) => {
  switch (endpoint) {
    case 'analyzeImage':
      return 'Phân tích hình ảnh';
    case 'generateExercises':
      return 'Tạo bài tập';
    case 'analyzeWordDetails':
      return 'Phân tích từ vựng';
    case 'analyzePronunciation':
      return 'Luyện phát âm';
    default:
      return 'Khác';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'timeout':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success':
      return 'Thành công';
    case 'error':
      return 'Lỗi';
    case 'pending':
      return 'Đang xử lý';
    case 'timeout':
      return 'Hết thời gian';
    default:
      return 'Không xác định';
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Không xác định';
  }
};

const formatResponseTime = (timeMs: number) => {
  if (timeMs < 1000) {
    return `${timeMs}ms`;
  }
  return `${(timeMs / 1000).toFixed(2)}s`;
};

// Component hiển thị thống kê
const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAIInteractionStats({});
        if (result.success) {
          setStats(result.data);
        } else {
          setError('Không thể tải thống kê');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        setError('Đã có lỗi xảy ra khi tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <LoadingSpinner text="Đang tải thống kê..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="text-center text-red-600">
          <p className="mb-2">Lỗi khi tải thống kê:</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="text-center text-gray-500">
          <p>Không có dữ liệu thống kê</p>
        </div>
      </div>
    );
  }

  // Kiểm tra cấu trúc stats object và cung cấp giá trị mặc định
  const overview = stats.overview || {};
  const performance = stats.performance || {};
  const contentAnalysis = stats.contentAnalysis || {};

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Thống kê tổng quan</h3>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{overview.totalInteractions || 0}</div>
          <div className="text-sm text-blue-800">Tổng tương tác</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{overview.successRate || 0}%</div>
          <div className="text-sm text-green-800">Tỷ lệ thành công</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{performance.avgResponseTime || 0}ms</div>
          <div className="text-sm text-yellow-800">Thời gian TB</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{overview.totalErrors || 0}</div>
          <div className="text-sm text-purple-800">Lỗi</div>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Phân bố thời gian xử lý</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">
              {performance.responseTimeDistribution?.fast || 0}
            </div>
            <div className="text-sm text-green-800">Nhanh (&lt;1s)</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-600">
              {performance.responseTimeDistribution?.normal || 0}
            </div>
            <div className="text-sm text-yellow-800">Bình thường (1-5s)</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">
              {performance.responseTimeDistribution?.slow || 0}
            </div>
            <div className="text-sm text-red-800">Chậm (&gt;5s)</div>
          </div>
        </div>
      </div>

      {/* Content Analysis */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Phân tích nội dung</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {contentAnalysis.totalVocabularyGenerated || 0}
            </div>
            <div className="text-sm text-blue-800">Từ vựng</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">
              {contentAnalysis.totalExercisesGenerated || 0}
            </div>
            <div className="text-sm text-green-800">Bài tập</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">
              {contentAnalysis.totalWordsAnalyzed || 0}
            </div>
            <div className="text-sm text-purple-800">Từ phân tích</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-600">
              {contentAnalysis.totalPronunciationAnalyzed || 0}
            </div>
            <div className="text-sm text-orange-800">Phát âm</div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-right text-sm text-gray-500">
        Cập nhật: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('vi-VN') : 'Không có dữ liệu'}
      </div>
    </div>
  );
};

// Modal xem chi tiết
const DetailModal: React.FC<{
  item: HistoryItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      fetchFullData();
    }
  }, [item]);

  const fetchFullData = async () => {
    if (!item) return;

    // Validation để đảm bảo có ID hợp lệ
    if (!item.id || item.id === 'undefined' || item.id === 'null') {
      console.error('Invalid item ID:', item.id);
      return;
    }

    console.log('Fetching full data for item:', item);
    console.log('Item ID:', item.id);

    setLoading(true);
    try {
      const result = await getFullAIInteraction(item.id);
      if (result.success) {
        console.log('Full data received:', result.data);
        console.log('fullResponseData:', result.data.fullResponseData);
        console.log('response.data:', result.data.response?.data);
        setFullData(result.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chi tiết:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">
            Chi tiết: {getEndpointLabel(item.endpoint)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">ID:</span> {item.id}</div>
                <div><span className="font-medium">Session:</span> {item.sessionId}</div>
                <div><span className="font-medium">Model AI:</span> {item.aiModel}</div>
                <div><span className="font-medium">Thời gian xử lý:</span> {formatResponseTime(item.responseTime)}</div>
                <div><span className="font-medium">Trạng thái:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Thời gian</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Gửi yêu cầu:</span> {formatDate(item.requestTimestamp)}</div>
                <div><span className="font-medium">Nhận phản hồi:</span> {formatDate(item.responseTimestamp)}</div>
                <div><span className="font-medium">Tạo lúc:</span> {formatDate(item.createdAt)}</div>
                <div><span className="font-medium">Cập nhật:</span> {formatDate(item.updatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Hiển thị dữ liệu theo loại endpoint */}
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Đang tải dữ liệu chi tiết..." />
            </div>
          ) : fullData?.fullResponseData ? (
            <div className="mb-6">
              <HistoryDisplay
                data={fullData.fullResponseData}
                endpoint={fullData.endpoint}
                onSpeak={(text) => {
                  // Có thể thêm logic phát âm ở đây
                  console.log('Speak:', text);
                }}
              />
            </div>
          ) : fullData?.response?.data ? (
            <div className="mb-6">
              <HistoryDisplay
                data={fullData.response.data}
                endpoint={fullData.endpoint}
                onSpeak={(text) => {
                  // Có thể thêm logic phát âm ở đây
                  console.log('Speak:', text);
                }}
              />
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">Không thể tải dữ liệu chi tiết</p>
              </div>
            </div>
          )}

          {/* Dữ liệu JSON gốc (có thể ẩn) */}
          <details className="mb-6">
            <summary className="cursor-pointer font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
              Xem dữ liệu JSON gốc
            </summary>
            <div className="mt-3 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Request Payload:</h4>
                <pre className="text-xs overflow-x-auto bg-white p-3 rounded border">
                  {formatJson(item.requestPayload)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Response Data:</h4>
                <pre className="text-xs overflow-x-auto bg-white p-3 rounded border">
                  {formatJson(item.responseData)}
                </pre>
              </div>
            </div>
          </details>

          {/* Lỗi nếu có */}
          {item.errorMessage && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-red-600">Thông báo lỗi</h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800">{item.errorMessage}</p>
              </div>
            </div>
          )}

          {/* Tags và Notes */}
          {(item.tags && item.tags.length > 0 || item.notes) && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Thông tin bổ sung</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-3">
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.tags.map((tag, index) => (
                        <span key={`tag-${item.id}-${index}`} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {item.notes && (
                  <div>
                    <span className="font-medium">Ghi chú:</span>
                    <p className="mt-1 text-gray-700">{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export const HistorySection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, filters, pagination } = useSelector((state: RootState) => state.history);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);

  // Sử dụng useCallback để tránh tạo function mới mỗi lần render
  const fetchHistoryData = useCallback(() => {
    try {
      dispatch(fetchHistory({
        page: pagination.page,
        limit: pagination.limit,
        endpoint: filters.endpoint === 'all' ? undefined : filters.endpoint,
        status: filters.status === 'all' ? undefined : filters.status,
        dateFrom: filters.dateRange.start,
        dateTo: filters.dateRange.end,
        search: filters.searchTerm,
      }));
    } catch (err) {
      console.error('Lỗi khi fetch history:', err);
      setComponentError('Đã có lỗi xảy ra khi tải dữ liệu');
    }
  }, [dispatch, pagination.page, pagination.limit, filters.endpoint, filters.status, filters.dateRange.start, filters.dateRange.end, filters.searchTerm]);

  useEffect(() => {
    // Chỉ fetch khi component mount hoặc dependencies thay đổi
    fetchHistoryData();
  }, [fetchHistoryData]);

  // Debug logging để kiểm tra dữ liệu
  useEffect(() => {
    if (items.length > 0) {
      console.log('History items received:', items);
      console.log('First item:', items[0]);
      console.log('First item ID:', items[0]?.id);
    }
  }, [items]);

  // Error boundary cho component
  if (componentError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Lỗi: {componentError}</div>
        <button
          onClick={() => {
            setComponentError(null);
            window.location.reload();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  const handleFilterChange = (key: string, value: any) => {
    try {
      dispatch(setFilters({ [key]: value }));
    } catch (err) {
      console.error('Lỗi khi thay đổi filter:', err);
      setComponentError('Đã có lỗi xảy ra khi thay đổi bộ lọc');
    }
  };

  const handlePageChange = (page: number) => {
    try {
      dispatch(setPagination({ page }));
    } catch (err) {
      console.error('Lỗi khi thay đổi trang:', err);
      setComponentError('Đã có lỗi xảy ra khi thay đổi trang');
    }
  };

  // const handleDeleteItem = async (id: string) => {
  //   if (window.confirm('Bạn có chắc muốn xóa mục này khỏi lịch sử?')) {
  //     try {
  //       await dispatch(deleteHistoryItem(id));
  //     } catch (err) {
  //       console.error('Lỗi khi xóa item:', err);
  //       setComponentError('Đã có lỗi xảy ra khi xóa mục');
  //     }
  //   }
  // };

  const getEndpointIcon = (endpoint: string) => {
    switch (endpoint) {
      case 'analyzeImage':
        return '🖼️';
      case 'generateExercises':
        return '📝';
      case 'analyzeWordDetails':
        return '🔍';
      case 'analyzePronunciation':
        return '🎤';
      default:
        return '📋';
    }
  };

  const getContentSummary = (item: HistoryItem) => {
    try {
      if (item.responseData) {
        if (item.endpoint === 'analyzeImage' && item.responseData.vocabulary) {
          return `Phân tích ${item.responseData.vocabulary.length} từ vựng`;
        }
        if (item.endpoint === 'generateExercises' && item.responseData.exercises) {
          return `Tạo ${item.responseData.exercises.length} bài tập`;
        }
        if (item.endpoint === 'analyzeWordDetails' && item.responseData.word) {
          return `Phân tích từ: ${item.responseData.word}`;
        }
        if (item.endpoint === 'analyzePronunciation' && item.responseData.pronunciation) {
          return 'Phân tích phát âm';
        }
      }
      return 'Nội dung AI';
    } catch (error) {
      return 'Nội dung AI';
    }
  };

  const renderHistoryItem = (item: HistoryItem) => (
    <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{getEndpointIcon(item.endpoint)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{getEndpointLabel(item.endpoint)}</h3>
              <p className="text-sm text-gray-500">{getContentSummary(item)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span>🕒 {formatDate(item.requestTimestamp)}</span>
            <span>⏱️ {formatResponseTime(item.responseTime)}</span>
            <span>🤖 {item.aiModel}</span>
            {item.tags && item.tags.length > 0 && (
              <span>🏷️ {item.tags.join(', ')}</span>
            )}
          </div>

          {item.errorMessage && (
            <p className="text-red-600 text-sm mb-2">Lỗi: {item.errorMessage}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {getStatusLabel(item.status)}
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedItem(item)}
              className="px-3 py-1 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              Xem chi tiết
            </button>
            {/* <button
              onClick={() => handleDeleteItem(item.id)}
              className="px-3 py-1 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              Xóa
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Lỗi: {error}</div>
        <button
          onClick={() => dispatch(fetchHistory({}))}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử AI Interactions</h1>
          <p className="text-gray-600">Tổng cộng {pagination.total} mục</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            {showStats ? 'Ẩn thống kê' : 'Hiện thống kê'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && <StatsSection />}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-4">Bộ lọc</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div key="endpoint-filter">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại API
              </label>
              <select
                value={filters.endpoint}
                onChange={(e) => handleFilterChange('endpoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="analyzeImage">Phân tích hình ảnh</option>
                <option value="generateExercises">Tạo bài tập</option>
                <option value="analyzeWordDetails">Phân tích từ vựng</option>
                <option value="analyzePronunciation">Luyện phát âm</option>
              </select>
            </div>

            <div key="status-filter">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="success">Thành công</option>
                <option value="error">Lỗi</option>
                <option value="pending">Đang xử lý</option>
                <option value="timeout">Hết thời gian</option>
              </select>
            </div>

            <div key="date-from-filter">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div key="date-to-filter">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => dispatch(clearFilters())}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* History Items */}
      <div className="space-y-4">
        {items.map(renderHistoryItem)}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              Trang {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};
