import { produce } from "immer";

export const initialState = {
  currentView: "main", // main, login, signup, profile
  isLoading: false,
};

export const SET_CURRENT_VIEW = "SET_CURRENT_VIEW";

const uiReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SET_CURRENT_VIEW:
        draft.currentView = action.data;
        break;
      default:
        break;
    }
  });
};

export default uiReducer;
