import React, { useState } from "react";
import {
  BellOutlined,
  HeartOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { PlusOutlined } from "@ant-design/icons";
import { CustomButton } from "../styles/GlobalStyleComponent";

// Need to make different component for this lists
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Home", "1", <HomeOutlined />),
  getItem("Notifications", "2", <BellOutlined />),
  getItem("Followers", "3", <TeamOutlined />),
  getItem("Following", "4", <TeamOutlined />),
  getItem("Likes", "5", <HeartOutlined />),
];

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        position: "sticky", // fixed 대신 sticky 사용
        top: 0, // 상단에 고정
        height: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ backgroundColor: "#f0f0f0" }}
        className="custom-sider"
      >
        <div className="demo-logo-vertical" />
        <Menu
          style={{ backgroundColor: "#f0f0f0" }}
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <CustomButton
          style={{ marginTop: "30px", marginLeft: "20px", width: "90%" }}
        >
          Post
        </CustomButton>
      </Sider>
    </Layout>
  );
};
export default SideBar;
