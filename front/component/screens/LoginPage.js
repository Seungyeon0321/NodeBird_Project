import React, { useEffect } from "react";
import LoginForm from "../LoginForm";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useMessageAPI from "../message/messageAPI";
import { Alert } from "antd";

const Login = () => {
  const router = useRouter();
  const { me, isLoggedIn, logInError } = useSelector((state) => state.user);
  useEffect(() => {
    if (me) {
      router.push("/");
    }
  }, [me]);

  const { contextHolder, error } = useMessageAPI();

  useEffect(() => {
    if (logInError) {
      error("Login failed. Please retry");
      router.push("/");
    }
  }, [logInError]);

  return (
    <>
      {contextHolder}
      {!isLoggedIn && <LoginForm />}
      {logInError && (
        <Alert
          message="Login failed. Please retry"
          type="error"
          showIcon
          style={{ marginTop: 10 }}
        />
      )}
    </>
  );
};

export default Login;
