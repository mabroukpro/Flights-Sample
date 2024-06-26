import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import layoutReducer from "./layoutSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
