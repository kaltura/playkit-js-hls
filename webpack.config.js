const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');

module.exports = (env, {mode}) => {
  return {
    entry: './src/index.ts',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    bugfixes: true
                  }
                ],
                '@babel/preset-typescript'
              ],
              plugins: [['@babel/plugin-transform-runtime']]
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      filename: 'playkit-hls.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        umdNamedDefine: true,
        name: ['playkit', 'hls'],
        type: 'umd'
      },
      clean: true
    },
    externals: {
      'hls.js': {
        commonjs: 'hls.js',
        commonjs2: 'hls.js',
        amd: 'hls.js',
        root: ['Hls']
      },
      '@playkit-js/playkit-js': {
        commonjs: '@playkit-js/playkit-js',
        commonjs2: '@playkit-js/playkit-js',
        amd: '@playkit-js/playkit-js',
        root: ['playkit', 'core']
      }
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
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
  };
};
