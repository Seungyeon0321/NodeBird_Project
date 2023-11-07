import {
  all,
  fork,
  takeEvery,
  takeLatest,
  call,
  put,
  delay,
  throttle,
} from "redux-saga/effects";
import axios from "axios";

import {
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  LOAD_POST_SUCCESS,
  LOAD_POST_REQUEST,
  LOAD_POST_FAILURE,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_FAILURE,
  ADD_POST_SUCCESS,
  ADD_POST_REQUEST,
  ADD_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_REQUEST,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";
import shortid from "shortid";

//get method로는 data를 못 받기 때문에 ?를 이용해서 'key = 값' 형식으로 받아야 한다 (주소에 데이터가 다 포함되어 있다고 생각하면 된다) 이렇게 하면 데이터 캐싱까지 같이 되기 때문에 좋다는데 찾아봐야 할듯
function loadPostAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.lastId);
    yield put({
      type: LOAD_POST_SUCCESS,
      //여기 action.data는 어떤 게시글이 지워졌는지 id가 들어있을 것이다
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POST_FAILURE,
    });
  }
}

//여기 data에 게시글이 들어있어야 한다, 그럼 이제 이 녀석을
//back으로 넘겨줘야 한다.

//이렇게 data만 넘기는 게 아니라 content라는 이름이 붙여줘야
//백엔드에서 req.body.content로 해당 data에 접근이 가능하다.

//formData를 받기 때문에 data 그대로 보내줘야 함
function addPostAPI(data) {
  console.log(data);
  return axios.post("/post", data);
}

function* addPost(action) {
  try {
    //해당 result에 우리가 back에서 보낸 데이터가 들어있다
    const result = yield call(addPostAPI, action.data);
    //포스트가 한개 생성될때마다 해당 id가 data 즉 내용물에 들어오는 포스팅에 해당 id를 전달해주는 구조이다
    const id = shortid.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      //여기 action.data는 어떤 게시글이 지워졌는지 id가 들어있을 것이다
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
    });
  }
}

function removePostAPI(data) {
  //delete API는 data 못 넣는다
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

//게시글의 일부분을 수정하는 거이기 떄문에 patch로 보낸다
//여기서 data는 postId이다
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);

    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);

    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  //form 데이터는 이렇게 data로 그대로 가지고 와야 함, 만약
  //무언가로 감싸주게 되면 JSON 데이터가 되버림
  return axios.post(`/post/images`, data);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`, data);
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get(`post/${data}`);
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.data);

    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);

    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(
    `/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`
  );
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    console.log("해쉬태그 리절트!!", result);

    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLoadPost() {
  yield throttle(5000, LOAD_POST_REQUEST, loadPost);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchloadPosts() {
  yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchloadPosts),
    fork(watchRetweet),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
  ]);
}
