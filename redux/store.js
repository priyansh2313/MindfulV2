

import { configureStore } from '@reduxjs/toolkit';
import yourReducer from './yourSlice'; // ⚠️ replace with actual slice

const store = configureStore({
  reducer: {
    yourFeature: yourReducer, // you can name it anything
  },
});

export default store;
