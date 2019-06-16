'use strict';

const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');

let plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

module.exports = {
  context: __dirname + "/src",
  entry: {'playkit-hls': 'index.js'},
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: ['playkit', 'adapters', 'hls'],
    libraryTarget: 'umd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: './playkit/adapters/hls/[resource-path]',
  },
  devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
        'source-map-loader',
        'eslint-loader',
      ]
    }]
  },
  devServer: {
    contentBase: __dirname + '/src'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'hls.js': path.resolve('./node_modules/hls.js/dist/hls.min.js'),
    }
  },
  externals: {
    '@playkit-js/playkit-js': {
      commonjs: '@playkit-js/playkit-js',
      commonjs2: '@playkit-js/playkit-js',
      amd: 'playkit-js',
      root: ['playkit', 'core']
    }
  }
};
