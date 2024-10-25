import React from "react";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { Layout, Row, Col } from "antd";
import { useSelector } from "react-redux";

import CommonUserForm from "../hooks/useInput";

import Nav from "./Nav";

import { logOutRequestAction } from "../reducers/user";

const { Header, Content } = Layout;

const AppLayout = ({ children, profile, postFrom, content }) => {
  const { me } = useSelector((state) => state.user);

  return (
    <Layout>
      <Header style={{ background: "#e3e0f3" }}>
        <Nav />
      </Header>

      <Content>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginTop: "20px", margin: 10 }}
        >
          {profile && (
            <Col xs={24} sm={24} md={8} lg={6} xl={6}>
              {profile}
            </Col>
          )}

          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            {postFrom}
            {content}
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
  profile: PropTypes.node,
  postFrom: PropTypes.node,
  content: PropTypes.node,
};
