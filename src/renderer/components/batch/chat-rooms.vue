<template>
  <div id="chatRooms" class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
    <div class="tips">
      <el-input v-model="keyword" placeholder="筛选" @input="filterByGroupName"></el-input>
      <div class="selected">已选 {{pageSelectionArray.length}} 个</div>
    </div>
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
      <div v-if="loading" v-loading.lock="loading"></div>
      <div class="chat-sessions" v-if="pageContacts && pageContacts.length">
        <el-table :data="pageContacts" border stripe
                  ref="multipleTable"
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
                dbContactRemark: destination.dbContactRemark,
                lastTime: WechatService.formatTime(chatSession.CreateTime),
                joinTime: WechatService.formatTime(chatSession.JoinTime),
              };
              groupSession.push(chatSessionInfo);
            }
          }
        });
        this.calculatePageContacts();
        return groupSession;
      },
      total() {
        return (this.filteredGroups && this.filteredGroups.length) || this.currentContacts.length;
      },
    },
    data() {
      return {
        loading: false,
        allChatSessions: [],
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
        pageSize: 100,
        pageContacts: [],
        pageSelectionArray: [],
        keyword: '',
        filteredGroups: null,
        debounceId: null,
        selectionDebounceId: null,
      };
    },
    methods: {
      calculatePageContacts() {
        this.pageContacts = [];
        this.$nextTick(() => {
          const { pageSize = 10, currentPage = 1 } = this;
          const min = (currentPage - 1) * pageSize;
          const max = currentPage * pageSize;
          let contacts = this.currentContacts;
          if (this.filteredGroups && this.filteredGroups.length) {
            contacts = this.filteredGroups;
          }
          this.pageContacts = contacts.filter(
            (contact, index) => index >= min && index < max);
          this.$nextTick(() => {
            const selectedRows = this.pageContacts.filter(
              contact => this.pageSelectionArray.indexOf(contact) !== -1);
            selectedRows.forEach((row) => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          });
        });
      },
      handleSelectionChange(val) {
        if (this.selectionDebounceId) {
          clearTimeout(this.selectionDebounceId);
        }
        this.selectionDebounceId = setTimeout(() => {
          const selectedGroups = [...this.pageSelectionArray];
          val.forEach((contact) => { // 添加已经选中的
            if (this.pageSelectionArray.indexOf(contact) === -1) {
              selectedGroups.push(contact);
            }
          });
          this.pageContacts.forEach((contact) => { // 排除未选中的
            const index = this.pageSelectionArray.indexOf(contact);
            if (val.indexOf(contact) === -1 && index !== -1) {
              selectedGroups.splice(index, 1);
            }
          });
          this.pageSelectionArray = selectedGroups;
          this.$emit('change', selectedGroups);
          this.selectionDebounceId = null;
        }, 200);
      },
      handleSizeChange(val) {
        this.pageContacts = [];
        this.pageSize = val;
        this.currentPage = 1;
        this.calculatePageContacts();
      },
      handleCurrentChange(val) {
        this.pageContacts = [];
        this.currentPage = val;
        this.calculatePageContacts();
      },
      filterByGroupName() {
        if (!this.keyword) {
          this.filteredGroups = null;
          this.currentPage = 1;
          this.pageContacts = [];
          this.calculatePageContacts();
          return; // Do nothing
        }
        if (this.debounceId) {
          clearTimeout(this.debounceId);
        }
        this.debounceId = setTimeout(() => {
          this.filteredGroups = this.currentContacts.filter(
            contact => contact.nickName.includes(this.keyword));
          this.currentPage = 1;
          this.pageContacts = [];
          this.debounceId = null;
          this.calculatePageContacts();
        }, 300);
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
  #chatRooms {
    position: relative;
  }
  #chatRooms .tips {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 12px;
    color: #67C23A;
    z-index: 9;
    background-color: #fff;
  }
  .tips .selected {
    text-align: center;
  }
</style>