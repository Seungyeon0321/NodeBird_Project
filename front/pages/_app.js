import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import wrapper from "../store/configureStore";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import "../styles/globals.css";
// import MillionLint from "@million/lint";

const NodeBird = ({ Component }) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <title>Node Bird</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A social media platform for bird enthusiasts"
        />
        <meta property="og:title" content="Node Bird" />
        <meta
          property="og:description"
          content="Connect with other bird lovers and share your bird watching experiences"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portfolio-simon.com" />
        <meta
          property="og:image"
          content="https://portfolio-simon-nodebird.s3.ca-central-1.amazonaws.com/nodebird_logo.jpg"
        />
        <meta property="og:image:alt" content="NodeBird Logo" />
        <meta property="og:site_name" content="Node Bird" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nodebird" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component />
    </ThemeProvider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
// export default MillionLint.next({ rsc: true })(wrapper.withRedux(NodeBird));
