import { ActionType } from "../actionType/actionType";

const intialState = {};

export const objectValue = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionType.OBJECT_VALUE:
      return payload;
    default:
      return state;
  }
};
