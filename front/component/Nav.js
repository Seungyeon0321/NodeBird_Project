import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_VIEW } from "../reducers/ui";

import { logOutRequestAction } from "../reducers/user";

import NavCustomButton from "./NavCustomButton";
import { StyledImage } from "../styles/GlobalStyleComponent";
import { useRouter } from "next/router";
import { NavLayout } from "../styles/GlobalStyleComponent";
import { Button, Grid } from "antd";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";

function Nav({ onOpenLeftMenu, onOpenRightSidebar }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state) => state.user);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  // login in
  const clickHandler = useCallback(
    (action) => {
      dispatch({ type: SET_CURRENT_VIEW, data: action });
    },
    [dispatch]
  );

  const logoutHandler = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  // xs 768, sm 992, md 1200, lg 1600
  return (
    <NavLayout
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isMobile && onOpenLeftMenu && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            aria-label="Open menu"
            onClick={onOpenLeftMenu}
            style={{ padding: 8 }}
          />
        )}
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => router.push("/")}
        >
          <StyledImage
            src={
              "https://portfolio-simon-nodebird.s3.ca-central-1.amazonaws.com/nodebird_logo.png"
            }
            alt="logo"
            width={35}
            height={35}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
          padding: "0 4px",
          flexWrap: "wrap",
        }}
      >
        {isMobile && onOpenRightSidebar && (
          <Button
            type="text"
            icon={<SearchOutlined />}
            aria-label="Open search"
            onClick={onOpenRightSidebar}
            style={{ padding: 8 }}
          />
        )}
        {me && (
          <>
            <NavCustomButton onClick={logoutHandler}>Logout</NavCustomButton>
            <NavCustomButton onClick={() => router.push("/profile")}>
              Profile
            </NavCustomButton>
          </>
        )}
        {!me && (
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
    </NavLayout>
  );
}

export default Nav;
