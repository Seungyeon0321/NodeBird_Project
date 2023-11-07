import { produce } from "immer";

export const initialState = {
  removeFollowerLoading: false, //팔로워 차단하기 오기
  removeFollowerDone: false,
  removeFollowerError: null,

  loadFollowersLoading: false, //팔로워 가지고 오기
  loadFollowersDone: false,
  loadFollowersError: null,

  loadFollowingsLoading: false, //팔로잉 가지고 오기
  loadFollowingsDone: false,
  loadFollowingsError: null,

  loadMyInfoLoading: false, //유저정보 가지고 오기
  loadMyInfoDone: false,
  loadMyInfoError: null,

  loadUserLoading: false, //유저정보 가지고 오기
  loadUserDone: false,
  loadUserError: null,

  isLoggingIn: false, //로그인 시도중 -> 로딩창을 띄을 수 있도록 해당 state가 필요한 거임
  isLoggedIn: false,
  logInError: null,

  isLoggingOut: false, //로그아웃 시도중
  isLoggedOut: false,
  logOutError: null,

  isSigningUp: false, // 회원가입 시도중
  isSignedUp: false,
  signUpError: null,

  followingLoading: false, // 팔로우 시도중
  followingDone: false,
  followingError: null,

  unfollowingLoading: false, //언 팔로우 시도중
  unfollowingDone: false,
  unfollowingError: null,

  changeNicknameLoading: false, //닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,

  me: null,
  singUpData: {},
  loginData: {},
  userInfo: null,
};

//index.js 파일에 있던 user와 관련된 action은 다 이렇게 파일을 따로 만들어서 가지고 와야 한다

export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const SIGN_UP_REQUEST = "SING_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SING_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SING_UP_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

//해당 액션들은 만약 post reqeust라는 action이 들어왔을 때 post가 success됐을 때
//사가가 이를 탐지 하고 나에 관한 post 갯수를 1개씩 올려주기 위함이다
export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export const logInRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    info: "Let reducer know about the type",
    data,
    //action안에 return 해서 보내는 이 data는 어디서 받을 수 있을까?
  };
};

export const logOutRequestAction = (data) => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoError = null;
        draft.loadMyInfoDone = false;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.me = action.data;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoDone = true;
        draft.loadMyInfoError = action.error;
        break;

      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserError = null;
        draft.loadUserDone = false;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.loadUserDone = true;
        draft.userInfo = action.data;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserDone = true;
        draft.loadUserError = action.error;
        break;

      case FOLLOW_REQUEST:
        draft.followingLoading = true;
        draft.followingDone = false;
        draft.followingError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followingLoading = false;
        draft.followingDone = true;
        draft.me.Followings.push({ id: action.data.UserId });
        break;
      case FOLLOW_FAILURE:
        draft.followingDone = true;
        draft.followingError = action.error;
        break;

      case UNFOLLOW_REQUEST:
        draft.unfollowingLoading = true;
        draft.unfollowingDone = false;
        draft.unfollowingError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowingLoading = false;
        draft.unfollowingDone = true;
        //그 언팔로워 한 사람만 빼고 나머지는 남게 된다
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.data.UserId
        );
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowingDone = true;
        draft.unfollowingError = action.error;
        break;

      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsDone = true;
        draft.me.Followings = action.data;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadFollowingsDone = true;
        draft.loadFollowingsError = action.error;
        break;

      case LOAD_FOLLOWERS_REQUEST:
        draft.loadFollowersLoading = true;
        draft.loadFollowersDone = false;
        draft.loadFollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.loadFollowersLoading = false;
        draft.loadFollowersDone = true;
        draft.me.Followers = action.data;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadFollowersDone = true;
        draft.loadFollowersError = action.error;
        break;

      case REMOVE_FOLLOWER_REQUEST:
        draft.removeFollowerLoading = true;
        draft.removeFollowerDone = false;
        draft.removeFollowerError = null;
        break;
      case REMOVE_FOLLOWER_SUCCESS:
        draft.removeFollowerLoading = false;
        draft.removeFollowerDone = true;
        draft.me.Followers = draft.me.Followers.filter(
          (v) => v.id !== action.data.UserId
        );
        break;
      case REMOVE_FOLLOWER_FAILURE:
        draft.removeFollowerDone = true;
        draft.removeFollowerError = action.error;
        break;

      case LOG_IN_REQUEST:
        draft.isLoggedIn = true;
        break;
      case LOG_IN_SUCCESS:
        draft.isLoggingIn = false;
        draft.isLoggedIn = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        console.log(action);
        draft.isLoggedIn = true;
        draft.logInError = action.error.response;
        break;

      case LOG_OUT_REQUEST:
        draft.isLoggingOut = true;
        draft.isLoggedOut = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.isLoggingOut = false;
        draft.isLoggedOut = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.isLoggedOut = false;
        draft.logOutError = action.error;
        break;

      case SIGN_UP_REQUEST:
        draft.isSigningUp = true;
        draft.isSignedUp = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.isSigningUp = false;
        draft.isSignedUp = true;
        draft.me = null;
        break;
      case SIGN_UP_FAILURE:
        draft.isSignedUp = false;
        draft.signUpError = action.error;
        break;

      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameDone = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.me.nickname = action.data.nickname;
        draft.changeNicknameDone = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameDone = false;
        draft.changeNicknameError = action.error;
        break;

      case ADD_POST_TO_ME:
        draft.me.posts.unshift({ id: action.data });
        break;
      //이 부분도 아래 immer사용 안했을 때랑 비교해보자
      case REMOVE_POST_OF_ME:
        draft.me.posts = draft.me.posts.filter((v) => v.id !== action.data);
        break;

      default:
        break;
    }
  });
  // switch (action.type) {
  //   case LOG_IN_REQUEST:
  //     return {
  //       ...state,
  //       isLoggingIn: true,
  //     };
  //   case LOG_IN_SUCCESS:
  //     return {
  //       isLoggingIn: false,
  //       isLoggedIn: true,
  //       me: dummyUser(action.data),
  //     };
  //   case LOG_IN_FAILURE:
  //     console.log("이건 왜?");
  //     return {
  //       ...state,
  //       isLoggedIn: true,
  //       logInError: action.error,
  //     };

  //   case LOG_OUT_REQUEST:
  //     return {
  //       ...state,
  //       isLoggingOut: true,
  //       isLoggedOut: false,
  //       logOutError: null,
  //     };
  //   case LOG_OUT_SUCCESS:
  //     return {
  //       ...state,
  //       isLoggingOut: false,
  //       isLoggedOut: true,
  //       me: null,
  //     };
  //   case LOG_OUT_FAILURE:
  //     return {
  //       ...state,
  //       isLoggedOut: false,
  //       logOutError: action.error,
  //     };

  //   case SIGN_UP_REQUEST:
  //     return {
  //       ...state,
  //       isSigningUp: true,
  //       isSignedUp: false,
  //       signUpError: null,
  //     };
  //   case SIGN_UP_SUCCESS:
  //     return {
  //       ...state,
  //       isSigningUp: false,
  //       isSignedUp: true,
  //       me: null,
  //     };
  //   case SIGN_UP_FAILURE:
  //     return {
  //       ...state,
  //       isSignedUp: false,
  //       signUpError: action.error,
  //     };

  //   case CHANGE_NICKNAME_REQUEST:
  //     return {
  //       ...state,
  //       changeNicknameDone: true,
  //       changeNicknameDone: false,
  //       changeNicknameError: null,
  //     };
  //   case CHANGE_NICKNAME_SUCCESS:
  //     return {
  //       ...state,
  //       changeNicknameDone: false,
  //       changeNicknameDone: true,
  //     };
  //   case CHANGE_NICKNAME_FAILURE:
  //     return {
  //       ...state,
  //       changeNicknameDone: false,
  //       changeNicknameError: action.error,
  //     };
  //   case ADD_POST_TO_ME:
  //     return {
  //       ...state,
  //       me: {
  //         ...state.me,
  //         //posts 배열에서 이 action.data는 post 사가에서 보내온 data가 action을 프롭으로 해서 들어오게 되는것이다. 그리고 이 들어오는 id를 먼저 배치하고,
  //         //이 전 있었던 posts의 아디는 그대로 유지해서 불변성의 법칙을 지키게 되는 구조다
  //         posts: [{ id: action.data }, ...state.me.posts],
  //       },
  //     };
  //   case REMOVE_POST_OF_ME:
  //     return {
  //       ...state,
  //       me: {
  //         ...state.me,
  //         //posts 배열에서 이 action.data는 post 사가에서 보내온 data가 action을 프롭으로 해서 들어오게 되는것이다. 그리고 이 들어오는 id를 먼저 배치하고,
  //         //이 전 있었던 posts의 아디는 그대로 유지해서 불변성의 법칙을 지키게 되는 구조다
  //         posts: state.me.posts.filter((v) => v.id !== action.data),
  //       },
  //     };

  //   default:
  //     return state;
  // }
};

export default reducer;
