import { createStore, combineReducers } from "redux";
import authReducer from "../reducers/reducer";
import Page from "../reducers/pages";

const rootReducer = combineReducers({
  pageState: Page,
  authState: authReducer
});

const store = createStore(rootReducer);

export default store;
