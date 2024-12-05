import React, { useCallback } from "react";
import Router from "next/router";

import CommonUserForm from "../hooks/useInput";

import { Layout } from "antd";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
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

  return (
    <Layout>
      <Sider width={350} style={siderStyle}>
        <CustomMenu
          className="right-side-bar-menu"
          mode="inline"
          items={items}
        />
      </Sider>
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
