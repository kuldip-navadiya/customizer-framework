import axios from "axios";
import { useSearchParams } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./SendEmailPopup.css";
import { __ } from '@wordpress/i18n';

export const SendEmailPopup = () => {
  const previewType = useSelector((state) => state.previewType);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const action = `send_${page}_test_email`;
  const [recipients, setrecipients] = useState(window[page].admin_email);
  const rest_nonce = window[page].rest_nonce;
  const rest_base = window[page].rest_base;
  const translations = window[page].translations;
  
  function sendTestEmailData() {
    const headers = {
      "x-wp-nonce": rest_nonce
    };
    const data = axios
      .post(
        rest_base + page + "/send-test-email",
        {
          preview: previewType,
          recipients: recipients,
          rest_nonce: rest_nonce
        },
        { headers: headers }
      )
      .then((res) => {
        return res.data.success;
      });

    return data;
  }

  return (
    <div
      id="send_to_email_option_html"
      className="popupwrapper"
      style={{ display: "none" }}
    >
      <div className="popuprow">
        <h3>
          {translations['4'] ? translations['4'] : 'Send a test email'}
          <span
            className="sre-popup dashicons dashicons-no-alt popup_close_icon"
            onClick={() => {
              document.getElementById(
                "send_to_email_option_html"
              ).style.display = "none";
              jQuery("#send_to_email_options").show();
              jQuery(".popuprow p").remove();
            }}
          ></span>
        </h3>
        <form method="post" id="send_to_email_options">
          <input type="hidden" name="preview" value="new_order" />
          <label>{translations['5'] ? translations['5'] : 'Enter Email addresses (comma separated)'}</label>
          <input
            type="text"
            id="send_to_email"
            name="send_to_email"
            value={recipients}
            placeholder="admin@example.com"
            onChange={(e) => {
              setrecipients(e.target.value);
            }}
          />
          <button
            name="save"
            type="button"
            className="button-primary send-test-email"
            onClick={(e) => {
              jQuery("#send_to_email").css("border-color", "");
              if (recipients == "") {
                jQuery("#send_to_email").css("border-color", "red");
                return;
              }

              jQuery(".notice_message").remove();
              var emails = recipients.split(",");
              var valid = true;
              var regex =
                /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              for (var i = 0; i < emails.length; i++) {
                if (emails[i] === "" || !regex.test(emails[i])) {
                  valid = false;
                }
              }
              if (valid === false) {
                jQuery("#send_to_email").after(
                  '<span class="notice_message">Please enter valid Email address.</span>'
                );
                return;
              }

              jQuery(".send-test-email").html(
                '<div class="dot-carousel"></div>'
              );
              const data = sendTestEmailData();
              data.then((success) => {
                if (success) {
                  jQuery(".send-test-email").html("Send");
                  jQuery("#send_to_email_options").hide();
                  jQuery(".popuprow h3").after(
                    '<p><span class="dashicons dashicons-yes-alt"></span></p><p class="confirm_message sucess">Test email was sent successfully</p>'
                  );
                } else {
                  jQuery(".send-test-email").html("Send");
                  jQuery("#send_to_email_options").hide();
                  jQuery(".popuprow h3").after(
                    '<p><span class="dashicons dashicons-dismiss"></span></p><p class="confirm_message failed">Email sent has Failed!</p>'
                  );
                }
              });
            }}
          >
            {translations['6'] ? translations['6'] : 'Send'}
          </button>
          <input type="hidden" name="action" value={action} />
        </form>
      </div>
      <div
        className="popupclose"
        onClick={() => {
          document.getElementById("send_to_email_option_html").style.display =
            "none";
          jQuery("#send_to_email_options").show();
          jQuery(".popuprow p").remove();
        }}
      ></div>
    </div>
  );
};
