<template>
  <main class="main-c contacts-page-main">
    <section>
      <div class="ichat">
        <div class="ichat-content">
          <div class="ichat-content-w">
            <div class="ichat-chat">
              <div class="ichat-detail">
                <div class="ichat-detail-h-w">
                  <div class="ichat-header">
                    <div class="ichat-header-user">
                      <h2>
                        微信群消息群发
                      </h2>
                      <div class="operations">
                        <el-button icon="el-icon-check" type="primary" @click="switchTo('login')">登录</el-button>
                        <el-button icon="el-icon-message" type="primary" @click="switchTo('message')">添加消息</el-button>
                        <el-button icon="el-icon-star-off" type="primary" @click="switchTo('group')">选择群</el-button>
                        <el-button icon="el-icon-download" type="danger" @click="sendMessage">发送</el-button>
                      </div>
                    </div>
                    <div class="ichat-header-menu">
                      <a><i class="icon iui-icon iui-icon-more"></i></a>
                    </div>
                  </div>
                </div>
                <div class="ichat-detail-c">
                  <section v-show="currentTab === 'login'">
                    <div>
                      第三方微信iPad协议服务连接状态： {{this.connected ? '已连接' : '未连接'}}
                    </div>
                    <canvas id="loginCanvas" ref="loginCanvas"></canvas>
                  </section>
                  <section v-show="currentTab === 'message'">
                    <batch-message v-model="messages"></batch-message>
                  </section>
                  <section v-show="currentTab === 'group'">
                    <chat-rooms v-model="multipleSelection"></chat-rooms>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <el-dialog title="添加超链接消息" :visible.sync="dialogVisible" width="500px" >
      <div class="">
        消息之间延迟
        <el-slider v-model="delaySeconds" show-input :max="600"></el-slider>
      </div>
      <div class="ichat-message" v-if="currentUser && message">
        <div class="ichat-message-content withhover">
          <div class="ichat-message-content-h">
            <h4>向微信号—— "{{currentUser.nickName}}" ——发送消息</h4>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="width: 100px;margin: 0 auto;">
        <el-button v-if="userIndex === multipleSelection.length" icon="el-icon-check" type="primary" @click="dialogVisible = false">完成</el-button>
        <el-button v-else icon="el-icon-close" type="danger" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script>
  import QRCode from 'qrcode';
  import WechatPadService from '../service/wechat-pad-service';
  import WechatService from '../service/wechat-service';
  import Message from './message';
  import BatchMessage from './batch/batch-message';
  import ChatRooms from './batch/chat-rooms';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  export default {
    name: 'login-page',
    components: { Message, BatchMessage, ChatRooms },
    computed: {
      qrcodeUrl() {
        return this.loginInformation.qrcodeUrl;
      },
    },
    data() {
      return {
        loginInformation: WechatPadService.loginInformation,
        currentTab: 'login',
        multipleSelection: [],
        messages: [],
        dialogVisible: false,
        delaySeconds: 6,
        currentUser: null,
        message: null,
        userIndex: 0,
      };
    },
    watch: {
      qrcodeUrl(newValue) {
        if (newValue) {
          this.$nextTick(() => {
            QRCode.toCanvas(this.$refs.loginCanvas, newValue, (error) => {
              if (error) {
                console.error(error); //eslint-disable-line
              }
            });
          });
        }
      },
    },
    methods: {
      connected() {
        return WechatPadService.isConnected();
      },
      switchTo(tabName) {
        this.currentTab = tabName;
      },
      sendMessage() {
        if (!this.multipleSelection.length) {
          this.$message.error('请选择要发送的群');
          return;
        }
        if (!this.messages.length) {
          this.$message.error('请选择要发送的消息');
          return;
        }
        this.dialogVisible = true;
        this.userIndex = 0;
        this.sendRealMessage();
      },
      async sendRealMessage() {
        const user = this.multipleSelection[this.userIndex];
        if (user && this.dialogVisible) {
          this.currentUser = user;
          this.messages.forEach(async (message) => {
            this.message = message;
            switch (message.mType) {
              case 1: // 文本
                await WechatPadService.getWx().sendMsg(user.userName,
                  message.content || message.description);
                break;
              case 3: // 图片
                await WechatPadService.getWx().sendImage(user.userName, message.data);
                break;
              case 49: // APP消息
                await WechatPadService.getWx().sendAppMsg(user.userName, message.content);
                break;
              default:
              // Do nothing
            }
            await sleep(1000);
          });
          this.userIndex += 1;
          if (this.userIndex < this.multipleSelection.length) {
            setTimeout(this.sendRealMessage.bind(this), this.delaySeconds * 1000);
          }
        }
      },
    },
    mounted() {
      if (!WechatService.getSelectedBackupPath()) { // 如果没有选择目录
        this.$router.push('dashboard');
        return;
      }
      WechatPadService.init();
      if (WechatPadService.getQrcodeUrl()) {
        this.$nextTick(() => {
          QRCode.toCanvas(this.$refs.loginCanvas, WechatPadService.getQrcodeUrl(), (error) => {
            if (error) {
              console.error(error); //eslint-disable-line
            }
          });
        });
      }
    },
  };
</script>

<style>
  .contacts-page-main .ichat-detail {
    margin-left: 0;
  }
  .contacts-page-main .detail-description {
    white-space: pre-line;
  }
  #loginCanvas {
    width: 200px;
    height: 200px;
    position: absolute;
    left: 50%;
    margin-left: -100px;
    top: 50%;
    margin-top: -100px;
  }
</style>