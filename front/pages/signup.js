import React, { useCallback, useState, useEffect } from "react";
import AppLayout from "../component/layout";
import LoadingSpin from "../component/LoadingSpin";
import Router from "next/router";
import Head from "next/head";
import { Checkbox, Form, Input, message } from "antd";
import CommonUserForm from "../hooks/useInput";
import styled from "styled-components";
import { SIGN_UP_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../styles/CustomButton";
const ErrorMessage = styled.div`
  color: "red";
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const { isSigningUp, isSignedUp, signUpError, me } = useSelector(
    (state) => state.user
  );
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "You are all set!",
      duration: 10,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Signup failed. Please retry or contact support",
      duration: 10,
    });
  };

  //If I set this one, It redirect me to the main page whenever I update the state
  useEffect(() => {
    if ((me && me.id) || isSignedUp) {
      success();
      Router.replace("./");
    }
  }, [me && me.id, isSignedUp]);

  useEffect(() => {
    if (signUpError) {
      error();
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
    <AppLayout>
      <Head>
        <title>SignUp | Node Bird</title>
      </Head>
      {contextHolder}
      {!isSignedUp ? (
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">User Email</label>
            <br />
            <Input
              name="user-email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              required
            />
          </div>
          <div>
            <label htmlFor="user-nick">Nick Name</label>
            <br />
            <Input
              name="user-nick"
              value={nickname}
              onChange={onChangeNickName}
              required
            />
          </div>
          <div>
            <label htmlFor="user-password">Password</label>
            <br />
            <Input
              name="user-password"
              value={password}
              onChange={onChangePassword}
              required
            ></Input>
          </div>
          <div>
            <label htmlFor="user-id">Confirm Password</label>
            <br />
            <Input
              name="user-id"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
              required
            ></Input>
            {passwordError && (
              <ErrorMessage>The password is not valid</ErrorMessage>
            )}
          </div>
          <div>
            {termError && (
              <div style={{ color: "red" }}>
                You must agree with the time of terms
              </div>
            )}
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
              I agree with the terms
            </Checkbox>
          </div>
          <div style={{ marginTop: 10, marginBottom: 20 }}>
            <CustomButton htmlType="submit" loading={isSigningUp}>
              Sing Up
            </CustomButton>
          </div>
        </Form>
      ) : (
        <LoadingSpin />
      )}
    </AppLayout>
  );
};

export default SignUp;
