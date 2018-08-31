<template>
  <div class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    />
    <div class="ichat-messages-wrapper">
      <el-button
        v-if="loading"
        type="primary"
        v-loading.lock="loading">
      </el-button>
      <div class="chat-sessions" v-if="pageContacts && pageContacts.length">
        <el-table :data="currentContacts" border stripe
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
</template>

<script>
  import { mapState } from 'vuex';
  import WechatService from '../../service/wechat-service';
  export default {
    name: 'chat-rooms',
    model: {
      prop: 'multipleSelection',
      event: 'change',
    },
    props: {
      multipleSelection: {
        type: Array,
        default() { return []; },
      },
    },
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
      total() {
        return this.currentContacts.length;
      },
      pageContacts() {
        const { pageSize = 10, currentPage = 1 } = this;
        const min = (currentPage - 1) * pageSize;
        const max = currentPage * pageSize;
        return this.currentContacts.filter((contact, index) => index >= min && index <= max);
      },
    },
    data() {
      return {
        loading: false,
        allChatSessions: [],
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
        pageSize: 10,
      };
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('change', val);
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.loading = true;
        WechatService.getMessageAndContactFileID()
          .then(({ messageFileID }) => {
            WechatService.getUserChatSessionContacts(messageFileID)
              .then((chatSessions) => {
                this.allChatSessions = chatSessions;
                this.loading = false;
              }, (error) => {
                this.$message.error(error);
                this.loading = false;
              });
          });
      });
    },
  };
</script>

<style>

</style>