import { ActionType } from "../actionType/actionType";

export const updatePreviewType = (data) => {
  return {
    type: ActionType.preview,
    payload: data,
  };
};