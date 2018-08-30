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
                        微信群
                        <span>({{currentContacts.length}})</span>
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
                      连接状态： {{this.connected ? '已连接' : '未连接'}}
                    </div>
                    <canvas id="loginCanvas" ref="loginCanvas"></canvas>
                  </section>
                  <section v-show="currentTab === 'message'">
                    <batch-message v-model="messages"></batch-message>
                  </section>
                  <section v-show="currentTab === 'group'">
                    <div class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
                      <div class="ichat-messages-wrapper">
                        <div class="chat-sessions" v-if="currentContacts.length">
                          <el-table :data="currentContacts" border stripe
                                    @selection-change="handleSelectionChange"
                                    height="calc(100vh - 60px)" style="width: 100%;">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="nickName" label="名称">
                              <template slot-scope="scope">
                                <span class="nickname">{{scope.row.nickName}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="lastTime" label="最近聊天时间">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.lastTime}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="joinTime" label="加入时间">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.joinTime}}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div class="empty-message" v-else>
                          没有联系人
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
  import { Loading } from 'element-ui';
  import { mapState } from 'vuex';
  import QRCode from 'qrcode';
  import WechatPadService from '../service/wechat-pad-service';
  import WechatService from '../service/wechat-service';
  import Message from './message';
  import BatchMessage from './batch/batch-message';
  export default {
    name: 'login-page',
    components: { Message, BatchMessage },
    computed: {
      ...mapState({
        allContacts: state => state.Contacts.contacts,
        contactsHashObject: state => state.Contacts.contactsHashObject,
        contactsUserNameMapObject: state => state.Contacts.contactsUserNameMapObject,
      }),
      currentContacts() {
        const groupSession = [];
        this.allChatSessions.forEach((chatSession) => {
          let destination = chatSession.name.substring('Chat_'.length, chatSession.name.length);
          if (this.contactsHashObject[destination]) {
            destination = this.contactsHashObject[destination];
            const { isShieldUser, isSpUser, isRoomContact } = WechatService;
            const userName = destination.userName;
            if (!isShieldUser(userName) && !isSpUser(userName) && isRoomContact(userName)) {
              const chatSessionInfo = {
                userName,
                nickName: WechatService.parseName(destination.dbContactRemark),
                lastTime: WechatService.formatTime(chatSession.CreateTime),
                joinTime: WechatService.formatTime(chatSession.JoinTime),
              };
              groupSession.push(chatSessionInfo);
            }
          }
        });
        return groupSession;
      },
      qrcodeUrl() {
        return this.loginInformation.qrcodeUrl;
      },
    },
    data() {
      return {
        allChatSessions: [],
        loginInformation: WechatPadService.loginInformation,
        currentTab: 'login',
        multipleSelection: [],
        messages: [],
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
        this.sendRealMessage();
      },
      async sendRealMessage() {
        this.multipleSelection.forEach(async (user) => {
          this.messages.forEach(async (message) => {
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
          });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    },
    mounted() {
      if (!WechatService.getSelectedBackupPath()) { // 如果没有选择目录
        this.$router.push('dashboard');
        return;
      }
      const loadingInstance = Loading.service({ fullscreen: true, target: '#wrapper' });
      WechatService.getMessageAndContactFileID()
        .then(({ messageFileID }) => {
          WechatService.getUserChatSessionContacts(messageFileID)
            .then((chatSessions) => {
              this.allChatSessions = chatSessions;
              loadingInstance.close();
            }, (error) => {
              this.$message.error(error);
              loadingInstance.close();
            });
        });
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