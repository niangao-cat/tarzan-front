const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');
const paths = require('./paths');

const theme = require('./theme');

const common = [
  'react',
  'react-dom',
  'dva',
  'dva/router',
  'dva/saga',
  'dva/fetch',
  'hzero-ui',
  'choerodon-ui',
  'choerodon-ui/pro',
  '@babel/polyfill',
  'core-js',
];

const vendors = [
  'lodash',
  'lodash-decorators',
  'react-intl-universal',
  'uuid/v4',
  'numeral',
  'react-cropper',
  'cropperjs',
];

const vendorsGraph = [
  'echarts',
];

module.exports = {
  mode: 'production',
  performance: {
    hints: false,
  },
  output: {
    path: paths.appDll,
    publicPath: paths.servedPath,
    filename: '[name].[hash].dll.js',
    library: '[name]_[hash]',
  },
  entry: {
    common,
    vendors,
    vendors_graph: vendorsGraph,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "less-loader",
            options: {
              modifyVars: theme,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              'react-app'
            ],
            'plugins': [
              [
                'import',
                {
                  'libraryName': 'hzero-ui',
                  'libraryDirectory': 'es',
                  'style': true
                },
                'ant'
              ],
              [
                "import",
                {
                  "libraryName": "choerodon-ui",
                  "style": true
                },
                "c7n"
              ],
              [
                "import",
                {
                  "libraryName": "choerodon-ui/pro",
                  "style": true,
                },
                "c7n-pro"
              ],
              [
                '@babel/plugin-proposal-decorators', // ???????????????
                {
                  'legacy': true
                }
              ],
              [
                '@babel/plugin-proposal-class-properties',
                {
                  'loose': true
                }
              ],
            ]
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([paths.appDll], {
      root: paths.appPath, // ?????????
      verbose: true, // ??????????????????????????????
      dry: false, // ??????????????????
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new FriendlyErrorsWebpackPlugin(),
    new WebpackBar({ name: '????  HZero Front Dll', color: '#29BECE' }),
    new webpack.DllPlugin({
      path: path.join(paths.appDll, '[name].manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
};
