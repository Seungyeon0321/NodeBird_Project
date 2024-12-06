import React, { useState } from "react";
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

import { SET_CURRENT_VIEW } from "../reducers/ui";
import { CustomButton } from "../styles/GlobalStyleComponent";
import getItem from "./ui/GetItem";

const items = [
  getItem("Home", "1", <HomeOutlined />),
  getItem("Notifications", "2", <BellOutlined />),
  getItem("Followers", "3", <TeamOutlined />),
  getItem("Following", "4", <TeamOutlined />),
  getItem("Likes", "5", <HeartOutlined />),
];

const LeftSideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { currentView } = useSelector((state) => state.ui);
  const { me } = useSelector((state) => state.user);

  const clickHandler = ({ key }) => {
    switch (key) {
      case "1":
        dispatch({ type: SET_CURRENT_VIEW, data: "home" });
        break;
    }
  };

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
      {currentView === "home" ||
        (me && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
              backgroundColor: "#f0f0f0",
              position: "fixed",
            }}
            className="custom-sider"
          >
            <div className="demo-logo-vertical" />
            <Menu
              style={{
                backgroundColor: "#f0f0f0",
                maxWidth: "260px",
                minWidth: "260px",
              }}
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items}
              onClick={clickHandler}
            />
            <CustomButton
              style={{
                marginTop: "30px",
                marginLeft: "20px",
                width: "90%",
              }}
            >
              Post
            </CustomButton>
          </Sider>
        ))}
    </Layout>
  );
};

export default LeftSideBar;
