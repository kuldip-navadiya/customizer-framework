import { ActionType } from "../actionType/actionType";

var url_string = window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get("id") ? url.searchParams.get("id") : '';
var preview = url.searchParams.get("preview") ? url.searchParams.get("preview") : id;

const intialState = preview;

export const previewType = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionType.preview:
      return payload;
    default:
      return state;
  }
};
