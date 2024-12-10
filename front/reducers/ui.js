import { produce } from "immer";

export const initialState = {
  currentView: "main", // main, login, signup, profile, post
  isLoading: false,
  isPosting: false,
};

export const SET_CURRENT_VIEW = "SET_CURRENT_VIEW";
export const SET_IS_POSTING = "SET_IS_POSTING";

const uiReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SET_CURRENT_VIEW:
        draft.currentView = action.data;
        break;
      case SET_IS_POSTING:
        draft.isPosting = action.data;
        break;

      default:
        break;
    }
  });
};

export default uiReducer;
