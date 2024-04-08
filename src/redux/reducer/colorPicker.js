import { ActionType } from "../actionType/actionType";

const intialState = [];

export const colorPicker = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionType.COLOR_SHOW:
      return { ...state, [payload]: true };
    case ActionType.COLOR_HIDE:
      return { ...state, [payload]: false };
    default:
      return state;
  }
};