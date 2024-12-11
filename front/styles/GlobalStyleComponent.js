import styled, { css } from "styled-components";
import { Button, Input, Menu, Layout } from "antd";
const { Header } = Layout;
import Image from "next/image";
//layout

const LayoutWrapper = styled(Layout)`
  display: flex;
  justify-content: center;
  width: 1400px;
  max-width: 1400px;
`;

const HeaderLayout = styled(Header)`
  background-color: #f0f0f0;
  padding: 0;
  margin: 0;
  height: 40px;
  width: 100%;
  max-width: 1400px;
  min-width: 1400px;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledImage = styled(Image)`
  border-radius: 30%;
  border: 1px solid #000;
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
  background-color: #f0f0f0;
`;

const MainLayout = styled.div`
  width: 700px;
  height: 100%;
  background-color: #f0f0f0;
`;

const SideLayout = styled.div`
  width: 350px;
  height: 100%;
  background-color: #f0f0f0;
`;

const CustomMenu = styled(Menu)`
  background-color: #f0f0f0 !important;
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
      props.theme.colors.hover.secondary} !important;
    border-color: ${(props) => props.theme.colors.hover.secondary} !important;
  }
`;

const CustomButton2 = styled(Button)`
  ${commonFontStyle}
  background-color: white !important;
  border-color: ${(props) => props.theme.colors.secondary} !important;
  color: black !important;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.hover.secondary} !important;
    border-color: ${(props) => props.theme.colors.hover.secondary} !important;
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
        props.theme.colors.hover.secondary} !important;
      border-color: ${(props) => props.theme.colors.hover.secondary} !important;
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
  color: #a3cfcd;
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
  SideLayout,
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
