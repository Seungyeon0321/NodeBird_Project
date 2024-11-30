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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* <Col span={1}>
          <div
            style={{
              display: "flex",
              direction: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              marginRight: 10,
              marginTop: 5,
            }}
          >
            <Image
              src="https://portfolio-simon-nodebird.s3.ca-central-1.amazonaws.com/20241107_232138519.png"
              alt="logo"
              width={50}
              height={50}
              objectFit="cover"
            />
          </div>
        </Col> */}
        {/* <Col
          span={6}
          style={{
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          <Link
            href="/"
            onClick={() => clickHandler("main")}
            style={{ color: "#a3cfcd" }}
          >
            Node Bird
          </Link>
        </Col>
        {/* 9+10 */}
        {/* <Col span={5}></Col>  */}
        <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
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
        </Col>
        <Col
          span={6}
          style={{ border: "1px solid green", marginTop: 10, minWidth: "100%" }}
        >
          <SearchWrapper
            enterButton
            placeholder="search hashtag"
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Col>
        <Col span={6}>Box!</Col>
      </Row>
    </div>
  );
}

export default Nav;
