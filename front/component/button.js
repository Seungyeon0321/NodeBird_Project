import React, { useState } from "react";
import Link from "next/link";

const StyledButton = ({ href, children, style }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset after animation
  };

  return (
    <Link
      href={href}
      className={isClicked ? "clicked" : ""}
      passHref
      style={style}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default StyledButton;
