import { all, fork, takeLatest, call, put, delay } from "redux-saga/effects";
import axios from "axios";

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
} from "../reducers/user";

//Saga가 동작하는 순서는 대략 이렇다,
//이벤트 리스너처럼 watchLogIn이 실행이 되면, logIn generator함수가 실행이 되고 이 함수에서 result를 받게 되면 logInAPI콜을 받아 그 값을 result에 넣게 된다

//이 API함수는 generator함수가 아닌점에 주의하라

//call은 비동기 함수 호출이고 fork은 동기함수의 호출이다, 즉 call을 하면 이 logInAPI가 값을 return할 때까지 기다린다

//굳이 yield를 넣어 해당 기능을 실행시키는 이유는 나중에 해당 코드가 잘 동작하는지에 대한 test를 수행할때 정말 유용하기 때문이다
// const l = login({type: 'LOG_IN_REQUEST', data: {id: jiseungyeon0321@getNamedMiddlewareRegex.com}})
// l.next();
// l.nexT()

//남의 정보를 가지고 올 경우
function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    //put을 dispatch라고 생각하면 된다, 그리고 put안에는 redux의 action과 비슷한 느낌으로 객체가 들어가 있다
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

//내 정보를 가지고 올 경우
function loadMyInfoAPI(data) {
  return axios.get("/user", data);
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    //put을 dispatch라고 생각하면 된다, 그리고 put안에는 redux의 action과 비슷한 느낌으로 객체가 들어가 있다
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err,
    });
  }
}

function logInAPI(data) {
  return axios.post("/user/login", data);
}

function* logIn(action) {
  try {
    //logInAPI(action.data)라고 생각하면 된다, 하지만 call을 이용하면 매개변수를 저렇게 펼쳐줘야 한다

    const result = yield call(logInAPI, action.data);
    //put을 dispatch라고 생각하면 된다, 그리고 put안에는 redux의 action과 비슷한 느낌으로 객체가 들어가 있다
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err,
    });
  }
}

function logOutAPI() {
  return axios.post("/user/logout");
}

function* logOut() {
  try {
    //logInAPI(action.data)라고 생각하면 된다, 하지만 call을 이용하면 매개변수를 저렇게 펼쳐줘야 한다
    //put을 dispatch라고 생각하면 된다, 그리고 put안에는 redux의 action과 비슷한 느낌으로 객체가 들어가 있다
    yield call(logOutAPI);

    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post("http://localhost:3065/user", data);
  //post, put같은 경우는 data를 넘길 수 있다
  //여기 data에 email, nickname, password가 들어있는 것을 확인할 수 있다
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    //logInAPI(action.data)라고 생각하면 된다
    //하지만 call을 이용하면 매개변수를 저렇게 펼쳐줘야 한다

    //put을 dispatch라고 생각하면 된다
    //그리고 put안에는 redux의 action과 비슷한 느낌으로 객체가 들어가 있다
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

//여기서 주의해야할 점이 Watch 친구들은 다 일회용이다, 그렇기 때문에 while이 있어야 한다, 하지만 while은 동기적으로 동작하기 때문에 takeEvery로 사용해서 비동기적으로 동작시켜야 한다

//takeLatest는 마우스를 두번 따닥 눌러도 여러번 요청이 가지 않게 할 수 있다, 마지막 요청만 보낸다, 반대는 takeLeading, 하지만 이 경우 요청을 취소하는 것이 아니라 응답에서 제일 마지막 것만 받아오기 때문에 서버에 무리를 주는 것은 똑같다, 그래서 서버에서 똑같은 녀석이 들어오지 않았는가를체크를 해줘야함
//그래서 요청 상태에서 여러번 요청을 방지하는 것이 throttle이 있다, 해당 effect는 그 시간을 설정해줘야 한다

function followAPI(data) {
  //여기서 그 클릭한 대상의 id가 들어오는 거임
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

//해당 data에는 사용자 Id가 들어가야한다
function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);

    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", { nickname: data });
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);

    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err,
    });
  }
}

function loadFollowersAPI(data) {
  return axios.get("/user/followers", data);
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);

    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get("/user/followings", data);
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);

    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err,
    });
  }
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);

    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err,
    });
  }
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
  //take는 이 LOG_IN action이 실행될때까지 기다린다는 의미이고 만약 실행된다면 logIn generator을 실행한다
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

export default function* userSaga() {
  yield all([
    fork(watchMyInfo),
    fork(watchRemoveFollower),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchChangeNickname),
    fork(watchLoadUser),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
  ]);
}
