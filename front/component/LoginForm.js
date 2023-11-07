import React, { useState, useCallback, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import CommonUserForm from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";

import { logInRequestAction } from "../reducers/user";

//style을 객체로 하게 되면 rendering 할 때 마다 그 부분도 초기화가
//되버리기 때문에 최적화 측면에서 좋지 않다, 그렇기 때문에 이렇게
//styled로 따로 만들어서 관리해주는 것이 좋다
const ButtonWrapper = styled.div`
  margin-top: 15px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoggingIn, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = CommonUserForm(""); //포인트는 이 부분이 공백으로 들어간다는것
  const [userPassword, onChangePassword] = CommonUserForm("");

  useEffect(() => {
    if (logInError) {
      alert(logInError.data);
    }
  }, [logInError]);

  //component에서 props로 넘겨주는 녀석은 useCallback을 사용해라, 그래야 최적화가 되기 때문에

  const onSubmitFrom = useCallback(() => {
    dispatch(logInRequestAction({ email, userPassword }));
  }, [email, userPassword]);

  return (
    <FormWrapper onFinish={onSubmitFrom}>
      <div>
        <label htmlFor="user-id">Email</label>
        <br />
        <Input
          name="user-id"
          value={email}
          type="email"
          onChange={onChangeEmail}
          required
        ></Input>
      </div>
      <div>
        <label htmlFor="user-password">Password</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={userPassword}
          onChange={onChangePassword}
          required
        ></Input>
      </div>
      <ButtonWrapper>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoggingIn}
          style={{ marginRight: 10 }}
        >
          Login
        </Button>
        <Link href="/signup">
          <Button>Sing Up</Button>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
