<template>
  <main class="main-c">
    <section>
      <div class="ichat">
        <div class="ichat-content">
          <div class="ichat-content-w">
            <div class="ichat-chat">
              <div class="ichat-chat-conversation">
                <div class="ichat-chat-conversation-search">
                  <div tabindex="2" class="chat-search-w">
                    <i class="iui-icon iui-icon-search"></i>
                    <el-dropdown
                      class="suggestion-input"
                      trigger="click"
                      @command="handleCommand"
                      ref="dropDownMenu"
                      placement="bottom-start"
                    >
                      <input type="text" placeholder="讨论组、联系人" v-model="keyword" @input="queryContacts">
                      <el-dropdown-menu
                        class="suggestion-menus"
                        :class="{'no-suggestion': !contacts.length}"
                        slot="dropdown">
                        <el-dropdown-item disabled>联系人</el-dropdown-item>
                        <el-dropdown-item
                          v-for="item in contacts"
                          :key="item.name"
                          v-if="contacts.length"
                          :command="item">
                          {{ getDisplayName(item) }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <a class="add-group"></a>
                </div>
                <div class="ichat-chat-conversation-w">
                  <div class="ichat-chat-conversation-c">
                    <div class="ichat-conversation">
                      <ul v-infinite-scroll="loadChatSessionData" infinite-scroll-disabled="false"
                          infinite-scroll-distance="100">
                        <li v-for="chatSession in chatSessions"
                            :key="chatSession.name"
                            :class="{'active': selectedChatSessionInfo.sessionName === chatSession.name}"
                            @click="viewChatsOf(chatSession.name)"
                        >
                          <div class="img group">
                            <img :src="getHeadImage(chatSession.name)">
                          </div>
                          <div class="txt">
                            <h2>{{getNickName(chatSession.name)}}</h2>
                            <div class="p">
                              <p>{{formatTime(chatSession.CreateTime)}}</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ichat-detail">
                <div class="ichat-detail-h-w">
                  <div class="ichat-header">
                    <div class="ichat-header-user">
                      <h2 :title="selectedChatSessionInfo.displayName">
                        {{selectedChatSessionInfo.displayName}}
                        <span>({{selectedChatSessionInfo.length}})</span>
                      </h2>
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
                        <div class="empty-message">
                          没有消息
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
  import WechatService from '../service/wechat-service';
  import Message from './message';
  const STEP = 20; // 一次加载20条
  export default {
    name: 'contacts-page',
    components: { Message },
    data() {
      return {
        chatSessions: [],
        chatSessionCounter: 0,
        allContacts: [],
        allChatSessions: [],
        allChats: [],
        chats: [],
        contactsHashObject: {},
        selectedChatSessionInfo: {
          sessionName: null,
          displayName: '微信聊天记录',
          headImage: '',
          length: 0,
        },
        keyword: '',
        contacts: [],
        debounceId: '',
      };
    },
    methods: {
      loadChatSessionData() {
        this.chatSessionCounter = this.chatSessionCounter + 1;
        const length = Math.min(this.chatSessionCounter * STEP, this.allChatSessions.length);
        this.chatSessions = this.allChatSessions.slice(0, length);
      },
      viewChatsOf(chatSessionName) {
        if (chatSessionName === this.selectedChatSessionInfo.sessionName) {
          return; // 不重新加载已选中的聊天室信息
        }
        this.chats = []; // 切换时，初始化
        this.allChats = [];
        this.selectedChatSessionInfo = {
          sessionName: chatSessionName,
          displayName: this.getNickName(chatSessionName),
          headImage: this.getHeadImage(chatSessionName),
          length: 0,
        };
        const loadingInstance = Loading.service({ fullscreen: true, target: '#wrapper .ichat-detail .ichat-detail-c' });
        WechatService.loadChatsOf(chatSessionName)
          .then((chats) => {
            this.allChats = chats;
            const sevenDaysAgo = WechatService.sevenDaysAgo();
            this.chats = chats.filter(chat => chat.CreateTime >= sevenDaysAgo); // 7天前
            this.selectedChatSessionInfo.length = chats.length;
            loadingInstance.close();
            setTimeout(() => {
              this.$refs['ichatMessagesRef'].scrollTop = document.querySelector('.ichat-messages-wrapper').clientHeight; // eslint-disable-line
            }, 500);
          }, (error) => {
            this.$message.error(error);
            loadingInstance.close();
          });
      },
      getNickName(chatRoomName) {
        let destination = chatRoomName.substring('Chat_'.length, chatRoomName.length);
        if (this.contactsHashObject[destination]) {
          destination = this.contactsHashObject[destination];
          return WechatService.parseName(destination.dbContactRemark);
        }
        return destination;
      },
      parseName(remark) {
        return WechatService.parseName(remark);
      },
      getHeadImage(chatRoomName) {
        let destination = chatRoomName.substring('Chat_'.length, chatRoomName.length);
        if (this.contactsHashObject[destination]) {
          destination = this.contactsHashObject[destination];
          return WechatService.parseImage(destination.dbContactHeadImage);
        }
        return destination;
      },
      queryContacts() {
        if (!this.keyword) {
          this.contacts = [];
          return; // Do nothing
        }
        if (this.debounceId) {
          clearTimeout(this.debounceId);
        }
        this.debounceId = setTimeout(() => {
          const loadingInstance = Loading.service({ fullscreen: true, target: '.suggestion-input' });
          WechatService.queryContacts(this.keyword)
            .then((contacts) => {
              this.contacts = contacts;
              loadingInstance.close();
            }, (error) => {
              this.$message.error(error);
              loadingInstance.close();
            });
        }, 500);
      },
      getDisplayName(contact) {
        return WechatService.parseName(contact.dbContactRemark);
      },
      handleCommand(contact) {
        this.viewChatsOf(`Chat_${WechatService.md5(contact.userName)}`);
      },
      formatTime: WechatService.formatTime,
    },
    mounted() {
      if (!WechatService.getSelectedBackupPath()) { // 如果没有选择目录
        this.$router.push('dashboard');
        return;
      }
      const loadingInstance = Loading.service({ fullscreen: true, target: '#wrapper .ichat-chat-conversation' });
      WechatService.getMessageAndContactFileID()
        .then(({ messageFileID, contactFileID }) => {
          WechatService.getUserContacts(contactFileID)
            .then((contacts) => {
              this.allContacts = contacts || [];
              this.contactsHashObject = WechatService.getContactsHashObject();
              this.$store.commit('INIT_CONTACTS', {
                contacts: this.allContacts,
                contactsHashObject: this.contactsHashObject,
                contactsUserNameMapObject: WechatService.getContactsUserNameMapObject(),
              });
            });
          WechatService.getUserChatSessions(messageFileID)
            .then((chatSessions) => {
              this.allChatSessions = chatSessions;
              this.loadChatSessionData(); // 数据加载有些迟，在这里主动调一次
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

</style>