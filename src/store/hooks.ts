import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import {
  useNotifications
} from 'reapop';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Notification hooks từ reapop
export const useAppNotifications = useNotifications;
