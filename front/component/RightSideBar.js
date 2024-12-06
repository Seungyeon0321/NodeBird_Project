import React, { useCallback } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import CommonUserForm from "../hooks/useInput";
import UserProfile from "./UserProfile";
import { Layout } from "antd";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
import { CustomMenu } from "../styles/GlobalStyleComponent";
import getItem from "./ui/GetItem";
const { Sider } = Layout;

function RightSideBar() {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  const currentView = useSelector((state) => state.ui.currentView);
  const profile = useSelector((state) => state.user.me);

  //search
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <>
      {currentView === "signup" || currentView === "login" ? null : (
        <>
          <SearchWrapper
            enterButton
            placeholder="search hashtag"
            className="ant-input-search-button"
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
            style={{ marginBottom: "10px", width: "300px " }}
          />
          <div>{profile && <UserProfile />}</div>
        </>
      )}
    </>
  );
}
const siderStyle = {
  position: "fixed",
  backgroundColor: "#f0f0f0",
};

export default RightSideBar;
