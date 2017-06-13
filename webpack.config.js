'use strict';

const webpack = require("webpack");
const path = require("path");
const PROD = (process.env.NODE_ENV === 'production');

let plugins = PROD ? [new webpack.optimize.UglifyJsPlugin({sourceMap: true})] : [];
let externals = PROD ? {
  "playkit-js": {
    commonjs: "playkit-js",
    commonjs2: "playkit-js",
    amd: "playkit-js",
    root: "Playkit"
  },
  "hls.js": {
    commonjs: "hls.js",
    commonjs2: "hls.js",
    amd: "hls.js",
    root: "Hls"
  }
} : {};

module.exports = {
  context: __dirname + "/src",
  entry: {
    "playkit-js-hls": "hls-adapter.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: "PlaykitJsHls",
    libraryTarget: "umd"
  },
  devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader"
      }],
      exclude: [
        /node_modules/
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      enforce: 'pre',
      use: [{
        loader: 'eslint-loader',
        options: {
          rules: {
            semi: 0
          }
        }
      }]
    }]
  },
  devServer: {
    contentBase: __dirname + "/src"
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  },
  externals: externals
};
