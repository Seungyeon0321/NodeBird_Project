import { all, fork } from "redux-saga/effects";

import postSaga from "./post";
import userSaga from "./user";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3065";
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  //fork는 함수를 실행하는 것이고, all은 상위 3개의
  //함수를 모두 사용할 때 사용된다, 배열로 값을 받는다, fork와 call은 다르다는 점을 주의하자
  yield all([fork(postSaga), fork(userSaga)]);
}
