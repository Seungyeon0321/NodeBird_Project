import React, { useCallback } from "react";
import Router from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_VIEW } from "../reducers/ui";

import { logOutRequestAction } from "../reducers/user";

import { Row, Col, Layout, Menu } from "antd";

import NavCustomButton from "./NavCustomButton";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
import CommonUserForm from "../hooks/useInput";
import { useRouter } from "next/router";
import { CustomMenu } from "../styles/GlobalStyleComponent";
const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function RightSideBar() {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state) => state.user);

  //antd

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

  const items = [
    getItem(
      <div style={{ left: "0", margin: "0" }}>
        <SearchWrapper
          enterButton
          placeholder="search hashtag"
          className="ant-input-search-button"
          value={searchInput}
          onChange={onChangeSearchInput}
          onSearch={onSearch}
        />
      </div>
    ),
  ];

  // xs 768, sm 992, md 1200, lg 1600
  return (
    <Layout style={{ backgroundColor: "#f0f0f0", width: "350px" }}>
      <Sider width={350} style={siderStyle}>
        <CustomMenu
          className="right-side-bar-menu"
          selectedKeys={[]} // 선택된 아이템 하이라이트 제거
          mode="inline"
          items={items}
        />
      </Sider>
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
      {/* <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
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
      <Col span={6}>Box!</Col> */}
    </Layout>
  );
}

const siderStyle = {
  height: "100vh",
  width: "250px",
  position: "fixed",
  backgroundColor: "#f0f0f0",
};

export default RightSideBar;
