import { useSelector } from "react-redux";
import React from "react";
import { useSearchParams } from "react-router-dom";
import "./MainContent.css";

export const MainHeader = () => {
  const headerObjectValue = useSelector((state) => state.headerObjectValue);
  return (
      <section className="zoremmail-layout-content-header">
        {headerObjectValue.length > 0 &&
          headerObjectValue.map((item, index) => {
            return item;
          })}
      </section>
  );
}

export const MainSection = () => {
  const previewType = useSelector((state) => state.previewType);
  const headerObjectValue = useSelector((state) => state.headerObjectValue);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const iframeUrl = window[page].iframeUrl
    ? window[page].iframeUrl[previewType]
    : window.location.origin +
      "/wp-admin/admin-ajax.php?action=" +
      page +
      "_email_preview&preview=" +
      previewType;

  return (
    <div className="zoremmail-layout-content-container">
      <section className="zoremmail-layout-content-preview customize-preview">
        <div id="overlay"></div>
        <iframe
          id="content-preview-iframe"
          src={iframeUrl}
          style={{
            height: headerObjectValue.length > 0 ? '94vh' : '100vh',
            width: "100%",
            margin: "0 auto",
            display: "block"
          }}
        ></iframe>
      </section>
    </div>
  );
}

