import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// define the type of state
export type AuthState = {
  isLogin: boolean;
};

// define the initial value of state
const initialState: AuthState = {
  isLogin: false,
};

// define the actions in "reducers"
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginStatus: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    reset: (state: AuthState) => {
      state.isLogin = false;
    },
  },
});

// action creators are generated for each case reducer function
export const { setLoginStatus, reset } = authSlice.actions;

export default authSlice.reducer;
