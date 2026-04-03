import React, { useEffect } from "react";
import LoginForm from "../LoginForm";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useMessageAPI from "../message/messageAPI";
import { Alert } from "antd";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px var(--container-padding, 16px);
`;

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
    <PageWrapper style={{ minHeight: "50vh" }}>
      {contextHolder}
      {!isLoggedIn && <LoginForm />}
      {logInError && (
        <Alert
          message="Login failed. Please retry"
          type="error"
          showIcon
          style={{ marginTop: 12, width: "100%", maxWidth: 420 }}
        />
      )}
    </PageWrapper>
  );
};

export default Login;
