import React from "react";
import { SketchPicker } from "react-color";
import { useSelector } from "react-redux";

function ColorPicker(props) {

  const displayColorPicker = useSelector((state) => state.colorPicker);
  const {
    label,
    onChange,
    name,
    value,
    colorCode,
    style,
    index,
    onClick,
    closeColorPallet,
    openColorPellet,
  } = props;
  const color = {
    backgroundColor: colorCode,
  };
  const styles = {
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  };
  return (
    <>
      <div className="d-flex flex-row items-center flex-row-start color_main">
        <div onClick={onClick}>
          <div style={color} className="color_block" />
        </div>

        {displayColorPicker[index] ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={closeColorPallet} />
            <SketchPicker color={colorCode} onChange={onChange} />
          </div>
        ) : null}
        <span style={{ marginLeft: "5px" }}>
          {colorCode ? colorCode : "Choose Color"}
        </span>
      </div>
    </>
  );
}

export default ColorPicker;