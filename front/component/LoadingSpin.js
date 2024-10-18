import React from "react";
import { Flex, Spin } from "antd";

const LoadingSpin = () => {
  return (
    <>
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    </>
  );
};

export default LoadingSpin;
