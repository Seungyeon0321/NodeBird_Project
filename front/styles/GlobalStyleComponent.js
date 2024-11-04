import styled from "styled-components";
import { Button, Input } from "antd";

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

  .ant-input-search-button {
    background-color: #a3cfcd;
  }
`;

const NavButton = styled(Button)`
  background: none;
  cursor: pointer;
  padding: 0;
`;

export { CustomButton, CustomButton2, SearchWrapper, NavButton };
