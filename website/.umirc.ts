import { defineConfig } from 'umi';

export default defineConfig({
  outputPath:'static',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  history: {
    type: 'hash',
  },
  title:'酷应用getting started'
});
