const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  compress: true,
  images: {
    domains: ["portfolio-simon-nodebird.s3.ca-central-1.amazonaws.com"],
  },
  webpack(config, { webpack, isServer }) {
    const prod = process.env.NODE_ENV === "production";
    // const plugins = [...config.plugins,
    // new webpack.ContextReplacementPlugin(/moment[/\\\]locale$/, /^\.\/en$/)];

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    return {
      ...config,
      mode: prod ? "production" : "development",
      devtool: prod ? "hidden-source-map" : "eval",
      // plugins :[
      //   ...config.plugins,
      // ],
    };
  },
});

//webpack은 보통 next에 기본 장착되어 있기 때문에 이렇게 config를 통해서 커스텀할 수 있다
