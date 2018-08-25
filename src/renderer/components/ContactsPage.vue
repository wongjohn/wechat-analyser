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
                        <el-button icon="el-icon-download" type="primary" @click="exportContacts" :disabled="!currentContacts.length">导出当前列表</el-button>
                      </div>
                    </div>
                    <div class="ichat-header-menu">
                      <a><i class="icon iui-icon iui-icon-more"></i></a>
                    </div>
                  </div>
                </div>
                <div class="ichat-detail-c">
                  <section>
                    <div class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
                      <div class="ichat-messages-wrapper">
                        <div class="chat-sessions" v-if="currentContacts.length">
                          <el-table :data="currentContacts" border stripe
                                    height="calc(100vh - 60px)" style="width: 100%;">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <!--<el-table-column prop="image" label="头像">-->
                              <!--<template slot-scope="scope">-->
                                <!--<div class="img group">-->
                                  <!--<img :src="scope.row.image">-->
                                <!--</div>-->
                              <!--</template>-->
                            <!--</el-table-column>-->
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
                            <el-table-column prop="messager0" label="印象发送人">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.messager0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="messageTime0" label="印象发送时间">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.messageTime0}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="message0" label="印象消息">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.message0}}</span>
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
  import WechatService from '../service/wechat-service';
  import Message from './message';
  import { REG_EXP } from '../constants';
  export default {
    name: 'contacts-page',
    components: { Message },
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
            const item = destination.userName;
            if (!isShieldUser(item) && !isSpUser(item) && isRoomContact(item)) {
              const chatSessionInfo = {
                image: WechatService.parseImage(destination.dbContactHeadImage),
                nickName: WechatService.parseName(destination.dbContactRemark),
                lastTime: WechatService.formatTime(chatSession.CreateTime),
                joinTime: WechatService.formatTime(chatSession.JoinTime),
              };
              [0, 1, 2].forEach((index) => {
                let messager;
                let message;
                if (chatSession[`Des${index}`] && chatSession[`Message${index}`] && REG_EXP.test(chatSession[`Message${index}`])) {
                  const [, userName] = REG_EXP.exec(chatSession[`Message${index}`]);
                  if (this.contactsUserNameMapObject[userName]) {
                    messager = WechatService.parseName(
                      this.contactsUserNameMapObject[userName].dbContactRemark);
                    message = chatSession[`Message${index}`].substring(userName.length + 2,
                      chatSession[`Message${index}`].length);
                  }
                } else {
                  message = chatSession[`Message${index}`];
                }
                chatSessionInfo[`messager${index}`] = messager;
                chatSessionInfo[`messageTime${index}`] = chatSession[`MessageTime${index}`] &&
                  WechatService.formatTime(chatSession[`MessageTime${index}`]);
                chatSessionInfo[`message${index}`] = message;
              });
              groupSession.push(chatSessionInfo);
            }
          }
        });
        return groupSession;
      },
    },
    data() {
      return {
        allChatSessions: [],
      };
    },
    methods: {
      exportContacts() {
        WechatService.exportContacts(this.currentContacts)
          .then(() => {
            this.$message.success('导出当前联系人成功');
          }, (error) => {
            this.$message.error(error);
          });
      },
    },
    mounted() {
      if (!WechatService.getSelectedBackupPath()) { // 如果没有选择目录
        this.$router.push('dashboard');
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
</style>