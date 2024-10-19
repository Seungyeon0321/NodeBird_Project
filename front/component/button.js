import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
const StyledButton = ({ href, children, style, onClick }) => {
  return (
    <Link href={href} passHref style={style} onClick={onClick}>
      {children}
    </Link>
  );
};

StyledButton.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default StyledButton;
