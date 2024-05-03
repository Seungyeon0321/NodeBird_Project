import React from "react";
import { message } from "antd";

// user click sign up button
// dispatch the information written by the user
// can return 3 states
// Success, Fail, Loading
// based on these 3 states, we need to show different effects for user experience

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
