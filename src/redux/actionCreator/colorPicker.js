import { ActionType } from "../actionType/actionType";

export const colorShow = (index) => {
  return {
    type: ActionType.COLOR_SHOW,
    payload: index,
  };
};

export const colorHide = (index) => {
  return {
    type: ActionType.COLOR_HIDE,
    payload: index,
  };
};