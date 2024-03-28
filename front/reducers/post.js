import shortId from "shortid";
import { produce } from "immer";
import { faker } from "@faker-js/faker";

export const initialState = {
  //이런 더미 데이터를 만들 때도 어떤 형식으로 데이터가 오는지
  //서버 개발자하고 상의 하는 것이 좋다
  mainPosts: [],
  imagePaths: [],
  singlePost: null,
  //이게 false면 아예 데이터를 가져올 시도를 안하게 되는 로직
  hasMorePost: true,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  uploadImagesLoading: false, //업로드 이미지 시도중
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false, //리트윗 시도중
  retweetDone: false,
  retweetError: null,
};

//가짜 더미 데이터 만들때 워선 20개의 자리를 만들어주고 채워주는데 이 채워주는 녀석을 map으로 하나씩 돌아가면서 만들어주는 것이다. 지금 여기는 20개만 만들었지만 성능 최적화를 위해서는 수천개를 만들어주는 것을 권장한다.

// export const generateDummyPost = (number) => {
//   return Array(number)
//     .fill()
//     .map((v, i) => ({
//       id: shortId.generate(),
//       User: {
//         id: shortId.generate(),
//         nickName: "123",
//       },
//       content: "123",
//       images: [
//         {
//           src: "",
//         },
//       ],
//       Comments: [
//         {
//           User: {
//             id: shortId.generate(),
//             nickName: "123",
//           },
//           content: "123",
//         },
//       ],
//     }));
// };

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

//동기 액션은 이렇게 하나만 지운다
export const REMOVE_IMAGE = "REMOVE_IMAGE";

//이렇게 타입을 변수 빼주는 이유는 오타를 줄이기도 하고 재 사용하기도 편해서이다

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

//reducer란 이전상태의 녀석을 다음 상태로 바꿔주는 함수(딴 불변성을 지키면서)
const reducer = (state = initialState, action) => {
  //immer사용 문법
  return produce(state, (draft) => {
    // 여기서 state가 draft로 이름을 바뀐다고 이해하면 쉽다
    switch (action.type) {
      //만약 해당 이미지를 서버쪽에서도 지우고 싶다면 아래와 같이 비동기로 request, success, failure로 만들어줘야 한다
      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);

      case RETWEET_REQUEST:
        draft.retweetLoading = true;
        draft.retweetError = null;
        draft.retweetDone = false;
        break;
      case RETWEET_SUCCESS:
        draft.retweetLoading = false;
        draft.retweetDone = true;
        draft.mainPosts.unshift(action.data);
        break;
      case RETWEET_FAILURE:
        draft.retweetDone = true;
        draft.retweetError = action.error;
        break;

      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesError = null;
        draft.uploadImagesDone = false;
        break;
      case UPLOAD_IMAGES_SUCCESS:
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.imagePaths = action.data;
        break;
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesDone = true;
        draft.uploadImagesError = action.error;
        break;

      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        //좋아요 누름 사람에게 해당 id를 가지고 있는 사람이 추가된다
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      }
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;

      case UNLIKE_POST_REQUEST:
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        //좋아요 누름 사람에게 해당 id를 가지고 있는 사람이 빠진다
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error;
        break;

      case LOAD_USER_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        //case인 경우에는 break을 사용하는 것을 잊어먹어서는 안된다
        break;
      case LOAD_USER_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_POST_SUCCESS:
        //여기 unshift도 immer문법이다
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.hasMorePost = action.data.length === 10;
        break;
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;

      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        //case인 경우에는 break을 사용하는 것을 잊어먹어서는 안된다
        break;
      case LOAD_POSTS_SUCCESS:
        //여기 unshift도 immer문법이다
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.singlePost = action.data;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;

      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        //case인 경우에는 break을 사용하는 것을 잊어먹어서는 안된다
        break;
      case ADD_POST_SUCCESS:
        //여기 unshift도 immer문법이다
        draft.mainPosts.unshift(action.data);
        draft.addPostLoading = false;
        draft.addPostDone = true;
        //업로드가 성공하면 imagePaths를 초기화 해야 한다
        draft.imagePaths = [];
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;

      case REMOVE_POST_REQUEST:
        console.log(draft.mainPosts);
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.mainPosts = draft.mainPosts.filter(
          (v) => v.id !== action.data.PostId
        );
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      //comment 객체에 접근하려면, 우선 post의 id를 이용하여 댓글이 달릴 post를 찾고, 그 안에 있는 Comments의 객체에 이용해서 접근한다. 이 때, comments 배열에 접근하여 추가를 한다고 하면 그 불변성은 지켜줘야 한다
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        console.log(post);
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;

        //위 코드와 비교해보자 불변성을 지키려면 이렇게 해야하는 것을 위에 저렇게 간단하게 처리하고 있다.
        // const postIndex = state.mainPosts.findIndex(
        //   (v) => v.id === action.data.postId
        // );

        // const post = { ...state.mainPosts[postIndex] }; //
        // post.Comments = [dummyComment(action.data.content), ...post.Comments];
        // const mainPosts = [...state.mainPosts];
        // mainPosts[postIndex] = post;
        // console.log(mainPosts[0]);
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;

      //immer을 쓰게 되면 default도 break가 되야 한다
      default:
        break;
    }
  });

  /////////////// immer가 없었을 경우 state의 불변성을 지키기 위한 코드/////////////
  // switch (action.type) {
  //   case ADD_POST_REQUEST:
  //     return {
  //       ...state,
  //       addPostLoading: true,
  //       addPostDone: false,
  //       addPostError: null,
  //     };
  //   case ADD_POST_SUCCESS:
  //     return {
  //       ...state,
  //       mainPosts: [dummyPost(action.data), ...state.mainPosts],
  //       addPostLoading: false,
  //       addPostDone: true,
  //     };
  //   case ADD_POST_FAILURE:
  //     return {
  //       ...state,
  //       removePostLoading: false,
  //       removePostError: action.error,
  //     };

  //   case REMOVE_POST_REQUEST:
  //     return {
  //       ...state,
  //       removePostLoading: true,
  //       removePostDone: false,
  //       removePostError: null,
  //     };
  //   case REMOVE_POST_SUCCESS:
  //     return {
  //       ...state, //=== 을 해버리면 내가 지우려는 녀석 빼고 다 지우는거다, 그 클릭한 id와 다른 녀석만 mainpost array에 남기고 동일한 녀석은 지워야 하기 때문에
  //       mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
  //       removePostLoading: false,
  //       removePostDone: true,
  //     };
  //   case REMOVE_POST_FAILURE:
  //     return {
  //       ...state,
  //       addPostLoading: false,
  //       addPostError: action.error,
  //     };

  //   //comment 객체에 접근하려면, 우선 post의 id를 이용하여 댓글이 달릴 post를 찾고, 그 안에 있는 Comments의 객체에 이용해서 접근한다. 이 때, comments 배열에 접근하여 추가를 한다고 하면 그 불변성은 지켜줘야 한다
  //   case ADD_COMMENT_REQUEST:
  //     return {
  //       ...state,
  //       addCommentLoading: true,
  //       addCommentDone: false,
  //     };
  //   case ADD_COMMENT_SUCCESS: {
  //     const postIndex = state.mainPosts.findIndex(
  //       (v) => v.id === action.data.postId
  //     );

  //     const post = { ...state.mainPosts[postIndex] }; //
  //     console.log(post); //post를 남긴 첫번째 그러니까 달린 달리는 그 창이 선택됨
  //     console.log("내가쓴 글:", action.data.content); //내가 작성한 문자가 나옴
  //     //만약 해당 포스트에 이렇게 코멘트에 넣고 싶으면 먼저 포스트 자체에 코멘트라는
  //     //array가 있어야 한다. 해당 array가 없으면 이렇게 데이터를 집어넣는 것이 안됨
  //     post.Comments = [dummyComment(action.data.content), ...post.Comments];
  //     const mainPosts = [...state.mainPosts];
  //     mainPosts[postIndex] = post;
  //     console.log(mainPosts[0]);

  //     return {
  //       ...state,
  //       mainPosts,
  //       addCommentLoading: false,
  //       addCommentDone: true,
  //     };
  //   }
  //   case ADD_COMMENT_FAILURE:
  //     return {
  //       ...state,
  //       addCommentLoading: false,
  //       addCommentError: action.error,
  //     };

  //   default:
  //     return state;
  // }
};

export default reducer;
