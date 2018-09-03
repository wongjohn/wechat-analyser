<template>
  <div id="chatRooms" class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
    <div class="tips">
      <el-input v-model="keyword" placeholder="筛选" @input="filterByGroupName"></el-input>
      <div class="selected">
        <el-button :class="{'selected-button': toggleSelected}" size="mini" round @click="toggleSelected = !toggleSelected">已选 {{selectedGroups.length}} 个</el-button>
        <el-dropdown split-button type="primary" size="mini" @click="dialogVisible = true" @command="handleGroupCommand">
          存为分组
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{groupName: '管理分组'}">管理分组</el-dropdown-item>
            <el-dropdown-item :command="{groupName: '全部微信群', list: allGroupContacts}">全部微信群</el-dropdown-item>
            <el-dropdown-item v-for="group in storeGroups" :key="group.groupName" :command="group">{{group.groupName}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
    <el-dialog title="存为分组" :visible.sync="dialogVisible" width="500px" >
      <p class="group-tips">将已经选择的<span>{{selectedGroups.length}}</span>个群存为分组</p>
      <el-input placeholder="输入分组名称" v-model="groupName" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleCreateGroup">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分组管理" :visible.sync="groupManageDialogVisible" width="500px" >
      <el-table :data="storeGroups" border stripe style="width: 100%;">
        <el-table-column prop="groupName" label="分组名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.$$editable" v-model="scope.row.groupName"></el-input>
            <span v-else>{{ scope.row.groupName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="list" label="分组群数量">
          <template slot-scope="scope">
            <span class="last-time">{{scope.row.list.length}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.$$editable" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
            <el-button v-else type="success" icon="el-icon-check" circle @click="handleClose(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="groupManageDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import WechatService from '../../service/wechat-service';
  const STORE_KEY = 'storeGroups';
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
      allGroupContacts() {
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
    watch: {
      allGroupContacts() {
        this.currentContacts = this.allGroupContacts;
      },
      toggleSelected(value) {
        this.$nextTick(() => {
          this.currentPage = 1;
          this.calculatePageContacts();
        });
        if (value) {
          this.currentContacts = [...this.selectedGroups];
        } else {
          this.currentContacts = this.allGroupContacts;
        }
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
        selectedGroups: [],
        keyword: '',
        filteredGroups: null,
        debounceId: null,
        selectionDebounceId: null,
        toggleSelected: false,
        currentContacts: [],
        storeGroups: JSON.parse(localStorage.getItem(STORE_KEY) || '[]'),
        dialogVisible: false,
        groupName: '',
        groupManageDialogVisible: false,
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
              contact => this.selectedGroups.indexOf(contact) !== -1);
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
          const selectedGroups = [...this.selectedGroups];
          val.forEach((contact) => { // 添加已经选中的
            if (this.selectedGroups.indexOf(contact) === -1) {
              selectedGroups.push(contact);
            }
          });
          this.pageContacts.forEach((contact) => { // 排除未选中的
            const index = this.selectedGroups.indexOf(contact);
            if (val.indexOf(contact) === -1 && index !== -1) {
              selectedGroups.splice(index, 1);
            }
          });
          this.selectedGroups = selectedGroups;
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
      handleCreateGroup() {
        this.storeGroups.push({
          groupName: this.groupName,
          list: [...this.selectedGroups],
        });
        localStorage.setItem(STORE_KEY, JSON.stringify(this.storeGroups));
        this.closeDialog();
      },
      closeDialog() {
        this.dialogVisible = false;
        this.groupName = '';
      },
      handleGroupCommand(group) {
        if (group.groupName === '管理分组') {
          this.groupManageDialogVisible = true;
          return;
        }
        this.toggleSelected = false;
        this.currentPage = 1;
        this.keyword = '';
        this.filteredGroups = null;
        this.$nextTick(() => {
          this.calculatePageContacts();
        });
        if (group.groupName === '全部微信群') {
          this.selectedGroups = [];
          this.currentContacts = this.allGroupContacts;
        } else {
          this.selectedGroups = this.allGroupContacts.filter(
            chatGroup => !!group.list.find(
              storeGroup => storeGroup.userName === chatGroup.userName),
          );
          if (this.selectedGroups.length !== group.list.length) {
            group.list.forEach((storeGroup) => { // 列表里面没有的，填充进去
              if (!this.selectedGroups.find(
                selectedGroup => selectedGroup.userName === storeGroup.userName)) {
                this.selectedGroups.push(storeGroup);
              }
            });
          }
          this.currentContacts = this.allGroupContacts;
          this.$nextTick(() => {
            this.toggleSelected = true;
          });
        }
      },
      handleDelete(index) {
        this.storeGroups.splice(index, 1);
        localStorage.setItem(STORE_KEY, JSON.stringify(this.storeGroups));
      },
      handleEdit(row) {
        this.$set(row, '$$editable', true);
      },
      handleClose(row) {
        this.$set(row, '$$editable', false);
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
    top: 0;
    right: 0;
    font-size: 12px;
    z-index: 9;
    background-color: #fff;
    padding: 8px;
    border: solid 1px #eee;
  }
  .tips .selected {
    margin-top: 8px;
  }
  .selected-button.el-button {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
  .group-tips {
    margin-bottom: 8px;
  }
  .group-tips span {
    color: #67c23a;
    margin: 0 8px;
  }
</style>