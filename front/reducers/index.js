import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import ui from "./ui";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state, // preserve client state
        ...action.payload, // apply server state
        // Handle state slices individually if needed
        user: {
          ...state.user, // preserve user client state
          ...action.payload.user, // apply server state
          clickNavLogin: state.user.clickNavLogin,
          clickNavSignup: state.user.clickNavSignup,
          clickNavLogo: state.user.clickNavLogo,
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
