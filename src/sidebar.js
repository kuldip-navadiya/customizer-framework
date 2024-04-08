import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { panelOption, subPanelOption, OptionData } from "./OptionData";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePreviewType,
  updateObjectValue,
} from "./redux/actionCreator/objectValue";
import {
  updateHeaderOptionsData
} from "./redux/actionCreator/headerObjectValue";
export const SideHeader = () => {
  const dispatch = useDispatch();
  const objectValue = useSelector((state) => state.objectValue);
  const previewType = useSelector((state) => state.previewType);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const action = `save_${page}_settings`;
  const backLink = window[page].back_to_wordpress_link;
  const translations = window[page].translations;

  function sendStoreData() {
    const rest_nonce = window[page].rest_nonce;
    const rest_base = window[page].rest_base;
    const headers = {
      "x-wp-nonce": rest_nonce
    };
    const data = axios
      .post(
        rest_base + page + "/store/update?preview=" + previewType,
        objectValue,
        { headers: headers }
      )
      .then((res) => {
        return res.data;
      });
    return data;
  }

  return (
    <aside className="zoremmail-layout-slider-header">
      <button type="button" className="wordpress-to-back">
        <a
          className="zoremmail-back-wordpress-link"
          href={backLink}
          onClick={() => {
            if (
              jQuery(".zoremmail-back-wordpress-link").hasClass(
                "back_to_notice"
              )
            ) {
              var r = confirm(
                "The changes you made will be lost if you navigate away from this page."
              );
              if (r === true) {
              } else {
                return false;
              }
            }
          }}
        >
          <span className="zoremmail-back-wordpress-title dashicons dashicons-no-alt"></span>
        </a>
      </button>
      <span className="efc-save-content">
        <button
          name="save"
          className="efc-btn efc-save button-primary"
          type="button"
          value="Save changes"
          onClick={() => {
            jQuery(".efc-save").html('<div class="dot-carousel"></div>');
            const data = sendStoreData();
            data.then((res) => {
              if (res.success) {
                dispatch(updatePreviewType(res.preview));
                jQuery(".efc-save").html("Saved");
                setSearchParams({ page: page, preview: res.preview });
                toast.success(translations['8'] ? translations['8'] : 'Settings Successfully Saved.', {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                });
                jQuery(".notice_message").remove();
                jQuery(".efc-save").attr("disabled", true);
                jQuery(".send-test-email").attr("disabled", false);
                jQuery(".zoremmail-back-wordpress-link").removeClass(
                  "back_to_notice"
                );
              } else {
                jQuery(".efc-save").html("Save");
                jQuery(".send-test-email")
                  .attr("disabled", true)
                  .before(
                    '<span class="notice_message" style="color:#f44336;font-size:12px;display: block;">Please save the changes to send test email.</span>'
                  );
                jQuery(".zoremmail-back-wordpress-link").addClass(
                  "back_to_notice"
                );
              }
            });
          }}
        >
          {translations['0'] ? translations['0'] : 'Save'}
        </button>
        <input type="hidden" name="action" value={action} />
      </span>
    </aside>
  );
};

export const SideFooter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const send_test_email_btn = window[page].send_test_email_btn;
  const translations = window[page].translations;

  function setPreviewWidth(className, value) {
    jQuery(".zoremmail-layout-content-media .dashicons").removeAttr("style");
    jQuery(className).css({
      color: "#1d2327",
      "border-bottom-color": "#1d2327"
    });

    var iframe = document.getElementById("content-preview-iframe");
    iframe.style.width = value;

    var elmnt = iframe.contentWindow.document.getElementById(
      "template_header_image"
    );
    elmnt.style.width = value;

    var elmnt =
      iframe.contentWindow.document.getElementById("template_container");
    elmnt.style.width = value == "100%" ? "600px" : value;

    var elmnt = iframe.contentWindow.document.getElementById("template_body");
    elmnt.style.width = value;

    var elmnt = iframe.contentWindow.document.getElementById("template_footer");
    elmnt.style.width = value;
  }

  return (
    <aside className="zoremmail-layout-content-collapse">
      {send_test_email_btn && (
        <button
          type="button"
          className="send-to-email"
          onClick={() => {
            document.getElementById("send_to_email_option_html").style.display =
              "block";
          }}
        >
          {translations['3'] ? translations['3'] : 'Send Test Email'}
        </button>
      )}
      <div
        className="zoremmail-layout-content-media"
        style={{ float: "right" }}
      >
        <span
          className="dashicons dashicons-desktop"
          onClick={() => setPreviewWidth(".dashicons-desktop", "100%")}
          style={{ color: "#1d2327", borderBottomColor: "#1d2327" }}
        ></span>
        <span
          className="dashicons dashicons-tablet"
          onClick={() => setPreviewWidth(".dashicons-tablet", "600px")}
        ></span>
        <span
          className="dashicons dashicons-smartphone"
          onClick={() => setPreviewWidth(".dashicons-smartphone", "400px")}
        ></span>
      </div>
    </aside>
  );
};

export const SidePanels = () => {
  const [optionData, setoptionData] = useState({});
  const [panels, setPanelsData] = useState([]);
  const [subPanels, setSubPanelsData] = useState([]);
  const [panelOptions, setPanelOptionsData] = useState([]);
  const [selectedId, setselectedId] = useState("");
  const [selectedTitle, setselectedTitle] = useState("");
  const [selectedBackId, setselectedBackId] = useState("");
  const [selectedBackTitle, setselectedBackTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [backButton, setBackButton] = useState(true);

  const [screenTitle, setscreenTitle] = useState(
    window[searchParams.get("page")].main_title
  );

  const dispatch = useDispatch();
  const objectValue = useSelector((state) => state.objectValue);
  const previewType = useSelector((state) => state.previewType);
  const page = searchParams.get("page");
  const translations = window[page].translations;

  useEffect(() => {
    sidebarApicall();
  }, [previewType]);

  useEffect(() => {
    if (Object.keys(optionData).length !== 0) {
      sidebarOptionDatacall(optionData);
    }
  }, [
    selectedId,
    selectedTitle,
    selectedBackId,
    selectedBackTitle,
    previewType,
    objectValue
  ]);

  const setPreviewType = (preview) => {
    dispatch(updatePreviewType(preview));
    setSearchParams({ page: searchParams.get("page"), preview: preview });
  };

  useEffect(() => {
    if (panels.length === 1 ) {
      setselectedId(panels[0].key);
      setselectedTitle(panels[0].props.title);
      setBackButton(false);
    }
  }, [panels]);

  const onClickPanelOptionHandleEvent = (data) => {
    setselectedId(data.key);
    setselectedTitle(data.title);
    setselectedBackId("");
    setselectedBackTitle("");
    if (data.preview) {
      setPreviewType(data.preview);
    }
  };

  const onClickSubPanelOptionHandleEvent = (data) => {
    setselectedId(data.key);
    setselectedTitle(data.title);
    setselectedBackId(selectedId);
    setselectedBackTitle(selectedTitle);
    if (data.preview) {
      setPreviewType(data.preview);
    }
  };

  function sidebarApicall() {
    const page = searchParams.get("page");
    const rest_nonce = window[page].rest_nonce;
    const rest_base = window[page].rest_base;
    const headers = {
      "x-wp-nonce": rest_nonce
    };
    axios
      .get(rest_base + page + "/settings?preview=" + previewType, {
        headers: headers
      })
      .then((response) => {
        setoptionData(response.data.data);
        for (const Key in response.data.data) {
          if (
            response.data.data[Key].show &&
            response.data.data[Key].default != ""
          ) {
            objectValue[Key] = response.data.data[Key].default;
          }
          if (response.data.data[Key].breakdown) {
            objectValue[Key + "_row"] =
              response.data.data[Key].breakdown.default;
          }
        }
        dispatch(updateObjectValue(objectValue));

        sidebarOptionDatacall(response.data.data);
      });
  }

  const sidebarOptionDatacall = (optionData) => {
    var arrPanels = [];
    var arrSubPanels = [];
    var arrPanelOptions = [];
    var arrHeaderOptions = [];

    var panelHtml = [];
    var subPanelHtml = [];
    var optionHtml = [];
    var headerHtml = [];

    for (const key in optionData) {
      if (optionData[key].previewType && !previewType) {
        dispatch(updatePreviewType(optionData[key].default));
      }
      //Panels
      if (!selectedId && !selectedTitle && optionData[key].type == "panel") {
        const panelHtmlArray = panelOption(
          arrPanels,
          key,
          optionData[key],
          onClickPanelOptionHandleEvent
        );
        panelHtml = panelHtmlArray;
      }

      //Sub-Panels
      if (
        optionData[key].parent == selectedId &&
        optionData[key].type == "sub-panel"
      ) {
        if (arrSubPanels.length == 0) {
          arrSubPanels.push(
            <div key={selectedId} className="customize-section-title">
              {backButton ? <button
                type="button"
                className="customize-section-back panels"
                onClick={() => {
                  setselectedId("");
                  setselectedTitle("");
                }}
              >
                <span className="screen-reader-text">Back</span>
              </button> : ''}
              <h3>
                <span className="customize-action">{translations['1'] ? translations['1'] : 'You are customizing'}</span>
                {selectedTitle}
              </h3>
            </div>
          );
        }

        const subPanelHtmlArray = subPanelOption(
          arrSubPanels,
          key,
          optionData[key],
          onClickSubPanelOptionHandleEvent
        );
        subPanelHtml = subPanelHtmlArray;
      }

      //Sub-Panel-options
      if (
        optionData[key].parent == selectedId &&
        optionData[key].type != "panel" &&
        optionData[key].type != "sub-panel"
      ) {
        if (arrPanelOptions.length == 0) {
          arrPanelOptions.push(
            <li
              key={selectedId}
              data-id={selectedId}
              className="zoremmail-menu-submenu-title"
            >
              <div className="customize-section-title">
                {backButton ? <button
                  type="button"
                  onClick={() => {
                    setselectedId(selectedBackId);
                    setselectedTitle(selectedBackTitle);
                  }}
                  className="customize-section-back sub-panels"
                >
                  <span className="screen-reader-text">Back</span>
                </button> : ''}
                <h3>
                  <span className="customize-action">{translations['2'] ? translations['2'] : 'Customizing'}</span>
                  {selectedTitle}
                </h3>
              </div>
            </li>
          );
        }

        const optionHtmlaArray = OptionData(
          arrPanelOptions,
          key,
          optionData[key],
          dispatch,
          objectValue,
          previewType,
          Object.keys(optionData).indexOf(key),
          searchParams,
          setSearchParams
        );
        optionHtml = optionHtmlaArray;
      }

      //Header-options
      if ( optionData[key].nav == 'header' ) {
        const headerHtmlaArray = OptionData(
          arrHeaderOptions,
          key,
          optionData[key],
          dispatch,
          objectValue,
          previewType,
          Object.keys(optionData).indexOf(key),
          searchParams,
          setSearchParams
        );
        headerHtml = headerHtmlaArray;
      }
    }

    setPanelsData(panelHtml);
    setSubPanelsData(subPanelHtml);
    setPanelOptionsData(optionHtml);
    dispatch(updateHeaderOptionsData(headerHtml));

  };

  return (
    <aside className="zoremmail-layout-slider-content">
      <ul className="zoremmail-panels">
        {panels.length > 0 && (
          <div className="customize-section-title">
            <h3>
              <span className="customize-action">You are customizing</span>
              {screenTitle ? screenTitle : "Customizer"}
            </h3>
          </div>
        )}
        {panels.length > 0 &&
          panels.map((item, index) => {
            return item;
          })}
      </ul>
      <ul className="zoremmail-sub-panels">
        {subPanels.length > 0 &&
          subPanels.map((item, index) => {
            return item;
          })}
      </ul>
      <ul className="zoremmail-menu-contain">
        {panelOptions.length > 0 &&
          panelOptions.map((item, index) => {
            return item;
          })}
      </ul>
    </aside>
  );
};
