const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");
const path = require("path");

module.exports = {
  mode: "production", // enables tree shaking and minification
  resolve: {
    fallback: {
      fs: false, // fs is not available in the browser
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      util: require.resolve("util/"),
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
      url: require.resolve("url/"),
      tty: require.resolve("tty-browserify"),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            dead_code: true,
            unused: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    usedExports: true, // tree shaking
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(path.join(__dirname, "../src/**/*"), { nodir: true }),
      safelist: () => ({ standard: [/^Mui/, /^css-/] }), // adjust as needed
    }),
  ],
};
