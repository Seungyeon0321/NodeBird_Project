import React, { useEffect } from "react";
import AppLayout from "../component/layout";
import LoginForm from "../component/LoginForm";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    if (me) {
      router.push("/");
    }
  }, [me]);

  return (
    <AppLayout>
      <LoginForm />
    </AppLayout>
  );
};

export default Login;
