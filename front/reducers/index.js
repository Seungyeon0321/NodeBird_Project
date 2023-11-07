import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from "./user";
import post from "./post";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;

//state로 바꾸고 싶다면 이렇게 action을 만들어줘서 만들어줘야 한다,, state.name = 'Seungyeon Ji' 라고 그 히스토리까지 없어져버리기 때문에
// const changeNickname = {
//   type: "CHANGE_NICKNAME",
//   data: "Seungyeon Ji",
// };
//하지만 data같은 경우에는 이렇게 하드코딩을 할 수 없기 때문에 이러한 action을 만들어주는 action creator function을 만들어줘야 한다

// 만약에 action으로 이름을 다른 hardcoding된 이름이
// 아니라 동적으로 바꾸고 싶을 때 이런식으로 action creator의 함수를 받들어서
// data를 매개변수로 받아서 해당 이름을 매개변수로 보내줌으로써 계속해서 바꿀 수 있다
//action creator
// const changeNickname = (data) => {
//   return {
//     type: "CHANGE_NICKNAME",
//     name: data,
//   };
// };

// (이전상태, 액션) => 다음상태 를 만들어내는 함수가 reducer이다
// reducer 자체가 함수이기 때문에, 그 함수끼리 합치는 게 어려워서
// combineReducers을 사용한다
