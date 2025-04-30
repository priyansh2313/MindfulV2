// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (_, action) => action.payload,
    logout: () => null,
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
