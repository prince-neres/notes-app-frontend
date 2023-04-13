import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import reducers from "./reducers";
import sessionStorage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  blacklist: ["main_reducers"],
};

const pReducer = persistReducer(persistConfig, reducers);

const DEFAULT_STATE = {};

const store = createStore(pReducer, DEFAULT_STATE, applyMiddleware(thunk));

const persistor = persistStore(store);
export { persistor, store };
