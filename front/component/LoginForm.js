import React, { useCallback } from "react";
import { Card, Form, Input, Typography } from "antd";

import styled from "styled-components";
import CommonUserForm from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { logInRequestAction, CLEAR_LOG_IN_ERROR } from "../reducers/user";
import { CustomButton, CustomButton2 } from "../styles/GlobalStyleComponent";
import { SET_CURRENT_VIEW } from "../reducers/ui";

const ButtonWrapper = styled.div`
  margin-top: 15px;
`;

const FormWrapper = styled(Form)`
  padding: 0;
  margin-bottom: 0;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoggingIn, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = CommonUserForm("");
  const [userPassword, onChangePassword] = CommonUserForm("");

  console.log(logInError, 'logInError');

  const onChangeEmailField = useCallback(
    (e) => {
      onChangeEmail(e);
      if (logInError) dispatch({ type: CLEAR_LOG_IN_ERROR });
    },
    [onChangeEmail, dispatch, logInError]
  );

  const onChangePasswordField = useCallback(
    (e) => {
      onChangePassword(e);
      if (logInError) dispatch({ type: CLEAR_LOG_IN_ERROR });
    },
    [onChangePassword, dispatch, logInError]
  );

  const onSubmitFrom = useCallback(() => {
    dispatch(logInRequestAction({ email, userPassword }));
  }, [dispatch, email, userPassword]);

  const goToSignup = useCallback(() => {
    dispatch({ type: SET_CURRENT_VIEW, data: "signup" });
  }, [dispatch]);

  return (
    <Card
      bordered={false}
      style={{
        width: "100%",
        maxWidth: 420,
        borderRadius: "var(--radius-md, 16px)",
        boxShadow: "var(--shadow-sm, 0 1px 2px rgba(16, 24, 40, 0.06))",
      }}
    >
      <Typography.Title level={3} style={{ margin: 0, marginBottom: 16 }}>
        Login
      </Typography.Title>

      <FormWrapper onFinish={onSubmitFrom} layout="vertical">
        <Form.Item label="Email" required style={{ marginBottom: 12 }}>
          <Input
            name="user-id"
            value={email}
            type="email"
            onChange={onChangeEmail}
            required
          />
        </Form.Item>

        <Form.Item label="Password" required style={{ marginBottom: 12 }}>
          <Input
            name="user-password"
            type="password"
            value={userPassword}
            onChange={onChangePasswordField}
            required
          />
        </Form.Item>

        <ButtonWrapper>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <CustomButton
              htmlType="submit"
              loading={isLoggingIn}
              style={{ flex: "1 1 160px", marginRight: 0 }}
            >
              Login
            </CustomButton>
            <CustomButton2
              onClick={goToSignup}
              style={{ flex: "1 1 160px" }}
            >
              Sign Up
            </CustomButton2>
          </div>
        </ButtonWrapper>
      </FormWrapper>
    </Card>
  );
};

export default LoginForm;
