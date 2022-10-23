import {
  combineReducers,
  createStore,
  applyMiddleware
} from "redux";
import storage from "redux-persist/lib/storage";
import { userReducer, feedReducer, notifications } from "./reducer/reducer";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";


const persistConfig = {
  key: 'exo',
  storage,
  whitelist: [
    "userReducer",
    "feedReducer",
    "notifications"
  ]
}


let rootReducer = combineReducers({
  userReducer,
  feedReducer,
  notifications
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk))


