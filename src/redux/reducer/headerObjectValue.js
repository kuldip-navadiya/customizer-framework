import { ActionType } from "../actionType/actionType";

const intialState = [];

export const headerObjectValue = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionType.HEADER_OBJECT_VALUE:
      return payload;
    default:
      return state;
  }
};