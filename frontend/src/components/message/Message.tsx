import React from "react";
import "./messageStyles.css";
import { useAppDispatch } from "../../store/hooks";
import { clearMessage } from "../../store/slices/messageSlice";

type MessageProps = {
  content: string;
};
const Message = ({ content }: MessageProps) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    const errorMessage = document.getElementById("error-container");
    if (errorMessage) {
      errorMessage.style.height = "0px";
      errorMessage.style.border = "0";
      errorMessage.style.padding = "0";

      setTimeout(() => dispatch(clearMessage()), 500);
    }
  };
  return (
    <div id="error-container">
      <span onClick={handleClose} className="close-btn">
        x
      </span>
      <div className="error">{content && `${content}`}</div>
    </div>
  );
};

export default Message;
