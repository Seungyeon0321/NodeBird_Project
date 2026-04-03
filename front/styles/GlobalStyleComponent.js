import styled, { css } from "styled-components";
import { Button, Input, Menu, Layout } from "antd";
const { Header } = Layout;
import Image from "next/image";
//layout

const LayoutWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--container-max, 1280px);
  margin: 0 auto;
  padding: 0 var(--container-padding, 16px);
`;

const HeaderLayout = styled(Header)`
  background: var(--surface, #ffffff);
  padding: 0;
  margin: 0;
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
`;

const NavLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledImage = styled(Image)`
  border-radius: 9999px;
  border: 1px solid var(--border-color, #e5e7eb);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

const BasicLayout = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: var(--page-bg, #f6f7fb);
  padding: 24px 0;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px 0;
    gap: 16px;
  }
`;

const MainLayout = styled.div`
  width: 100%;
  max-width: var(--main-max-width, 720px);
  height: 100%;
  min-width: 0;
`;

const LeftSideLayout = styled.div`
  width: min(100%, var(--sidebar-left-width, 280px));
  max-width: var(--sidebar-left-width, 280px);
  height: 100%;
  background: transparent;
`;

const RightSideLayout = styled.div`
  width: min(100%, var(--sidebar-right-width, 320px));
  max-width: var(--sidebar-right-width, 320px);
  height: 100%;
  background: transparent;
`;

const CustomMenu = styled(Menu)`
  background-color: transparent !important;
  width: 300px;
  margin: 0;
  .ant-menu-item:hover {
    background-color: transparent !important;
    color: inherit !important;
    cursor: default;
  }
  .ant-menu-item {
    padding-left: 0px !important;
  }
`;

// 공통 폰트 스타일 정의
const commonFontStyle = css`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif !important;
`;

// 기존 버튼 스타일에 공통 폰트 스타일 추가
const CustomButton = styled(Button)`
  ${commonFontStyle}
  background-color: ${(props) => props.theme.colors.primary} !important;
  border-color: ${(props) => props.theme.colors.primary} !important;
  color: white !important;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.hover.primary} !important;
    border-color: ${(props) => props.theme.colors.hover.primary} !important;
  }
`;

const CustomButton2 = styled(Button)`
  ${commonFontStyle}
  background-color: white !important;
  border-color: ${(props) => props.theme.colors.secondary} !important;
  color: black !important;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.hover.primary} !important;
    border-color: ${(props) => props.theme.colors.hover.primary} !important;
  }
`;

const SearchWrapper = styled(Input.Search).withConfig({
  componentId: "Search-wrapper",
})`
  vertical-align: middle;
  left: 0;
  .ant-input-search-button {
    background-color: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;

    &:hover {
      background-color: ${(props) =>
        props.theme.colors.hover.primary} !important;
      border-color: ${(props) => props.theme.colors.hover.primary} !important;
    }
  }
`;

const NavButton = styled(Button)`
  background: none;
  cursor: pointer;
  padding: 0;
`;

const StyledButton = styled.button`
  ${commonFontStyle}
  font-weight: bold;
  font-size: 18px;
  color: ${(props) => props.theme?.colors?.primary ?? "#a3cfcd"};
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    color: ${(props) => props.theme.colors.secondary};
  }
`;

export {
  StyledImage,
  BasicLayout,
  LeftSideLayout,
  RightSideLayout,
  CustomButton,
  CustomButton2,
  SearchWrapper,
  NavButton,
  StyledButton,
  MainLayout,
  CustomMenu,
  HeaderLayout,
  LayoutWrapper,
  NavLayout,
};
