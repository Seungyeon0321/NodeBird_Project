import styled from "styled-components";
import { Button, Input, Menu, Layout } from "antd";
const { Header } = Layout;
//layout

const LayoutWrapper = styled(Layout)`
  display: flex;
  justify-content: center;
  width: 1400px;
`;

const HeaderLayout = styled(Header)`
  background-color: #f0f0f0;
  padding: 0;
  margin: 0;
  height: 30px;
  width: 100%;
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
  .ant-menu-item:hover {
    background-color: transparent !important;
    color: inherit !important;
    cursor: default;
  }
  .ant-menu-item {
    padding-left: 0px !important;
  }
`;

const CustomButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary} !important;
  border-color: ${(props) => props.theme.colors.primary} !important;
  color: white !important;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.hover
        .primary} !important; /* 원하는 호버 색상으로 변경 */
    border-color: ${(props) => props.theme.colors.hover.primary} !important;
    color: black !important;
  }
`;

const CustomButton2 = styled(Button)`
  background-color: white !important;
  border-color: ${(props) => props.theme.colors.secondary} !important;
  color: black !important;

  &:hover {
    background-color: #2a272a !important; /* 원하는 호버 색상으로 변경 */
    border-color: #2a272a !important;
    color: white !important;
  }
`;

const SearchWrapper = styled(Input.Search).withConfig({
  componentId: "Search-wrapper",
})`
  vertical-align: middle;
  left: 0;
  .ant-input-search-button {
    background-color: #a3cfcd;
  }
`;

const NavButton = styled(Button)`
  background: none;
  cursor: pointer;
  padding: 0;
`;

const StyledButton = styled.button`
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
    color: #7ba8a6;
  }
`;

export {
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
};
