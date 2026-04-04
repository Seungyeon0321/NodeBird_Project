import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import ui from "./ui";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE: {
      // 서버 GET /user가 쿠키 없이 호출되면 me가 null로 옵니다(배포 도메인 불일치, axios.defaults 경쟁 등).
      // 그대로 merge하면 로고(router.push("/"))처럼 홈을 다시 그릴 때 클라이언트 로그인 상태가 지워집니다.
      const serverUser = action.payload.user;
      const clientUser = state.user;
      const me =
        serverUser?.me != null ? serverUser.me : clientUser?.me ?? null;

      return {
        ...state, // preserve client state
        ...action.payload, // apply server state
        // Handle state slices individually if needed
        user: {
          ...clientUser,
          ...serverUser,
          me,
          isLoggedIn: !!me,
          clickNavLogin: clientUser.clickNavLogin,
          clickNavSignup: clientUser.clickNavSignup,
          clickNavLogo: clientUser.clickNavLogo,
        },
        post: {
          ...state.post, // preserve post client state
          ...action.payload.post, // apply server state
        },
        ui: {
          ...state.ui, // preserve ui client state
          ...action.payload.ui, // apply server state
        },
      };
    }
    default: {
      const combineReducer = combineReducers({
        user,
        post,
        ui,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;
