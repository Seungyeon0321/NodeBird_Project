import React, { useCallback, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import CommonUserForm from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";

import { logInRequestAction } from "../reducers/user";
import CustomButton from "../styles/CustomButton";
const ButtonWrapper = styled.div`
  margin-top: 15px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
  margin-bottom: 20px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoggingIn, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = CommonUserForm("");
  const [userPassword, onChangePassword] = CommonUserForm("");

  useEffect(() => {
    if (logInError) {
      alert(logInError.data);
    }
  }, [logInError]);

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
        <CustomButton
          htmlType="submit"
          loading={isLoggingIn}
          style={{ marginRight: 10 }}
        >
          Login
        </CustomButton>
        <Link href="/signup">
          <Button>Sing Up</Button>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
