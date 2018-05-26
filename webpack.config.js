'use strict';

const webpack = require("webpack");
const path = require("path");
const packageData = require("./package.json");

let plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

module.exports = {
  context: __dirname + "/src",
  entry: {"playkit-hls": "index.js"},
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: ["playkit", "adapters", "hls"],
    libraryTarget: "umd",
    devtoolModuleFilenameTemplate: "./playkit/adapters/hls/[resource-path]",
  },
  devtool: 'source-map',
  optimization:{
    minimize:false
  },
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        "babel-loader",
        "eslint-loader",
      ]
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
  externals: {
    "playkit-js": {
      commonjs: "playkit-js",
      commonjs2: "playkit-js",
      amd: "playkit-js",
      root: ["playkit", "core"]
    },
    "hls.js": {
      commonjs: "hls.js",
      commonjs2: "hls.js",
      amd: "hls.js",
      root: "Hls"
    }
  }
};
