import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_VIEW } from "../reducers/ui";

import { logOutRequestAction } from "../reducers/user";

import NavCustomButton from "./NavCustomButton";
import { StyledImage } from "../styles/GlobalStyleComponent";
import { useRouter } from "next/router";
import { NavLayout } from "../styles/GlobalStyleComponent";
import image from "../images/image_1.png";

function Nav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state) => state.user);

  // login in
  const clickHandler = useCallback(
    (action) => {
      console.log(action);
      dispatch({ type: SET_CURRENT_VIEW, data: action });
    },
    [dispatch, router]
  );

  const logoutHandler = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  // xs 768, sm 992, md 1200, lg 1600
  return (
    <NavLayout style={{ display: "flex", justifyContent: "space-between" }}>
      <div
        style={{
          paddingLeft: "180px",
          cursor: "pointer",
        }}
        onClick={() => router.push("/")}
      >
        <StyledImage src={image} width={35} height={35} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          paddingRight: "50px",
          paddingBottom: "10px",
          position: "sticky",
        }}
      >
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
