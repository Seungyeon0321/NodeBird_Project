import React, { useCallback } from "react";
import Router from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { SET_CURRENT_VIEW } from "../reducers/ui";

import { logOutRequestAction } from "../reducers/user";

import { Row, Col } from "antd";
import StyledButton from "./button";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
import CommonUserForm from "../hooks/useInput";
import { useRouter } from "next/router";
import Image from "next/image";

function Nav() {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state) => state.user);

  // login in
  const clickHandler = useCallback(
    (action) => {
      dispatch({ type: SET_CURRENT_VIEW, data: action });
    },
    [dispatch, router]
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
        <Col span={0.5}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginRight: 10,
              marginTop: 5,
            }}
          >
            <Image
              src="https://portfolio-simon-nodebird.s3.ca-central-1.amazonaws.com/20241107_232138519.png"
              alt="logo"
              width={50}
              height={50}
              objectFit="cover"
            />
          </div>
        </Col>
        <Col span={7.5} style={{ fontSize: "30px", fontWeight: "bold" }}>
          <Link
            href="/"
            onClick={() => clickHandler("main")}
            style={{ color: "#a3cfcd" }}
          >
            Node Bird
          </Link>
        </Col>
        {/* 9+10 */}
        <Col span={16}>
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
              }}
            >
              {me ? (
                <>
                  <StyledButton onClick={logoutHandler}>Logout</StyledButton>
                  <StyledButton onClick={() => router.push("/profile")}>
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
