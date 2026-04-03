import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Drawer, Grid, Row, Col } from "antd";
import Nav from "./Nav";
import {
  HeaderLayout,
  BasicLayout,
  MainLayout,
  LayoutWrapper,
  LeftSideLayout,
  RightSideLayout,
} from "../styles/GlobalStyleComponent";

import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
const AppLayoutPage = ({ profile, postFrom, content, children }) => {
  const screens = Grid.useBreakpoint();
  const isDesktopWithSidebars = !!screens.lg; // antd: lg >= 992px
  const [collapsed, setCollapsed] = useState(false);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  useEffect(() => {
    // Breakpoint가 바뀌면 Drawer 상태를 닫아 UX를 안정화합니다.
    if (isDesktopWithSidebars) {
      setLeftDrawerOpen(false);
      setRightDrawerOpen(false);
    }
  }, [isDesktopWithSidebars]);

  useEffect(() => {
    setCollapsed(screens.xs);
  }, [screens.xs]);

  const openLeftDrawer = useCallback(() => setLeftDrawerOpen(true), []);
  const openRightDrawer = useCallback(() => setRightDrawerOpen(true), []);
  const closeLeftDrawer = useCallback(() => setLeftDrawerOpen(false), []);
  const closeRightDrawer = useCallback(() => setRightDrawerOpen(false), []);

  const drawerBodyStyles = useMemo(
    () => ({ padding: 0, background: "transparent" }),
    []
  );

  return (
    <>
      <LayoutWrapper>
        <HeaderLayout>
          <Nav
            onOpenLeftMenu={openLeftDrawer}
            onOpenRightSidebar={openRightDrawer}
          />
        </HeaderLayout>
        <BasicLayout>
          {isDesktopWithSidebars && (
            <LeftSideLayout>
              <LeftSideBar />
            </LeftSideLayout>
          )}

          <MainLayout>
            <Row gutter={[24, 24]} justify="center" style={{ margin: 0 }}>
              {profile && (
                <Col xs={24} sm={24} md={8} lg={7} xl={6}>
                  {profile}
                </Col>
              )}
              <Col xs={24} sm={24} md={16} lg={17} xl={18}>
                {postFrom}
                {content}
                {children}
              </Col>
            </Row>
          </MainLayout>

          {isDesktopWithSidebars && (
            <RightSideLayout>
              <RightSideBar />
            </RightSideLayout>
          )}
        </BasicLayout>
      </LayoutWrapper>

      <Drawer
        placement="left"
        open={leftDrawerOpen}
        onClose={closeLeftDrawer}
        width={collapsed ? 90 : 280}
        styles={{ body: drawerBodyStyles }}
        destroyOnClose
      >
        <LeftSideBar />
      </Drawer>

      <Drawer
        placement="right"
        open={rightDrawerOpen}
        onClose={closeRightDrawer}
        width={320}
        styles={{ body: drawerBodyStyles }}
        destroyOnClose
      >
        <RightSideBar />
      </Drawer>
    </>
  );
};

export default AppLayoutPage;

AppLayoutPage.propTypes = {
  profile: PropTypes.node,
  postFrom: PropTypes.node,
  content: PropTypes.node,
  children: PropTypes.node,
};
