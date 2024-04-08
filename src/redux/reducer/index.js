import { combineReducers } from "redux";
import { objectValue } from "./objectValue";
import { headerObjectValue } from "./headerObjectValue";
import { previewType } from "./previewType";
import { colorPicker } from "./colorPicker";

const reducers = combineReducers({
    previewType: previewType,
    objectValue: objectValue,
    headerObjectValue: headerObjectValue,
    colorPicker: colorPicker
  });
  export default reducers;
