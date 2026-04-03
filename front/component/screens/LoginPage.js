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
    if (!logInError) return;
    const msg =
      typeof logInError?.data === "string"
        ? logInError.data
        : logInError?.message ?? "Login failed. Please retry";
    error(msg);
    // router.push("/") 제거: 리다이렉트 시 화면이 메인으로 바뀌고 next-redux-wrapper/SSR와 맞물려 상태가 꼬일 수 있음
    // error 콜백은 매 렌더마다 바뀔 수 있어 deps에 넣으면 토스트가 반복됨
    // eslint-disable-next-line react-hooks/exhaustive-deps -- logInError 변경 시에만 안내
  }, [logInError]);

  return (
    <PageWrapper style={{ minHeight: "50vh", flex: 1, flexDirection: "column" }}>
      {contextHolder}
      {!isLoggedIn && <LoginForm />}
      {logInError && (
        <Alert
          message={
            typeof logInError?.data === "string"
              ? logInError.data
              : logInError?.message ?? "Login failed. Please retry"
          }
          type="error"
          showIcon
          style={{ marginTop: 12, width: "100%", maxWidth: 420 }}
        />
      )}
    </PageWrapper>
  );
};

export default Login;
