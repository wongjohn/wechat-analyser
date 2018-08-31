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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTextMsg">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加超链接消息" :visible.sync="appDialogVisible" width="500px" >
      <el-input placeholder="输入标题" v-model="title" />
      <el-input placeholder="输入描述" v-model="des" />
      <el-input placeholder="输入链接" v-model="url" />
      <el-input placeholder="缩略图地址" v-model="thumburl" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="appDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAppMsg">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  const DEFAULT_HEAD_IMAGE = 'http://wx.qlogo.cn/mmhead/ver_1/ozntzvibcWdPugmdr7ngLwLkuUt2L6sel2nLbH4pXu4opERGCicDHsvgR7kzWBMY8EibggYnqg9of4wVLIQNZywHdmlPV8tMwK3lvQb2UbN7GQ/132';

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
        this.$emit('change', [...this.messages, { mType: 1, content }]);
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
        this.$emit('change', [...this.messages, { mType: 49, content: { title, des, url, thumburl } }]);
        this.title = '';
        this.des = '';
        this.url = '';
        this.thumburl = '';
        this.appDialogVisible = false;
      },

      // sendImgInput change
      previewFiles() {
        const files = this.$refs.imgFiles.files;

        // check files
        // for (let i = 0, len = files.length; i < len; i++) { // eslint-disable-line
        //   const file = files[i];
        //
        //   if (file.size > splitSize) { // 1048576 * 20) { // 限制 20MB
        //     this.$notify.warning({
        //       position: 'bottom-left',
        //       title: '警告',
        //       message: '限制图片不能大于 512KB',
        //     });
        //     return;
        //   }
        //
        //   // image/jpeg image/png
        //   const type = file.type;
        //   if (type !== 'image/jpeg' && type !== 'image/png') {
        //     this.$notify.warning({
        //       position: 'bottom-left',
        //       title: '警告',
        //       message: '现在只写了发送 jpeg、png 图片的逻辑',
        //     });
        //     return;
        //   }
        // }
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
      clearAllMessages() {
        this.messages = [];
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