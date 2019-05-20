# 微信聊天记录查看器

> 仿照微信桌面端界面，制作的微信聊天记录查看、分析工具。

## 运行时截图

可以进行聊天记录历史查看。

![微信聊天记录查看、分析工具](/src/renderer/assets/screenshot.png)

支持联系人搜索。

聊天记录按照时间倒序——最新的聊天记录、排在最前面，默认查看最近7天的消息记录。

## PS: 有的同学发现：在已经备份了iTunes备份之后，但是打开软件显示“没有发现itunes手机备份”，为什么出现这种情况呢？

这是因为Mac系统下的Rootless机制导致的——在Rootless机制下，即使你在root权限下，也不能随心所欲的读写所有路径——而“iTunes备份存储目录”（Library/Application Support/MobileSync/Backup），刚好变成了这样的目录。

我目前的解决办法——关闭Rootless（如果有其他解决办法，欢迎跟帖）：

重启按住 Command+R，进入恢复模式，打开Terminal。

键入命令 csrutil disable

reboot

如果重新打开，用同样的方法输入csrutil enable。

大家如果有其他解决办法，[欢迎提供哈](https://github.com/wongjohn/wechat-analyser/issues/1)。

#### Build Setup

``` bash
# install dependencies, 最好使用yarn install，本人试过: "cnpm install"在这里有问题，npm install则太慢
yarn install

# serve with hot reload at localhost:9080
npm start

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
