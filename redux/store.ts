import { IUSER } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
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
const persistConfig = {key: "root", storage: storage};
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false, thunk: true}),
});

export const persistor = persistStore(store);
export const dispatch = store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const getState = () => store.getState();
// @ts-ignore
export const useAppState = (node = 'auth') => useSelector((state: RootState) => state[node]);

export const onUpdateProfile = (object: IUSER | any) => {
  const user = store.getState().auth || {}
  dispatch(setUser({...user, ...object}));
}


export default store;
