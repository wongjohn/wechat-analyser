const Padchat = require('padchat-sdk');
const fs = require('fs');
const { Message } = require('element-ui');

const autoData = {
  wxData: '',
  token: '',
};
// let server = ''
// let server = 'ws://127.0.0.1:7777'
const server = 'ws://52.80.34.207:7777';
const logger = {
  info: Message.info,
  warn: Message.warning,
  debug: Message.info,
  error: Message.error,
};

try {
  const tmpBuf = fs.readFileSync('./config.json');
  const data = JSON.parse(String(tmpBuf));
  autoData.wxData = data.wxData;
  autoData.token = data.token;
  logger.info(`载入设备参数与自动登陆数据：${autoData}`);
} catch (e) {
  logger.warn('没有在本地发现设备登录参数或解析数据失败！如首次登录请忽略！');
}

let disconnectCount = 0; // 断开计数
let connected = false; // 成功连接标志
const loginInformation = { qrcodeUrl: '' }; // 需要跟其他地方共享消息的
let isInited = false;
let wx = null;
function init() {
  if (isInited) {
    return;
  }
  isInited = true;

  wx = new Padchat(server);
  logger.info(`当前连接接口服务器为：${server}`);

  wx
    .on('close', (code, msg) => {
      logger.info(`Websocket已关闭！code: ${code} - ${msg}`);
      // 根据是否成功连接过判断本次是未能连接成功还是与服务器连接中断
      if (connected) {
        connected = false;
        disconnectCount += 1;
        logger.info(`第 ${disconnectCount} 次与服务器连接断开！现在将重试连接服务器。`);
      } else {
        logger.debug('未能连接服务器！将重试连接服务器。');
      }
      // 重新启动websocket连接
      wx.start();
    })
    .on('open', async () => {
      let ret;
      logger.info('连接成功!');
      connected = true;

      // 非首次登录时最好使用以前成功登录时使用的设备参数，
      // 否则可能会被tx服务器怀疑账号被盗，导致手机端被登出
      ret = await wx.init();
      if (!ret.success) {
        logger.error('新建任务失败！', ret);
        return;
      }
      logger.info('新建任务成功, json: ', ret);

      // 先尝试使用断线重连方式登陆
      if (autoData.token) {
        ret = await wx.login('token', autoData);
        if (ret.success) {
          logger.info('断线重连请求成功！', ret);
          return;
        }
        logger.warn('断线重连请求失败！', ret);

        ret = await wx.login('request', autoData);
        if (ret.success) {
          logger.info('自动登录请求成功！', ret);
          return;
        }
        logger.warn('自动登录请求失败！', ret);
      }

      ret = await wx.login('qrcode');
      if (!ret.success) {
        logger.error('使用qrcode登录模式失败！', ret);
        return;
      }
      logger.info('使用qrcode登录模式！');
    })
    .on('qrcode', (data) => {
      // 如果存在url，则直接在终端中生成二维码并显示
      if (data.url) {
        logger.info(`登陆二维码内容为: "${data.url}"，请使用微信扫描下方二维码登陆!`);
        loginInformation.qrcodeUrl = data.url;
      } else {
        logger.error('未能获得登陆二维码!');
      }
    })
    .on('scan', (data) => {
      switch (data.status) {
        case 0:
          console.info('等待扫码...', data); // eslint-disable-line
          break;
        case 1:
          // {
          //   status     : 1,
          //   expiredTime: 239,
          //   headUrl    : 'http://wx.qlogo.cn/mmhead/ver_1/xxxxxxx/0', //头像url
          //   nickName   : '木匠' //昵称
          // }
          logger.info('已扫码，请在手机端确认登陆...', data);
          break;
        case 2:
          // {
          //   password   : '***hide***',   // 可忽略
          //   status     : 2,
          //   expiredTime: 238,
          //   headUrl    : 'http://wx.qlogo.cn/mmhead/ver_1/xxxxxxx/0',  //头像url
          //   subStatus  : 0               // 登陆操作状态码
          //   以下字段仅在登录成功时有效
          //   external   : '1',
          //   email      : '',
          //   uin        : 149806460,      // 微信账号uin，全局唯一
          //   deviceType : 'android',      // 登陆的主设备类型
          //   nickName   : '木匠'          //昵称
          //   userName   : 'wxid_xxxxxx',  // 微信账号id，全局唯一
          //   phoneNumber: '18012345678',  // 微信账号绑定的手机号
          // }
          switch (data.subStatus) {
            case 0:
              logger.info('扫码成功！登陆成功！', data);
              break;
            case 1:
              logger.info('扫码成功！登陆失败！', data);
              break;
            default:
              logger.info('扫码成功！未知状态码！', data);
              break;
          }
          break;
        // 如果等待登陆超时或手机上点击了取消登陆，需要重新调用登陆
        case 3:
          logger.info('二维码已过期！请重新调用登陆接口！', data);
          break;
        case 4:
          logger.info('手机端已取消登陆！请重新调用登陆接口！', data);
          break;
        default:
          logger.warn('未知登陆状态！请重新调用登陆接口！', data);
          break;
      }
    })
    .on('login', async () => {
      logger.info('微信账号登陆成功！');
      let ret;

      ret = await wx.getMyInfo();
      logger.info('当前账号信息：', ret.data);

      // 主动同步通讯录
      await wx.syncContact();

      if (!autoData.wxData) {
        // 如果已经存在设备参数，可不再获取
        ret = await wx.getWxData();
        if (!ret.success) {
          logger.warn('获取设备参数未成功！ json:', ret);
          return;
        }
        logger.info('获取设备参数成功, json: ', ret);
        Object.assign(autoData, { wxData: ret.data.wxData });
      }

      ret = await wx.getLoginToken();
      if (!ret.success) {
        logger.warn('获取自动登陆数据未成功！ json:', ret);
        return;
      }
      logger.info('获取自动登陆数据成功, json: ', ret);
      Object.assign(autoData, { token: ret.data.token });

      // NOTE: 这里将设备参数保存到本地，以后再次登录此账号时提供相同参数
      fs.writeFileSync('./config.json', JSON.stringify(autoData, null, 2));
      logger.info('设备参数已写入到 ./config.json文件');
    })
    .on('logout', ({ msg }) => {
      logger.info('微信账号已退出！', msg);
    })
    .on('over', ({ msg }) => {
      logger.info('任务实例已关闭！', msg);
    })
    .on('loaded', async () => {
      logger.info('通讯录同步完毕！');

      // 主动触发同步消息
      await wx.syncMsg();

      const ret = await wx.sendMsg('filehelper', '你登录了！');
      logger.info('发送信息结果：', ret);
    })
    .on('sns', (data, msg) => {
      logger.info('收到朋友圈事件！请查看朋友圈新消息哦！', msg);
    })
    .on('push', async (data) => {
      // 消息类型 data.mType
      // 1  文字消息
      // 2  好友信息推送，包含好友，群，公众号信息
      // 3  收到图片消息
      // 34  语音消息
      // 35  用户头像buf
      // 37  收到好友请求消息
      // 42  名片消息
      // 43  视频消息
      // 47  表情消息
      // 48  定位消息
      // 49  APP消息(文件 或者 链接 H5)
      // 50  语音通话
      // 51  状态通知（如打开与好友/群的聊天界面）
      // 52  语音通话通知
      // 53  语音通话邀请
      // 62  小视频
      // 2000  转账消息
      // 2001  收到红包消息
      // 3000  群邀请
      // 9999  系统通知
      // 10000  微信通知信息. 微信群信息变更通知，多为群名修改，进群，离群信息，不包含群内聊天信息
      // 10002  撤回消息
      // --------------------------------
      // 注意，如果是来自微信群的消息，data.content字段中包含发言人的wxid及其发言内容，需要自行提取
      // 各类复杂消息，data.content中是xml格式的文本内容，需要自行从中提取各类数据。（如好友请求）
      if ((data.mType !== 2) && !(data.mType === 10002 && data.fromUser === 'weixin')) {
        // 输出除联系人以外的推送信息
        logger.info(`push: ${JSON.stringify(data)}`);
      }
      let rawFile;
      switch (data.mType) {
        case 2:
          logger.info(`收到推送联系人：${data.userName} - ${data.nickName}`);
          break;

        case 3:
          logger.info(`收到来自 ${data.fromUser} 的图片消息，包含图片数据：${!!data.data}，xml内容：\n ${data.content}`);
          rawFile = data.data || null;
          logger.info(`图片缩略图数据base64尺寸：${rawFile.length}`);
          await wx.getMsgImage(data)
            .then((ret) => {
              rawFile = ret.data.image || '';
              data.data = rawFile;
              logger.info(`获取消息原始图片结果：${ret.success}, 获得图片base64尺寸：${rawFile.length}`);
            });
          logger.info(`图片数据base64尺寸：${rawFile.length}`);
          // await wx.sendImage('filehelper', rawFile)
          //   .then((ret) => {
          //     console.info('转发图片信息给 %s 结果：', 'filehelper', ret);
          //   })
          //   .catch((e) => {
          //     console.warn('转发图片信息异常:', e.message);
          //   });
          break;

        case 43:
          logger.info('收到来自 %s 的视频消息，包含视频数据：%s，xml内容：\n%s', data.fromUser, !!data.data, data.content);
          rawFile = data.data || null;
          if (!rawFile) {
            await wx.getMsgVideo(data)
              .then((ret) => {
                rawFile = ret.data.video || '';
                logger.info('获取消息原始视频结果：%s, 获得视频base64尺寸：%d', ret.success, rawFile.length);
              });
          }
          logger.info('视频数据base64尺寸：%d', rawFile.length);
          break;

        case 1:
          if (data.fromUser === 'newsapp') { // 腾讯新闻发的信息太长
            break;
          }
          logger.info(`收到来自 ${data.fromUser} 的文本消息：${data.description || data.content}`);
          break;

        case 34:
          logger.info('收到来自 %s 的语音消息，包含语音数据：%s，xml内容：\n%s', data.fromUser, !!data.data, data.content);
          // 超过30Kb的语音数据不会包含在推送信息中，需要主动拉取
          rawFile = data.data || null;
          if (!rawFile) {
            // BUG: 超过60Kb的语音数据，只能拉取到60Kb，也就是说大约36~40秒以上的语音会丢失后边部分语音内容
            await wx.getMsgVoice(data)
              .then((ret) => {
                rawFile = ret.data.voice || '';
                logger.info('获取消息原始语音结果：%s, 获得语音base64尺寸：%d，拉取到数据尺寸：%d', ret.success, rawFile.length, ret.data.size);
              });
          }
          logger.info('语音数据base64尺寸：%d', rawFile.length);
          if (rawFile.length > 0) {
            let match = data.content.match(/length="(\d+)"/) || [];
            const length = match[1] || 0;
            match = data.content.match(/voicelength="(\d+)"/) || [];
            const ms = match[1] || 0;
            logger.info('语音数据语音长度：%d ms，xml内记录尺寸：%d', ms, length);

            // await wx.sendVoice('filehelper', rawFile, ms)
            //   .then((ret) => {
            //     console.info('转发语音信息给 %s 结果：', 'filehelper', ret);
            //   })
            //   .catch((e) => {
            //     console.warn('转发语音信息异常:', e.message);
            //   });
          }
          break;

        case 49:
          logger.info(`收到一条来自 ${data.fromUser} 的appmsg富媒体消息：${data}`);
          break;

        case 10002:
          if (data.fromUser === 'weixin') {
            // 每次登陆，会收到一条系统垃圾推送，过滤掉
            break;
          }
          logger.info(`用户 ${data.fromUser} 撤回了一条消息：${data}`);
          break;

        default:
          logger.info(`收到推送消息：${data}`);
          break;
      }
    })
    .on('error', (e) => {
      logger.error(`ws 错误:${e.message}`);
    })
    .on('warn', (e) => {
      logger.error(`任务出现错误: ${e.message}`);
    })
    .on('cmdRet', (cmd, ret) => { // eslint-disable-line
      // 捕捉接口操作结果，补充接口文档用
    });
}

export default {
  getWx() {
    return wx;
  },
  init,
  loginInformation,
  getQrcodeUrl() {
    return loginInformation.qrcodeUrl;
  },
  isConnected() {
    return connected;
  },
  getDisconnectCount() {
    return disconnectCount;
  },
};
