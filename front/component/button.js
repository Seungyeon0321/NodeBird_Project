import React from "react";
import PropTypes from "prop-types";

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
