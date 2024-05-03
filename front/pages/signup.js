import React, { useCallback, useState, useEffect } from "react";
import AppLayout from "../component/layout";
import Router from "next/router";
import Head from "next/head";
import { Button, Checkbox, Form, Input, message } from "antd";
import CommonUserForm from "../hooks/useInput";
import styled from "styled-components";
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../store/configureStore";

const ErrorMessage = styled.div`
  color: "blue";
`;

const SingUp = () => {
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
    if (me && me.id) {
      Router.replace("./");
    }
  }, [me && me.id]);

  useEffect(() => {
    if (isSignedUp) {
      Router.replace("/");
    }
  }, [isSignedUp]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
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

  const onChangeTerm = useCallback(
    (e) => {
      setTerm(e.target.checked);
      setTermError(false);
    },
    [term]
  );

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

    console.log(signUpError);
    if (!signUpError) {
      success();
    } else {
      error();
    }
  }, [email, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>SignUp | Node Bird</title>
      </Head>
      {contextHolder}
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
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>
            Sing Up
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
      type: LOAD_POST_REQUEST,
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default SingUp;
