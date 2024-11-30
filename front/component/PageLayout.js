import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Nav from "./Nav";
import {
  BasicLayout,
  SideLayout,
  MainLayout,
} from "../styles/GlobalStyleComponent";

import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
const AppLayoutPage = ({ profile, postFrom, content, children }) => {
  return (
    <BasicLayout>
      <SideLayout>
        <LeftSideBar />
      </SideLayout>

      <MainLayout>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ maxWidth: "100%", minWidth: "100%" }}
        >
          {profile && (
            <Col xs={24} sm={24} md={8} lg={6} xl={6}>
              {profile}
            </Col>
          )}

          <Col
            xs={24}
            sm={24}
            md={18}
            lg={18}
            xl={18}
            style={{ maxWidth: "85%", minWidth: "85%" }}
          >
            {postFrom}
            {content}
            {children}
          </Col>
        </Row>
      </MainLayout>
      <SideLayout>
        <RightSideBar />
      </SideLayout>
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
