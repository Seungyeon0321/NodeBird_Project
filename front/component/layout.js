import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useCallback } from "react";
import { Layout, Input, Row, Col } from "antd";
import UserProfile from "./UserProfile";
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
            xs={12}
            sm={8}
            md={6}
            lg={3}
            xl={3}
            key="logo"
            style={{ fontSize: "24px", fontWeight: "bold", flex: 1 }}
          >
            <Link href="/">Node Bird</Link>
          </Col>

          <Col xs={0} sm={0} md={6} lg={9} xl={9}></Col>

          <Col xs={12} sm={16} md={12} lg={12} xl={12}>
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

              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
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
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginTop: "20px", margin: 10 }}
        >
          {me && (
            <Col xs={24} sm={24} md={8} lg={6} xl={6}>
              <UserProfile />
            </Col>
          )}
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
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
