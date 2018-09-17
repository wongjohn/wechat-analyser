<template>
  <main class="main-c contacts-page-main" id="searchPage">
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
                        不活跃群
                        <span>({{currentContacts.length}})</span>
                      </h2>
                      <div class="operations">
                        <el-popover
                          placement="top-start"
                          width="400"
                          trigger="hover"
                          >
                          <div style="max-height: 400px; overflow-y: auto;">
                            <el-dropdown
                              class="suggestion-input"
                              trigger="click"
                              @command="handleCommand"
                              ref="dropDownMenu"
                              placement="bottom-start"
                            >
                              <el-input placeholder="讨论组、联系人" v-model="keyword" @input="queryContacts"/>
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
                            <el-button type="primary" @click="getUserChatSessionInActiveContacts">重新查询</el-button>
                            <el-table :data="ignoreContacts">
                              <el-table-column
                                prop="nickName"
                                label="名称"
                                width="120">
                              </el-table-column>
                              <el-table-column
                                prop="userName"
                                label="用户ID"
                                width="180">
                              </el-table-column>
                              <el-table-column label="操作">
                                <template slot-scope="scope">
                                  <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                          <el-button size="small" slot="reference">忽略账号</el-button>
                        </el-popover>
                        <el-switch
                          @change="getUserChatSessionInActiveContacts"
                          v-model="hasOrange"
                          active-text="包含忽略账号"
                          inactive-text="不包含忽略账号">
                        </el-switch>
                        <el-date-picker
                          v-model="selectedDate"
                          align="right"
                          type="date"
                          placeholder="选择不活跃截止日期"
                          :picker-options="pickerOptions">
                        </el-date-picker>
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
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="pageSizes"
                        :page-size.sync="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                      />
                      <div class="ichat-messages-wrapper">
                        <div class="chat-sessions" v-if="pageContacts.length">

                          <el-table :data="pageContacts" border stripe
                                    @selection-change="handleSelectionChange"
                                    height="calc(100vh - 92px)" style="width: 100%;">
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
                            <el-table-column prop="messager0" label="最近发送人">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.messager}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="message0" label="最近消息">
                              <template slot-scope="scope">
                                <span class="last-time">{{scope.row.message}}</span>
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
  import moment from 'moment';
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
      allGroupContacts() {
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
                CreateTime: chatSession.CreateTime,
              };
              let messager;
              let message;
              if (chatSession.Des && chatSession.Message && REG_EXP.test(chatSession.Message)) {
                const [, userName] = REG_EXP.exec(chatSession.Message);
                if (this.contactsUserNameMapObject[userName]) {
                  messager = WechatService.parseName(
                    this.contactsUserNameMapObject[userName].dbContactRemark);
                  message = chatSession.Message.substring(userName.length + 2,
                    chatSession.Message.length);
                }
              } else {
                message = chatSession.Message;
                messager = '系统消息';
              }
              chatSessionInfo.messager = messager;
              chatSessionInfo.messageTime = chatSession.MessageTime &&
                WechatService.formatTime(chatSession.MessageTime);
              chatSessionInfo.message = message;
              groupSession.push(chatSessionInfo);
            }
          }
        });
        this.calculatePageContacts();
        return groupSession;
      },
      currentContacts() {
        if (!this.selectedDate) {
          return this.allGroupContacts;
        }
        const selectedDateString = WechatService.formatTimeWithPattern(this.selectedDate.getTime() / 1000, 'YYYY-MM-DD');
        const selectedDateMoment = moment(selectedDateString, 'YYYY-MM-DD');
        const selectedDate = selectedDateMoment.toDate().getTime() / 1000;
        return this.allGroupContacts.filter(contact => contact.CreateTime < selectedDate);
      },
      total() {
        return this.currentContacts.length;
      },
      orangeContacts() {
        const REG = /小橙子/;
        const ignoreContacts = this.allContacts.filter(contact => REG.test(contact.dbContactRemark));
        return ignoreContacts.map(contact => ({
          userName: contact.userName,
          nickName: WechatService.parseName(contact.dbContactRemark),
        }));
      },
    },
    data() {
      return {
        allChatSessions: [],
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
        pageSize: 100,
        pageContacts: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - (3600 * 1000 * 24));
              picker.$emit('pick', date);
            },
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - (3600 * 1000 * 24 * 7));
              picker.$emit('pick', date);
            },
          }],
        },
        selectedDate: null,
        hasOrange: false,
        ignoreContacts: [],
        keyword: null,
        debounceId: null,
        contacts: [],
      };
    },
    methods: {
      calculatePageContacts() {
        this.pageContacts = [];
        this.$nextTick(() => {
          const { pageSize = 10, currentPage = 1 } = this;
          const min = (currentPage - 1) * pageSize;
          const max = currentPage * pageSize;
          this.pageContacts = this.currentContacts.filter(
            (contact, index) => index >= min && index < max);
        });
      },
      exportContacts() {
        WechatService.exportContacts(this.currentContacts)
          .then(() => {
            this.$message.success('导出当前联系人成功');
          }, (error) => {
            this.$message.error(error);
          });
      },
      handleSelectionChange() {
        // Do nothing
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.calculatePageContacts();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.calculatePageContacts();
      },
      getUserChatSessionInActiveContacts() {
        const loadingInstance = Loading.service({ fullscreen: true, target: '#searchPage' });
        WechatService.getUserChatSessionInActiveContacts(
          WechatService.getMessageFileID(), this.hasOrange ? [] : this.ignoreContacts,
        )
          .then((chatSessions) => {
            this.allChatSessions = chatSessions;
            loadingInstance.close();
          }, (error) => {
            this.$message.error(error);
            loadingInstance.close();
          });
      },
      handleDelete(index) {
        this.ignoreContacts.splice(index, 1);
      },
      handleCommand(contact) {
        this.ignoreContacts.splice(0, 0, {
          userName: contact.userName,
          nickName: WechatService.parseName(contact.dbContactRemark),
        });
      },
      queryContacts() {
        if (this.debounceId) {
          clearTimeout(this.debounceId);
        }
        if (!this.keyword) {
          this.contacts = [];
          return; // Do nothing
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
    },
    mounted() {
      if (!WechatService.getSelectedBackupPath()) { // 如果没有选择目录
        this.$router.push('dashboard');
        return;
      }
      this.$nextTick(() => {
        this.ignoreContacts = [...this.orangeContacts];
        this.getUserChatSessionInActiveContacts();
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