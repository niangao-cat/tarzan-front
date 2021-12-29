module.exports = {
  presets: [['react-app', { absoluteRuntime: false }]],
  plugins: [
    [
      'import',
      {
        libraryName: 'hzero-ui',
        libraryDirectory: 'es',
        style: true,
      },
      'ant',
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
        "style": true
      },
      "c7n-pro"
    ],
    'lodash',
    [
      '@babel/plugin-proposal-decorators', // 启用装饰器
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          components: 'hzero-front/lib/components',
          utils: 'hzero-front/lib/utils',
          services: 'hzero-front/lib/services',
          '@': './src',
        },
      },
    ],
  ],
};
