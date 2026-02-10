// redux/store.ts
import { IUSER } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import authReducer, { setUser } from "./slice/auth-slice";
import bracReducer from './slice/bracsSlice';
import screenReducer from "./slice/checkScreen";
import fundCardReducer from "./slice/fundCardSlice";
import { default as intentReducer, default as themesReducer } from './slice/themeSlice';
import storage from "./storage";

const reducers = combineReducers({
  auth: authReducer,
  screen: screenReducer,
  themes: themesReducer,
  intents: intentReducer,
  fundCardSlice: fundCardReducer,
  bracDetails: bracReducer,
});

const persistConfig = { 
  key: "root", 
  storage: storage,
  // Optional: whitelist specific reducers to persist
  // whitelist: ['auth', 'themes'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      thunk: true 
    }),
});

export const persistor = persistStore(store);
export const dispatch = store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Helper to get state outside components
export const getState = () => store.getState();

// Typed version of useAppState
export const useAppState = <T extends keyof RootState = keyof RootState>(node: T) => useSelector((state: RootState) => state[node]);
// Update profile helper
export const onUpdateProfile = (object: IUSER | any) => {
  const user = store.getState().auth || {};
  dispatch(setUser({ ...user, ...object }));
};

export default store;