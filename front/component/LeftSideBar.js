import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  BellOutlined,
  HeartOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;

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
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const postButtonHandler = useCallback(() => {
    setClickedPost((prev) => !prev);
    dispatch({ type: SET_IS_POSTING, data: clickedPost });
  }, [clickedPost]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        height: "100vh",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
      }}
    >
      {(currentView !== "login" && me) || (currentView !== "signup" && me) ? (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            backgroundColor: "#f0f0f0",
            position: "fixed",
            border: "1px solid red",
          }}
          className="custom-sider"
        >
          <div className="demo-logo-vertical" />
          <Menu
            style={{
              backgroundColor: "#f0f0f0",
              maxWidth: "260px",
              border: "1px solid green",
              fontSize: "16px",
            }}
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onClick={clickHandler}
          />
          {currentView !== "login" && currentView !== "signup" && (
            <CustomButton
              style={{
                marginTop: "30px",
                marginLeft: "20px",
                width: "90%",
              }}
              onClick={postButtonHandler}
            >
              Post
            </CustomButton>
          )}
        </Sider>
      ) : null}
    </Layout>
  );
};

export default LeftSideBar;
