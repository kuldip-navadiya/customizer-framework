import { ActionType } from "../actionType/actionType";

export const updateObjectValue = (data) => {
  return {
    type: ActionType.OBJECT_VALUE,
    payload: data,
  };
};

export const updatePreviewType = (data) => {
  return {
    type: ActionType.preview,
    payload: data,
  };
};
