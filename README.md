# nodejs-getting-started
钉钉酷应用体验项目Nodejs版本。
## 功能介绍
通过该demo案例可以学习酷应用在群聊场景的具体实现：
- 通过免登码获取用户信息；
- 通过机器人向群里发送普通消息；
- 通过机器人向群里发送互动卡片；
- 通过机器人向群里发送吊顶卡片；
## 使用
### 项目介绍
该项目分服务端和前端部分：
> 服务端侧采用[midway(v3)](https://midwayjs.org/docs/intro)框架，环境安装及midway相关开发可查看[文档](https://midwayjs.org/docs/intro)。

> 前端项目在跟目标 /website下，前端采用 [umi v3](https://v3.umijs.org/zh-CN/docs/getting-started)框架. 

前后端运行方式如下：
1. 前端项目在/website目录里进行构建：npm run build, 输出资源文件到website/dist目录；
2. 服务端侧开启静态服务功能，并指向前端构建目录website/dist 目录。
```
  staticFile: {
    dirs: {
      default: {
        prefix: '/',
        dir: 'website/dist',
      },
    }
  },
```
3. 服务端渲染模板 view/index.html里引用前端资源。

### 配置
案例中调用OpenApi需要appKey、appSecret等的入参信息需要通过钉钉自建应用来获取，获取应用配置信息步骤如下：
1. 登录[钉钉开发者后台](https://open-dev.dingtalk.com/#/);
2. 选择或新建企业自建应用，进入应用详情-基本信息-应用信息页面获取appKey、appSecret；
3. 进入应用详情 - 消息推送页面，配置机器人并拷贝RobotCode;
4. 进入应用详情 - 酷应用扩展，新建”扩展到群会话“酷应用，并拷贝酷应用编码；

所有配置信息放置在midway项目src/config/config.default.ts文件内：
```
  demo : {
    appKey: 'dingexxx',
    appSecret:'xxx',
    robotCode:'dingexxx',
    coolAppCode:'COOLAPP-xxx'
  }
```

### 启动项目&体验
```bash
$ npm i
$ npm run dev
$ npm run test
```

