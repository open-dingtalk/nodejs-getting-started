![GitHub issues](https://img.shields.io/github/issues/open-dingtalk/nodejs-getting-started)
![GitHub](https://img.shields.io/github/license/open-dingtalk/nodejs-getting-started)

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
2. 服务端侧开启静态服务功能，并指向前端构建目录website/static 目录。
```
  staticFile: {
    dirs: {
      default: {
        prefix: '/',
        dir: 'website/static',
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
4. 进入应用详情 - 酷应用，新建”扩展到群会话“酷应用，并拷贝酷应用编码；
5. 通过开发者后台开放能力 - 互动卡片，获取对应于卡片模板ID；

所有配置信息放置在midway项目src/config/coolapp.config.json文件内：
```
  {
    "appKey": "dingrtxxxxxxx",
    "appSecret": "JfYpkbxxxxxxxxx",
    "robotCode": "dingxxxxxxxxx",
    "coolAppCode": "COOLAPP-1-xxxxxxxxx",
    "messageCardTemplateId001": "dde980a2-fb8a-446e-9b72-70c45317b076",
    "topCardTemplateId001": "a57e7f32-b3b1-4ef2-8c04-dce281cf3b7c"
}
```

### 5分钟快速体验，入口在[钉钉开发者后台](https://open-dev.dingtalk.com/#/) - 首页。
1. 根据官网引导创建酷应用；
2. 下载项目，进入项目根目录，通过以下命令启动项目：
```bash
$ npm i
$ npm run website:build
$ npm run dev
```
3. 回到开发者后台，按引导下一步进入测试群，快捷入口"点击体验"即可打开本地启动的服务页面: http://127.0.0.1:7001/index.html

注意：以上模式采用的是nodejs启动的web服务，加载前端资源渲染的页面，所以更新前端页面后，需要重新编译（npm run website:build）后才会在体验页面中生效。

在群场景中使用酷应用时，向群里推送户动卡片需要获取到当前组织corpId和群id(openConversationId)，此时可以通过群快捷入口的url配置占位符的方式拿到，如http://127.0.0.1:7001/index.html?openConversationId=$DOUBLE_ENCCID$&corpId=$CORPID$#/ ; 前端通过解析url query及可拿到corpId和openConversationId。

### 本地开发调试 (前端devserver模式)
前端项目放置在website目录，前端采用umi框架，本地开发页面时，可基于框架新增更新页面。

本地开发时可以采用前端devserver + nodejs服务提供接口的方式来开发调试，既能享用前端热更新，服务端nodejs修改也可实时更新。 加上vscode 的JavaScript Debug Terminal功能，可以实现前后端一起调试：
1. 先启动nodejs 服务；
```bash
$ npm i
$ npm run debug
```
服务地址：http://127.0.0.1:3000

2. 启动前端本地服务
```bash
$ cd website
$ yarn 或 npm i
$ yarn start 或 npm start
```
前端本地服务地址： http://127.0.0.1:7001

3. 开发者后台创建(群场景)酷应用 - 拷贝酷应用配置信息到src/config/cool.config.json - 配置快捷入口链接 - 体验酷应用，通过群快捷入口打开链接。


