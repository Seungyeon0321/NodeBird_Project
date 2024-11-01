import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledLink = styled.a`
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${(props) =>
      props.theme.colors.hover.primary}; /* 원하는 색상으로 변경 */
    text-decoration: underline;
  }
`;

const StyledButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      style={{
        fontWeight: "bold",
        fontSize: 15,
        color: "#a3cfcd",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: 0,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

StyledButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default StyledButton;
