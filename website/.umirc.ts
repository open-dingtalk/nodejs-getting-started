import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: 'static',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  history: {
    type: 'hash',
  },
  chainWebpack: (memo, { env, webpack, createCSSRule }) => {
    memo.output.filename(`main.js`);

    memo.plugin('extract-css').tap(() => [
      {
        filename: `style.css`,
        ignoreOrder: true,
      },
    ]);
  },
  title: '酷应用getting started',
});
