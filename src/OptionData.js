import React from "react";
import axios from "axios";
import ColorPicker from "./component/colorPicker";
import { RangeStepInput } from "react-range-step-input";
import { TagsInput } from "react-tag-input-component";
import {
  updatePreviewType,
  updateObjectValue
} from "./redux/actionCreator/objectValue";
import { colorShow, colorHide } from "./redux/actionCreator/colorPicker";
import DateRangePicker from "rsuite/DateRangePicker";
import isAfter from "date-fns/isAfter";
import "rsuite/dist/rsuite.css";

//Panels
export function panelOption(arrPanels, key, optionData, functionData) {
  if (optionData.type == "panel") {
    arrPanels.push(
      <li
        key={key}
        id={key}
        title={optionData.title}
        className={`zoremmail-panel-title`}
        onClick={() =>
          functionData({
            key: key,
            title: optionData.title,
            preview: optionData.preview
          })
        }
      >
        <span>{optionData.title}</span>
        <span className="dashicons dashicons-arrow-right-alt2" />
      </li>
    );
  }

  return arrPanels;
}

//Sub-Panels
export function subPanelOption(arrSubPanels, key, optionData, functionData) {
  arrSubPanels.push(
    <li
      key={key}
      id={key}
      data-type={optionData.parent}
      title={optionData.title}
      className={`zoremmail-sub-panel-title`}
      onClick={() =>
        functionData({
          key: key,
          title: optionData.title,
          preview: optionData.preview
        })
      }
    >
      <span>{optionData.title}</span>
      <span className="dashicons dashicons-arrow-right-alt2" />
    </li>
  );

  return arrSubPanels;
}

//Sub-Panel-options
export function OptionData(
  arrPanelOptions,
  key,
  optionData,
  dispatch,
  objectValue,
  previewType,
  indexNum,
  searchParams,
  setSearchParams
) {
  if (!optionData.show) {
    return arrPanelOptions;
  }

  var classArray =
    optionData?.class != undefined ? optionData?.class.split(" ") : "";
  if (
    optionData?.class != undefined &&
    classArray.includes("all_status_submenu")
  ) {
    if (previewType && !classArray.includes(previewType + "_sub_menu")) {
      var optionStyle = {
        display: "none"
      };
    }
  }

  if (optionData.disabled) {
    var disabledStyle = {
      opacity: "0.7"
    };
  }

  const page = searchParams.get("page");
  const rest_nonce = window[page].rest_nonce;
  const rest_base = window[page].rest_base;
  const proLabel = `<a href=${window[page].pro_link} target="_blank" class="pro">PRO</a>`;

  const onChangeHandler = (key, value, action) => {
    dispatch(
      updateObjectValue({
        ...objectValue,
        [key]: value
      })
    );

    if (action) {
      jQuery(".zoremmail-layout-content-preview").addClass(
        "customizer-unloading"
      );
      const headers = {
        "x-wp-nonce": rest_nonce
      };
      axios
        .post(
          rest_base + page + "/store/update?preview=" + previewType,
          {
            ...objectValue,
            [key]: value
          },
          {
            headers: headers
          }
        )
        .then((res) => {
          dispatch(updatePreviewType(res.data.preview));
          setSearchParams({ page: page, preview: res.data.preview });
          if (res.data.success) {
            jQuery("iframe").attr("src", jQuery("iframe").attr("src"));
            document.querySelector("iframe").addEventListener("load", () => {
              jQuery(".zoremmail-layout-content-preview").removeClass(
                "customizer-unloading"
              );
            });
          }
        });
    } else {
      jQuery(".notice_message").remove();
      jQuery(".efc-save").html("Save").attr("disabled", false);
      jQuery(".send-test-email")
        .attr("disabled", true)
        .before(
          '<span class="notice_message" style="color:#f44336;font-size:12px;display: block;">Please save the changes to send test email.</span>'
        );
      jQuery(".zoremmail-back-wordpress-link").addClass("back_to_notice");
    }
  };

  if (optionData.type == "title") {
    arrPanelOptions.push(
      <h3 key={key} className="options-title-divider">
        {optionData.title}
      </h3>
    );
  } else if (optionData.type == "text") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item" style={disabledStyle}>
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} text`}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <input
                type="text"
                id={key}
                name={key}
                placeholder={
                  optionData.placeholder ? optionData.placeholder : ""
                }
                value={objectValue[key] ? objectValue[key] : ""}
                className={`zoremmail-input text`}
                onChange={(e) => {
                  onChangeHandler(key, e.target.value, optionData.refresh);
                }}
                disabled={optionData.disabled ? 1 : 0}
              />
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "tags-input") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item" style={disabledStyle}>
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} tags-input`}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <TagsInput
                placeHolder={
                  optionData.placeholder ? optionData.placeholder : ""
                }
                value={objectValue[key] ? objectValue[key].split(",") : []}
                onChange={(e) => {
                  if (e.length > 0) {
                    onChangeHandler(key, e.join(","), optionData.refresh);
                  } else {
                    onChangeHandler(key, "", optionData.refresh);
                  }
                }}
                className={`zoremmail-input tags-input`}
                name={key}
              />
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "daterange") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} select`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <DateRangePicker
                showOneCalendar
                disabledDate={(date) => isAfter(date, new Date())}
                placeholder="Select Date Range"
                value={
                  objectValue[key]
                    ? [
                        new Date(objectValue[key][0]),
                        new Date(objectValue[key][1])
                      ]
                    : [new Date(), new Date()]
                }
                onChange={(e) => {
                  var startDate =
                    e[0].getFullYear() +
                    "/" +
                    (e[0].getMonth() + 1) +
                    "/" +
                    e[0].getDate();
                  var endDate =
                    e[1].getFullYear() +
                    "/" +
                    (e[1].getMonth() + 1) +
                    "/" +
                    e[1].getDate();
                  onChangeHandler(
                    key,
                    [startDate, endDate],
                    optionData.refresh
                  );
                }}
                style={{ width: "100%" }}
              />
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "select") {
    const arrselect = [];
    for (const selectkey in optionData.options) {
      arrselect.push(
        <option
          value={selectkey}
          defaultValue={
            optionData.previewType ? previewType : objectValue[key] == selectkey
          }
        >
          {optionData.options[selectkey]}
        </option>
      );
    }

    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} select`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <select
                name={key}
                id={key}
                className={`zoremmail-input select`}
                value={optionData.previewType ? previewType : objectValue[key]}
                onChange={(e) => {
                  if (optionData.previewType) {
                    dispatch(updatePreviewType(e.target.value));
                    jQuery(".all_status_submenu").css("display", "none");
                    jQuery("." + e.target.value + "_sub_menu").css(
                      "display",
                      "block"
                    );
                    setSearchParams({ page: page, preview: e.target.value });
                  } else {
                    onChangeHandler(key, e.target.value, optionData.refresh);
                  }
                }}
                disabled={optionData.disabled ? 1 : 0}
              >
                {arrselect.length > 0 &&
                  arrselect.map((item, index) => {
                    return item;
                  })}
              </select>
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "textarea") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <textarea
                id={key}
                rows="4"
                name={key}
                placeholder={optionData.placeholder}
                className={`zoremmail-input ${optionData.type}`}
                value={objectValue[key]}
                onChange={(e) => {
                  onChangeHandler(key, e.target.value, optionData.refresh);
                }}
                disabled={optionData.disabled ? 1 : 0}
              >
                {objectValue[key]}
              </textarea>
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "checkbox") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">
              <input
                type="checkbox"
                id={key}
                name={key}
                className={`zoremmail-checkbox ${optionData.type}`}
                checked={objectValue[key] == 1 ? 1 : 0}
                value={objectValue[key]}
                onChange={(e) => {
                  onChangeHandler(
                    key,
                    e.target.checked ? 1 : 0,
                    optionData.refresh
                  );
                }}
                disabled={optionData.disabled ? 1 : 0}
              />
              <label for={key}> {optionData.title}</label>
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "todo-list") {
    const arrTodoList = [];
    for (const todoKey in optionData.default) {
      arrTodoList.push(
        <li>
          <input
            key={key}
            type="hidden"
            name="return_reasons[]"
            value={optionData.default[todoKey]}
          />
          <span className="reason_text">{optionData.default[todoKey]}</span>
          <span
            className="dashicons dashicons-trash"
            onClick={(e) => {
              jQuery(e.target).parent().remove();
              var newArray = [];
              jQuery("ul input[type=hidden]").each(function (e) {
                newArray.push(jQuery(this).val());
              });
              onChangeHandler(key, newArray, optionData.refresh);
            }}
          />
        </li>
      );
    }
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <div className="todo_layout">
                <input
                  type="text"
                  id={key}
                  placeholder={optionData.placeholder}
                />
                <span
                  onClick={(e) => {
                    var li = document.createElement("li");
                    var inputValue =
                      document.getElementById("return_reasons").value;

                    if (inputValue === "") {
                      alert("You must write something!");
                    } else {
                      document.getElementById("todo-list").appendChild(li);
                      var INPUT = document.createElement("INPUT");
                      INPUT.type = "hidden";
                      INPUT.setAttribute("type", "hidden");
                      INPUT.setAttribute("name", "return_reasons[]");
                      INPUT.setAttribute("value", inputValue);
                      li.appendChild(INPUT);

                      var span = document.createElement("SPAN");
                      var txt = document.createTextNode(inputValue);
                      span.className = "reason_text";
                      span.appendChild(txt);
                      li.appendChild(span);

                      var Span = document.createElement("SPAN");
                      Span.className = "dashicons dashicons-trash";
                      Span.onclick = function (e) {
                        jQuery(e.target).parent().remove();
                        var newArray = [];
                        jQuery("ul input[type=hidden]").each(function (e) {
                          newArray.push(jQuery(this).val());
                        });
                        onChangeHandler(key, newArray, optionData.refresh);
                      };
                      li.appendChild(Span);
                    }
                    document.getElementById("return_reasons").value = "";
                    var newArray = [];
                    jQuery("ul input[type=hidden]").each(function (e) {
                      newArray.push(jQuery(this).val());
                    });
                    onChangeHandler(key, newArray, optionData.refresh);
                  }}
                  className="addBtn"
                >
                  Add
                </span>
              </div>
              <ul id="todo-list">
                {arrTodoList.length > 0 &&
                  arrTodoList.map((item, index) => {
                    return item;
                  })}
              </ul>
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "tgl-btn") {
    const arrselect = [];
    if (optionData.breakdown) {
      var options = optionData.breakdown.option;
      for (const selectkey in options) {
        arrselect.push(
          <option value={selectkey} defaultValue={objectValue[key + "_row"]}>
            {optionData.breakdown.option[selectkey]}
          </option>
        );
      }
    }

    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">
              <span className="tgl-btn-parent">
                <input
                  type="checkbox"
                  id={key}
                  name={key}
                  className="tgl tgl-flat"
                  checked={objectValue[key] == 1 ? 1 : 0}
                  value={objectValue[key]}
                  onChange={(e) => {
                    onChangeHandler(
                      key,
                      e.target.checked ? 1 : 0,
                      optionData.refresh
                    );
                  }}
                  disabled={optionData.disabled ? 1 : 0}
                />
                <label className="tgl-btn" for={key} />
              </span>
              <label for={key}> {optionData.title}</label>
              {optionData.sorting && (
                <span
                  className="row-sort"
                  style={{ float: "right", margin: "0 5px" }}
                >
                  <input
                    type="hidden"
                    name={optionData.database_column}
                    value={key}
                    className="sortable"
                  />
                  <span className="dashicons dashicons-menu options-sort" />
                </span>
              )}
              {optionData.breakdown && (
                <span
                  className="row-sort"
                  style={{ float: "right", margin: "0 5px" }}
                >
                  {optionData.breakdown && (
                    <select
                      name={key + "_row"}
                      id={key + "_row"}
                      className={`zoremmail-input select`}
                      value={objectValue[key + "_row"]}
                      onChange={(e) => {
                        onChangeHandler(
                          key + "_row",
                          e.target.value,
                          optionData.refresh
                        );
                      }}
                    >
                      {arrselect.length > 0 &&
                        arrselect.map((item, index) => {
                          return item;
                        })}
                    </select>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "color") {
    const openColorPellet = (index) => {
      dispatch(colorShow(index));
    };
    const closeColorPallet = (index) => {
      dispatch(colorHide(index));
    };

    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <ColorPicker
                label={optionData.title}
                onChange={(e) => {
                  onChangeHandler(key, e.hex, optionData.refresh);
                }}
                value={objectValue[key]}
                name={key}
                colorCode={objectValue[key]}
                onClick={() => openColorPellet(indexNum)}
                closeColorPallet={() => closeColorPallet(indexNum)}
                index={indexNum}
                disabled={optionData.disabled ? 1 : 0}
              />
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "radio") {
    const arrRadio = [];
    const count = 100 / Object.keys(optionData.choices).length;
    for (const radiokey in optionData.choices) {
      arrRadio.push(
        <label className="radio-button-label" style={{ width: count + "%" }}>
          <input
            type="radio"
            name={key}
            id={radiokey}
            value={radiokey}
            checked={objectValue[key] == radiokey ? 1 : 0}
            onChange={(e) => {
              jQuery(e.target.id).attr("checked", true);
              onChangeHandler(key, e.target.value, optionData.refresh);
            }}
            disabled={optionData.disabled ? 1 : 0}
          />
          <span>{optionData.choices[radiokey]}</span>
        </label>
      );
    }

    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              {arrRadio.length > 0 &&
                arrRadio.map((item, index) => {
                  return item;
                })}
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "range") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <RangeStepInput
                onChange={(e) => {
                  onChangeHandler(key, e.target.value, optionData.refresh);
                }}
                min={optionData.min}
                max={optionData.max}
                value={objectValue[key]}
                style={{ width: "calc(100% - 60px)" }}
                disabled={optionData.disabled ? 1 : 0}
              />
              <input
                style={{ width: "55px" }}
                className="slider__value"
                type="number"
                min={optionData.min}
                max={optionData.max}
                value={objectValue[key]}
                onChange={(e) => {
                  onChangeHandler(key, e.target.value, optionData.refresh);
                }}
                disabled={optionData.disabled ? 1 : 0}
              />
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "media") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              {!optionData.disabled && !objectValue[key] && (
                <div
                  class="placeholder"
                  onClick={(e) => {
                    // Create the media frame.
                    var file_frame = (wp.media.frames.file_frame = wp.media({
                      title: "Upload Media",
                      button: {
                        text: "Add"
                      },
                      multiple: false // Set to true to allow multiple files to be selected
                    }));

                    if (file_frame) {
                      file_frame.open();
                      file_frame.on("select", function () {
                        var attachment = file_frame
                          .state()
                          .get("selection")
                          .first()
                          .toJSON();
                        onChangeHandler(
                          key,
                          attachment.url,
                          optionData.refresh
                        );
                      });
                      return;
                    }
                  }}
                >
                Click to upload
                </div>
              )}
              {!optionData.disabled && objectValue[key] && (
                <img className="selected-media" src={objectValue[key]} />
              )}
              {!optionData.disabled && objectValue[key] && (
                <button
                  type="button"
                  className="remove-media button"
                  onClick={() => {
                    onChangeHandler(key, "", optionData.refresh);
                  }}
                >
                  Remove
                </button>
              )}
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "codeinfo") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            <div className="menu-sub-field">
              <span
                className={`menu-sub-codeinfo ${optionData.type}`}
                dangerouslySetInnerHTML={{ __html: optionData.default }}
              />
              {optionData.desc && (
                <span className="menu-sub-tooltip">{optionData.desc}</span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "import") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            {optionData.desc && (
              <span className="menu-sub-tooltip">{optionData.desc}</span>
            )}
            <div className="menu-sub-field">
              <input type="file" />
              <button
                type="button"
                className="import-options button"
                onClick={() => {
                  //onChangeHandler(key, "", optionData.refresh);
                }}
              >
                {optionData.title}
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  } else if (optionData.type == "export") {
    arrPanelOptions.push(
      <li
        key={key}
        className={`zoremmail-menu zoremmail-menu-inline zoremmail-menu-sub ${
          optionData.class ? optionData.class : ""
        }`}
        style={optionStyle}
      >
        <div className="zoremmail-menu-item">
          <div
            className="proLabel"
            dangerouslySetInnerHTML={{ __html: optionData.pro ? proLabel : "" }}
          />
          <div className={`${key} ${optionData.type}`} style={disabledStyle}>
            <div className="menu-sub-title">{optionData.title}</div>
            {optionData.desc && (
              <span className="menu-sub-tooltip">{optionData.desc}</span>
            )}
            <div className="menu-sub-field">
              <button
                type="button"
                className="export-options button"
                onClick={() => {
                  //onChangeHandler(key, "", optionData.refresh);
                }}
              >
                {optionData.title}
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return arrPanelOptions;
}
