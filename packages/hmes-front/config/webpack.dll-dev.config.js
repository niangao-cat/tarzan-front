const { cloneDeep } = require('lodash');

const webpackDllConfig = require('./webpack.dll.config');
const webpackDllDevConfig = cloneDeep(webpackDllConfig);

Object.assign({}, webpackDllDevConfig, {
  mode: 'development',
  devtool: 'source-map',
});

module.exports = webpackDllDevConfig;
