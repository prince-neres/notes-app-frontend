import { combineReducers } from "redux";
import main_reducers from "./reducers/main_reducers";
import auth_reducers from "./reducers/auth_reducers";

export default combineReducers({
  auth_reducers,
  main_reducers,
});
