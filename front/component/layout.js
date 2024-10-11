import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useCallback } from "react";
import { Layout, Input, Row, Col } from "antd";
import UserProfile from "./userProfile";
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
        <Row style={{ display: "flex", alignItems: "center" }}>
          <Col
            span={3}
            key="logo"
            style={{ fontSize: "24px", fontWeight: "bold", flex: 1 }}
          >
            <Link href="/">Node Bird</Link>
          </Col>

          <Col span={9}></Col>

          <Col span={12}>
            <Row style={{ display: "flex", justifyContent: "flex-end" }}>
              <Col
                span={12}
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "flex-end",
                  paddingRight: 20,
                }}
              >
                {me ? (
                  <>
                    <StyledButton
                      href="/logout"
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Logout
                    </StyledButton>
                    <StyledButton
                      href="/profile"
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
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
              </Col>

              <Col span={12}>
                <SearchWrapper
                  enterButton
                  value={searchInput}
                  onChange={onChangeSearchInput}
                  onSearch={onSearch}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>

      <Content>
        <Row gutter={8} justify="center" style={{ marginTop: "10px" }}>
          {me && (
            <Col xs={12}>
              <UserProfile />
            </Col>
          )}
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
