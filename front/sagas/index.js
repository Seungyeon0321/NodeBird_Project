import { all, fork } from "redux-saga/effects";

import postSaga from "./post";
import userSaga from "./user";
import axios from "axios";

axios.defaults.baseURL = "http://35.183.15.248";
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
