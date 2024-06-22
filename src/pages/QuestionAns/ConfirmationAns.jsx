import React from "react";
import classes from './Confirmation.module.css' // Make sure to create and style this CSS file

const ConfirmationAns = ({ message,onConfirm1, onCancel1 }) => {
  return (
    <div className={classes.modal_overlay}>
      <div className={classes.modal_content}>
        <p>{message}</p>
        <div className={classes.modal_actions}>
          <button onClick={onConfirm1}>Yes</button>
          <button onClick={onCancel1}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAns;