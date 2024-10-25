import React, { useEffect } from "react";
import AppLayout from "../component/layout";
import LoginForm from "../component/LoginForm";
import LoadingSpin from "../component/LoadingSpin";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const { me, isLoggedIn } = useSelector((state) => state.user);
  useEffect(() => {
    if (me) {
      router.push("/");
    }
  }, [me]);

  return (
    <AppLayout>
      {!isLoggedIn && !me ? <LoginForm /> : <LoadingSpin />}
    </AppLayout>
  );
};

export default Login;
