import React from "react";
import { message } from "antd";

const PopupMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Signup has been succeed!",
      className: "custom=class",
      style: {
        marginTop: "2vh",
      },
    });
  };

  return (
    <>
      {contextHolder}
      <div>SignUp has been succeed!</div>
    </>
  );
};

export default PopupMessage;
