const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production";
    // const plugins = [...config.plugins,
    // new webpack.ContextReplacementPlugin(/moment[/\\\]locale$/, /^\.\/en$/)];

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
