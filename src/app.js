import React from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { SidePanels, SideHeader, SideFooter } from "./sidebar";
import { SendEmailPopup } from "./SendEmailPopup";

import { MainSection, MainHeader }from "./MainContent";
import "./app.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const previewType = useSelector((state) => state.previewType);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const send_test_email_btn = window[page].send_test_email_btn;

  return (
    <section className="zoremmail-layout zoremmail-layout-has-sider">
      <form
        method="post"
        id="zoremmail_email_options"
        className="zoremmail_email_options"
      >
        <section className="zoremmail-layout zoremmail-layout-has-content zoremmail-layout-sider">
          <SideHeader />
          <SidePanels />
          <SideFooter />
        </section>
        <section className="zoremmail-layout zoremmail-layout-has-content">
          <input
            type="hidden"
            name="preview"
            id="preview"
            value={previewType}
          />
          <MainHeader />
          <MainSection />
        </section>
      </form>
      {send_test_email_btn && <SendEmailPopup />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
}

export default App;
