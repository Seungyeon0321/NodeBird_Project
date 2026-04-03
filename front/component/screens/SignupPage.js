import React, { useCallback, useState, useEffect } from "react";
import LoadingSpin from "../LoadingSpin";
import Router from "next/router";
import { Card, Checkbox, Form, Input, Typography } from "antd";
import CommonUserForm from "../../hooks/useInput";
import styled from "styled-components";
import { SIGN_UP_REQUEST } from "../../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton } from "../../styles/GlobalStyleComponent";
import useMessageAPI from "../message/messageAPI";
const ErrorMessage = styled.div`
  color: red;
  font-size: 13px;
  margin-top: 6px;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px var(--container-padding, 16px);
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const { isSigningUp, isSignedUp, signUpError, me } = useSelector(
    (state) => state.user
  );
  const { contextHolder, error } = useMessageAPI();

  //If I set this one, It redirect me to the main page whenever I update the state
  useEffect(() => {
    if ((me && me.id) || isSignedUp) {
      Router.replace("./");
    }
  }, [me && me.id, isSignedUp]);

  useEffect(() => {
    if (signUpError) {
      error();
      Router.replace("./");
    }
  }, [signUpError]);

  const [email, onChangeEmail] = CommonUserForm("");
  const [password, onChangePassword] = CommonUserForm("");
  const [nickname, onChangeNickName] = CommonUserForm("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, passwordCheck, term]);

  return (
    <PageWrapper style={{ minHeight: "50vh"}}>
      {contextHolder}
      {!isSignedUp ? (
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
            Sign Up
          </Typography.Title>

          <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item label="User Email" required style={{ marginBottom: 12 }}>
              <Input
                name="user-email"
                type="email"
                value={email}
                onChange={onChangeEmail}
                required
              />
            </Form.Item>

            <Form.Item label="Nick Name" required style={{ marginBottom: 12 }}>
              <Input
                name="user-nick"
                value={nickname}
                onChange={onChangeNickName}
                required
              />
            </Form.Item>

            <Form.Item label="Password" required style={{ marginBottom: 12 }}>
              <Input
                name="user-password"
                value={password}
                onChange={onChangePassword}
                required
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              required
              validateStatus={passwordError ? "error" : "success"}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="user-id"
                value={passwordCheck}
                onChange={onChangePasswordCheck}
                required
              />
              {passwordError && (
                <ErrorMessage>The password is not valid</ErrorMessage>
              )}
            </Form.Item>

            <Form.Item style={{ marginBottom: 6 }}>
              {termError && (
                <Typography.Text type="danger" style={{ display: "block", marginBottom: 6 }}>
                  You must agree with the terms
                </Typography.Text>
              )}
              <Checkbox
                name="user-term"
                checked={term}
                onChange={onChangeTerm}
              >
                I agree with the terms
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
              <CustomButton
                htmlType="submit"
                loading={isSigningUp}
                style={{ width: "100%" }}
              >
                Sign Up
              </CustomButton>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <LoadingSpin />
      )}
    </PageWrapper>
  );
};

export default SignUp;
