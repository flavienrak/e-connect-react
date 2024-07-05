"use client";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import persistSlice from "./slices/persistSlice";
import usersSlice from "./slices/usersSlice";
import userSlice from "./slices/userSlice";
import postsSlice from "./slices/postsSlice";
import messagesSlice from "./slices/messagesSlice";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persistInfos"],
};

const rootReducer = combineReducers({
  user: userSlice,
  users: usersSlice,
  posts: postsSlice,
  messages: messagesSlice,
  persistInfos: persistSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export default store;
export { persistor };
