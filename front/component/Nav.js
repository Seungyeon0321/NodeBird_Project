import React, { useCallback } from "react";
import Router from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { CLICK_NAV_PROFILE } from "../reducers/user";
import { SET_CURRENT_VIEW } from "../reducers/ui";

import { logOutRequestAction } from "../reducers/user";

import { Row, Col } from "antd";
import StyledButton from "./button";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
import CommonUserForm from "../hooks/useInput";

function Nav() {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);

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

  //search
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  // xs 768, sm 992, md 1200, lg 1600
  return (
    <div>
      <Row>
        <Col span={10} style={{ fontSize: "24px", fontWeight: "bold" }}>
          <Link
            href="/"
            onClick={() => clickHandler("main")}
            style={{ color: "#a3cfcd" }}
          >
            Node Bird
          </Link>
        </Col>

        <Col span={14}>
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "flex-end",
                paddingRight: 20,
                marginBottom: 10,
              }}
            >
              {me ? (
                <>
                  <StyledButton onClick={logoutHandler}>Logout</StyledButton>
                  <StyledButton onClick={() => clickHandler(CLICK_NAV_PROFILE)}>
                    Profile
                  </StyledButton>
                </>
              ) : (
                <>
                  <StyledButton onClick={() => clickHandler("login")}>
                    Login
                  </StyledButton>
                  <StyledButton onClick={() => clickHandler("signup")}>
                    Signup
                  </StyledButton>
                </>
              )}
            </Col>

            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <SearchWrapper
                enterButton
                placeholder="search hashtag"
                value={searchInput}
                onChange={onChangeSearchInput}
                onSearch={onSearch}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Nav;
