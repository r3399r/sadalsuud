import { configureStore, PayloadAction, Store } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './authSlice';
import uiReducer, { UiState } from './uiSlice';

export type RootState = {
  auth: AuthState;
  ui: UiState;
};

let store: Store<RootState>;

export const configStore = () => {
  store = configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
  });

  return store;
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
