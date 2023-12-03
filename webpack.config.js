const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, { mode }) => {
  return {
    entry:  './src/index.ts',
    optimization: {
      minimize: mode !== 'development',
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false
            }
          }
        })
      ]
    },
    // devtool: 'source-map',
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          // test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', {
                loose: true,
                bugfixes: true,
                targets: "defaults"
                // targets: {
                //   "browsers": ["chrome >= 47", "firefox >= 51", "ie >= 11", "safari >= 8", "ios >= 8", "android >= 4"]
                // }
              }], '@babel/preset-typescript'],
              plugins: [['@babel/plugin-transform-runtime']]
            }
          }
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'playkit-hls.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        umdNamedDefine: true,
        name: ['playkit', 'hls'],
        type: 'umd',
      },
      clean: true
      // devtoolModuleFilenameTemplate: './hls/[resource-path]'
    },
    externals: {
      'hls.js': {root: 'Hls'},
      '@playkit-js/@playkit-js': {root: ['playkit', 'core']}
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'demo')
      },
      client: {
        progress: true
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageData.version),
        __NAME__: JSON.stringify(packageData.name)
      })
    ]
  }
};
