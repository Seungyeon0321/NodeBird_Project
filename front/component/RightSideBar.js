import React, { useCallback } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import CommonUserForm from "../hooks/useInput";
import UserProfile from "./UserProfile";
import { SearchWrapper } from "../styles/GlobalStyleComponent";

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
        <div style={{ position: "sticky", top: "40px" }}>
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
        </div>
      )}
    </>
  );
}

export default RightSideBar;
