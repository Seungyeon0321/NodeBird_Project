import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useCallback } from "react";
import { Layout, Input, Row, Col } from "antd";

import { useSelector } from "react-redux";
import styled from "styled-components";
import CommonUserForm from "../hooks/useInput";
import StyledButton from "./button";
import Router from "next/router";

const SearchWrapper = styled(Input.Search)`
  vertical-align: middle;

  .ant-input-search-button {
    background-color: #8685ef;
    border-color: #8685ef;
  }
`;

const { Header, Content } = Layout;

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  const { me } = useSelector((state) => state.user);

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <Layout>
      <Header style={{ background: "#e3e0f3" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            key="logo"
            style={{ fontSize: "24px", fontWeight: "bold", flex: 1 }}
          >
            <Link href="/">Node Bird</Link>
          </div>

          <div style={{ flex: 4 }}></div>

          <div
            style={{
              display: "flex",
              flex: 0.7,
              justifyContent: "space-evenly",
            }}
          >
            {me ? (
              <>
                <StyledButton
                  href="/profile"
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    marginLeft: "30vw",
                  }}
                >
                  Profile
                </StyledButton>
              </>
            ) : (
              <>
                <StyledButton
                  href="/login"
                  style={{ fontWeight: "bold", fontSize: 15 }}
                >
                  Login
                </StyledButton>
                <StyledButton
                  href="/signup"
                  style={{ fontWeight: "bold", fontSize: 15 }}
                >
                  Signup
                </StyledButton>
              </>
            )}
          </div>

          <div style={{ flex: 2, marginLeft: 20 }}>
            <SearchWrapper
              enterButton
              value={searchInput}
              onChange={onChangeSearchInput}
              onSearch={onSearch}
            />
          </div>
        </div>
      </Header>

      <Content>
        <Row gutter={8} justify="center" style={{ marginTop: "10px" }}>
          {/* <Col xs={12}>{me ? <UserProfile /> : <LoginForm />}</Col> */}
          <Col xs={24} md={{ span: 12 }}>
            {children}
          </Col>
          {/* <Col xs={24} md={6}>
          <a rel="noReferred noOpener">Let`s go!</a>
        </Col> */}
        </Row>
      </Content>
    </Layout>
  );
};

export default AppLayout;

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
