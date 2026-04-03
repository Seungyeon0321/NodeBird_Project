import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  BellOutlined,
  HeartOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Grid, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { SET_CURRENT_VIEW, SET_IS_POSTING } from "../reducers/ui";
import { CustomButton } from "../styles/GlobalStyleComponent";
import getItem from "./ui/GetItem";

const items = [
  getItem("Home", "1", <HomeOutlined style={{ fontSize: "20px" }} />),
  getItem("Notifications", "2", <BellOutlined style={{ fontSize: "20px" }} />),
  getItem("Followers", "3", <TeamOutlined style={{ fontSize: "20px" }} />),
  getItem("Following", "4", <TeamOutlined style={{ fontSize: "20px" }} />),
  getItem("Likes", "5", <HeartOutlined style={{ fontSize: "20px" }} />),
];

const LeftSideBar = () => {
  const screens = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [clickedPost, setClickedPost] = useState(false);
  const dispatch = useDispatch();
  const { currentView } = useSelector((state) => state.ui);
  const { me } = useSelector((state) => state.user);

  const clickHandler = ({ key }) => {
    switch (key) {
      case "1":
        dispatch({ type: SET_CURRENT_VIEW, data: "main" });
        break;
      case "2":
        dispatch({ type: SET_CURRENT_VIEW, data: "notification" });
        break;
      case "3":
        dispatch({ type: SET_CURRENT_VIEW, data: "follower" });
        break;
      case "4":
        dispatch({ type: SET_CURRENT_VIEW, data: "following" });
        break;
      case "5":
        dispatch({ type: SET_CURRENT_VIEW, data: "like" });
        break;
    }
  };

  useEffect(() => {
    setCollapsed(screens.xs);
  }, [screens.sm]);

  const postButtonHandler = useCallback(() => {
    setClickedPost((prev) => !prev);
    dispatch({ type: SET_IS_POSTING, data: clickedPost });
  }, [clickedPost]);

  if (!me) return null;

  return (
    <div
      style={{
        width: collapsed ? 90 : 280,
        minWidth: collapsed ? 90 : 280,
        height: "100%",
        backgroundColor: "transparent",
        overflow: "auto",
        border: "1px solid orange",
        transition: "width 0.2s, min-width 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Menu
        style={{
          backgroundColor: "transparent",
          fontSize: "16px",
          border: "1px solid red",
          flex: 1,
        }}
        defaultSelectedKeys={["1"]}
        inlineCollapsed={collapsed}
        mode="inline"
        items={items}
        onClick={clickHandler}
      />

      {currentView !== "login" && currentView !== "signup" && (
        <CustomButton
          style={{
            margin: 16,
            width: "calc(100% - 32px)",
          }}
          onClick={postButtonHandler}
        >
          {collapsed ? "+" : "Post"}
        </CustomButton>
      )}

      {/* collapse 토글 버튼 */}
      <div
        style={{
          padding: "12px 16px",
          cursor: "pointer",
          textAlign: collapsed ? "center" : "right",
        }}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </div>
  );
};

export default LeftSideBar;