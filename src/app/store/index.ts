import { setAutoFreeze } from "immer";
import { createStore, type StoreEnhancer } from "redux";
import { persistReducer, persistStore, type Persistor } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

import { persistMigrate, STATE_MIGRATION_VERSION } from "app/store/stateMigration";
import initialState from "initialState";
import rootReducer from "reducers/index";
import { APP_STORAGE_KEY, PERSISTANCE_FILTER } from "store-constants";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
  }
}

setAutoFreeze(false);
const storage = createWebStorage("local");

const devToolsEnhancer: StoreEnhancer | undefined =
  import.meta.env.MODE !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

const persistConfig = {
  key: APP_STORAGE_KEY,
  version: STATE_MIGRATION_VERSION,
  storage,
  migrate: persistMigrate,
  whitelist: [...PERSISTANCE_FILTER],
  throttle: 100
};

const persistedReducer = persistReducer(persistConfig, rootReducer as never);

export const store = devToolsEnhancer
  ? createStore(persistedReducer, initialState as never, devToolsEnhancer)
  : createStore(persistedReducer, initialState as never);

export const persistor: Persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
