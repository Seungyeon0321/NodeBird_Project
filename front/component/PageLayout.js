import React from "react";
import PropTypes from "prop-types";
import { Layout, Row, Col } from "antd";
import Nav from "./Nav";
import { BasicLayout, leftSideLayout } from "../styles/GlobalStyleComponent";
const { Content } = Layout;
import SideBar from "./SideBar";

const AppLayoutPage = ({ profile, postFrom, content, children }) => {
  return (
    <BasicLayout>
      <leftSideLayout>
        <SideBar />
      </leftSideLayout>

      <div>
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
          <Col xs={24} md={6}>
            <a rel="noReferred noOpener">Let`s go!</a>
          </Col>
        </Row>
      </div>
    </BasicLayout>
  );
};

export default AppLayoutPage;

AppLayoutPage.propTypes = {
  profile: PropTypes.node,
  postFrom: PropTypes.node,
  content: PropTypes.node,
  children: PropTypes.node,
};
