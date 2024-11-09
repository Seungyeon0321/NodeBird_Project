import React from "react";
import PropTypes from "prop-types";
import { StyledButton } from "../styles/GlobalStyleComponent";

const NavCustomButton = ({ children, onClick }) => {
  return (
    <>
      <StyledButton onClick={onClick}>{children}</StyledButton>
    </>
  );
};

NavCustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default NavCustomButton;
