import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { Row, Col } from "antd";
import { useRouter } from "next/router";

const Loading = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 5000);
  }, []);

  return loading ? (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Col>
        <ReactLoading type="spin" color="#2B78F9" height={667} width={375} />
      </Col>
    </Row>
  ) : (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Col>
        <p style={{ fontSize: 20 }}>
          You will be redirected to the main page soon!
        </p>
      </Col>
    </Row>
  );
};

export default Loading;
