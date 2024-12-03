import React, { useCallback } from "react";
import Router from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_VIEW } from "../reducers/ui";

import { logOutRequestAction } from "../reducers/user";

import { Row, Col } from "antd";
import NavCustomButton from "./NavCustomButton";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
import CommonUserForm from "../hooks/useInput";
import { useRouter } from "next/router";
import Image from "next/image";

function Nav() {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state) => state.user);

  // login in
  const clickHandler = useCallback(
    (action) => {
      dispatch({ type: SET_CURRENT_VIEW, data: action });
    },
    [dispatch, router]
  );

  const logoutHandler = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  //search
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  // xs 768, sm 992, md 1200, lg 1600
  return (
    <div style={{ width: "100%" }}>
      {me ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            border: "blue solid 2px",
          }}
        >
          <NavCustomButton onClick={logoutHandler}>Logout</NavCustomButton>
          <NavCustomButton onClick={() => router.push("/profile")}>
            Profile
          </NavCustomButton>
        </div>
      ) : (
        <>
          <NavCustomButton onClick={() => clickHandler("login")}>
            Login
          </NavCustomButton>
          <NavCustomButton onClick={() => clickHandler("signup")}>
            Signup
          </NavCustomButton>
        </>
      )}
    </div>
  );
}

export default Nav;
