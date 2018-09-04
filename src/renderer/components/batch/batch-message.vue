<template>
  <div id="send-batch-message">
    <div id="buttons">
      <el-button
        id="add-text-btn"
        type="primary"
        icon="el-icon-edit"
        @click="dialogVisible = true">添加文本消息</el-button>

      <el-button
        id="add-img-btn"
        type="primary"
        icon="el-icon-edit"
        @click="addImgMsg">添加图片消息</el-button>

      <el-button
        id="add-app-msg-btn"
        type="primary"
        icon="el-icon-edit"
        @click="appDialogVisible = true">添加超链接</el-button>

      <el-button
        id="clear-btn"
        type="danger"
        icon="el-icon-delete"
        :disabled="!messages.length"
        @click="clearAllMessages">清空</el-button>

      <el-dropdown split-button type="primary" @click="messageDialogVisible = true" @command="handleMessageCommand">
        存为草稿
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="{messageName: '管理草稿'}">管理草稿</el-dropdown-item>
          <el-dropdown-item v-for="message in storeMessages" :key="message.messageName" :command="message">{{message.messageName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <input
      id="sendImgInput"
      ref="imgFiles"
      @change="previewFiles"
      type="file"
      accept="image/png, image/jpeg"
    >

    <div class="messages">
      <h3>消息预览({{messages.length}})</h3>
      <div class="ichat-message" v-for="(message, index) in messages" :key="index">
        <div class="ichat-message-from">
          <img :src="headImageSrc">
        </div>
        <div class="ichat-message-content withhover">
          <div class="ichat-message-content-h">
            <h4>小橙子</h4>
            <div class="ichat-message-ope multi-selection-mode"><!---->
              <a class="iui-tooltip" v-if="message.mType !== 3">
                <div class="iui-tooltip-c" style="margin-left: 0px;" @click="editMessage(message, index)">
                  <i class="el-icon-edit"></i> 编辑</div>
              </a>
              <a class="iui-tooltip">
                <div class="iui-tooltip-c" style="margin-left: 0px;" @click="deleteMessage(index)">
                  <i class="el-icon-delete"></i> 删除</div>
              </a>
            </div>
          </div>
          <div v-if="message.mType === 1" class="ichat-message-content-c">
            <section>
              <div class="iui-paragraph selectable">
                <pre class="">{{message.content}}</pre>
              </div>
            </section>
          </div>
          <div v-else-if="message.mType === 3" class="ichat-message-content-c">
            <div class="ichat-message-content-img" style="height:300px;">
              <img :src="message.$$thumbnail" class="success" />
            </div>
          </div>
          <div v-else>
            <div class="iui-paragraph bubble_cont primary">
              <a :href="message.content.url" class="app" target="_blank">
                <h4 class="title">{{message.content.title}}</h4>
                <img :src="message.content.thumburl" class="cover">
                <p class="desc">{{message.content.des}}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="添加文本消息" :visible.sync="dialogVisible" width="500px" >
      <el-input
        type="textarea"
        :rows="10"
        placeholder="输入文本消息"
        v-model="textMessage">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTextDialog">取 消</el-button>
        <el-button type="primary" @click="addTextMsg">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加超链接消息" :visible.sync="appDialogVisible" width="500px" >
      <el-input placeholder="输入标题" v-model="title" />
      <el-input placeholder="输入描述" v-model="des" />
      <el-input placeholder="输入链接" v-model="url" />
      <el-input placeholder="缩略图地址" v-model="thumburl" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAppDialog">取 消</el-button>
        <el-button type="primary" @click="addAppMsg">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="存为草稿" :visible.sync="messageDialogVisible" width="500px" >
      <el-input placeholder="输入草稿名称" v-model="messageName" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMessageDialog">取 消</el-button>
        <el-button type="primary" @click="handleStoreMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="草稿管理" :visible.sync="messageManageDialogVisible" width="500px" >
      <el-table :data="storeMessages" border stripe style="width: 100%;">
        <el-table-column prop="messageName" label="草稿名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.$$editable" v-model="scope.row.messageName"></el-input>
            <span v-else>{{ scope.row.messageName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="list" label="草稿消息数量">
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
        <el-button @click="messageManageDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const DEFAULT_HEAD_IMAGE = 'http://wx.qlogo.cn/mmhead/ver_1/ozntzvibcWdPugmdr7ngLwLkuUt2L6sel2nLbH4pXu4opERGCicDHsvgR7kzWBMY8EibggYnqg9of4wVLIQNZywHdmlPV8tMwK3lvQb2UbN7GQ/132';
  const STORE_KEY = 'storeMessages';
  // 如果 file.size > splitSize
  // 必须分割 buf
  // 分片大小 512 * 1024 (512KB)
  // const splitSize = 524288;

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  export default {
    model: {
      prop: 'messages',
      event: 'change',
    },
    props: {
      messages: Array,
    },
    data() {
      return {
        textMessage: '',
        imagefile: null,
        headImageSrc: DEFAULT_HEAD_IMAGE,
        dialogVisible: false,
        notifyType: '',
        appDialogVisible: false,
        title: '',
        des: '',
        url: '',
        thumburl: '',
        editIndex: -1,
        storeMessages: JSON.parse(localStorage.getItem(STORE_KEY) || '[]'),
        messageDialogVisible: false,
        messageName: '',
        messageManageDialogVisible: false,
      };
    },
    methods: {
      addTextMsg() {
        const content = this.textMessage.trim();
        if (!content) {
          this.$notify.warning({
            position: 'bottom-left',
            title: '警告',
            message: '不能发送空消息',
          });
          return;
        }

        // value: { mType, content }
        const messages = [...this.messages];
        if (this.editIndex === -1) {
          messages.push({ mType: 1, content });
        } else {
          messages.splice(this.editIndex, 1, { mType: 1, content });
          this.editIndex = -1;
        }
        this.$emit('change', messages);
        this.closeTextDialog();
      },
      closeTextDialog() {
        this.textMessage = '';
        this.dialogVisible = false;
      },
      addImgMsg() {
        this.$refs.imgFiles.value = '';
        this.$refs.imgFiles.click();
      },

      addAppMsg() {
        const { title, des, url, thumburl } = this;
        // value: { mType, content }
        const messages = [...this.messages];
        if (this.editIndex === -1) {
          messages.push({ mType: 49, content: { title, des, url, thumburl } });
        } else {
          messages.splice(this.editIndex, 1, { mType: 49, content: { title, des, url, thumburl } });
          this.editIndex = -1;
        }
        this.$emit('change', messages);
        this.closeAppDialog();
      },
      closeAppDialog() {
        this.title = '';
        this.des = '';
        this.url = '';
        this.thumburl = '';
        this.appDialogVisible = false;
      },
      // sendImgInput change
      previewFiles() {
        const files = this.$refs.imgFiles.files;

        const messages = [...this.messages];
        for (let i = 0, len = files.length; i < len; i++) { // eslint-disable-line
          // value: { mType, file, tos: { premd5: failCount } }
          const message = { mType: 3, file: files[i], data: '', $$thumbnail: '' };
          const dataUrlReader = new FileReader();
          dataUrlReader.readAsDataURL(message.file); // 发起异步请求
          dataUrlReader.onload = function handleOnload() {
            // 读取完成后，将结果赋值给message的$$thumbnail
            message.$$thumbnail = this.result;
          };
          const dataReader = new FileReader();
          dataReader.readAsArrayBuffer(message.file); // 发起异步请求
          dataReader.onload = function handleOnload() {
            // 读取完成后，将结果赋值给message的$$thumbnail
            message.data = Buffer.from(this.result).toString('base64');
          };
          messages.push(message);
        }
        this.$emit('change', messages);
      },
      deleteMessage(index) {
        const messages = [...this.messages];
        messages.splice(index, 1);
        this.$emit('change', messages);
      },
      editMessage(message, index) {
        this.editIndex = index;
        if (message.mType === 1) {
          this.textMessage = message.content;
          this.dialogVisible = true;
        } else if (message.mType === 49) {
          this.title = message.content.title;
          this.des = message.content.des;
          this.url = message.content.url;
          this.thumburl = message.content.thumburl;
          this.appDialogVisible = true;
        }
      },
      clearAllMessages() {
        this.messages = [];
      },
      handleStoreMessage() {
        this.storeMessages.push({
          messageName: this.messageName,
          list: [...this.messages],
        });
        localStorage.setItem(STORE_KEY, JSON.stringify(this.storeMessages));
        this.closeMessageDialog();
      },
      closeMessageDialog() {
        this.messageDialogVisible = false;
        this.messageName = '';
      },
      handleMessageCommand(message) {
        if (message.messageName === '管理草稿') {
          this.messageManageDialogVisible = true;
          return;
        }
        this.$emit('change', message.list);
      },
      handleDelete(index) {
        this.storeMessages.splice(index, 1);
        localStorage.setItem(STORE_KEY, JSON.stringify(this.storeMessages));
      },
      handleEdit(row) {
        this.$set(row, '$$editable', true);
      },
      handleClose(row) {
        this.$set(row, '$$editable', false);
      },
    },
  };
</script>

<style>
  #send-batch-message {
    margin-left: 20px;
  }
  #buttons {
    margin-top: 8px;
  }
  #sendImgInput {
    display: none;
  }
  .bubble_cont {
    word-wrap: break-word;
    word-break: break-all;
    min-height: 25px;
  }
  .bubble_cont .app {
    padding: 7px 13px;
    background-color: #fff;
    margin: 2px;
    display: block;
    overflow: hidden;
    text-decoration: none;
    max-width: 300px;
    min-width: 250px;
  }
  .bubble_cont .app .title {
    font-weight: 400;
    margin-bottom: 10px;
    color: #333;
  }
  .bubble_cont .app .cover {
    width: 80px;
    height: 80px;
    float: left;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    margin-right: 10px;
  }
  .bubble_cont img {
    vertical-align: middle;
  }
  .bubble_cont .app .desc {
    overflow: hidden;
    color: #888;
    max-height: 5em;
    word-break: break-all;
  }
</style>