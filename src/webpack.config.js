const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      fs: false, // fs is not available in the browser
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      util: require.resolve('util/'),
      crypto: require.resolve('crypto-browserify'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      buffer: require.resolve('buffer/'),
      assert: require.resolve('assert/'),
      url: require.resolve('url/'),
      tty: require.resolve('tty-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};
