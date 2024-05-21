import React, { useEffect } from "react";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

const Alertmsg = (props) => {
  const { isError, isAlertOpen, message, autoDismiss = true } = props;

  useEffect(() => {
    if (isAlertOpen && autoDismiss) {
      window.setTimeout(() => {
        props.closeAlert();
      }, 3000);
    }
  }, [isAlertOpen]);

  return (
    <React.Fragment>
      {isAlertOpen && message && (
        <div id="overlay" role="alert">
          <Toast className={`bg-${isError ? "danger" : "success"} my-2 rounded alert_popup fw-bold`} isOpen={isAlertOpen}>
            <ToastHeader toggle={props.closeAlert} icon={isError ? "danger" : "success"}>
              {isError ? "Error" : "Success"}
            </ToastHeader>
            <ToastBody className="fw-bold">{message}</ToastBody>
          </Toast>
        </div>
      )}
    </React.Fragment>
  );
};

export default Alertmsg;
