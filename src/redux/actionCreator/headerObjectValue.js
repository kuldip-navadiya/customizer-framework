import { ActionType } from "../actionType/actionType";

export const updateHeaderOptionsData = (data) => {
    return {
      type: ActionType.HEADER_OBJECT_VALUE,
      payload: data,
    };
  };