<template>
    <li class="ichat-message" :class="{'self': !chat.Des}">
        <div class="ichat-message-from">
            <img :src="headImage">
        </div>
        <div class="ichat-message-content withhover">
            <div class="ichat-message-content-h">
                <h4>{{ displayName }}</h4>
                <div class="ichat-message-time">{{messageTime}}</div>
                <div class="ichat-message-ope multi-selection-mode" v-if="isMultiSelectionMode"><!---->
                    <a class="iui-tooltip">
                        <div class="iui-tooltip-c" style="margin-left: 0px;" @click="markMessageAsTitle">
                            <i :class="{'el-icon-star-off': !isTitle, 'el-icon-star-on': isTitle}"></i> 作为标题</div>
                    </a>
                    <a class="iui-tooltip">
                        <div class="iui-tooltip-c" style="margin-left: 0px;" @click="addMessageAsBug">
                            <i :class="{'el-icon-circle-check-outline': !isSelected, 'el-icon-circle-check': isSelected}"></i> 选择</div>
                    </a>
                </div>
                <div class="ichat-message-ope" v-else><!---->
                    <a class="iui-tooltip">
                        <div class="iui-tooltip-c" style="margin-left: 0px;" @click="copyText"><i class="el-icon-info"></i> 复制</div>
                    </a>
                    <a class="iui-tooltip">
                        <div class="iui-tooltip-c" style="margin-left: 0px;" @click="addBug"><i class="el-icon-warning"></i> 记录Bug</div>
                    </a>
                </div>
            </div>
            <div class="ichat-message-content-c">
                <section>
                    <div class="iui-paragraph selectable">
                        <pre class="">{{message}}</pre>
                    </div>
                </section>
            </div>
        </div>
    </li>
</template>

<script>
  import { clipboard } from 'electron'; // eslint-disable-line
  import { REG_EXP } from '../../constants';
  import Core from './core';
  import bugService from '../../service/bug-service';
  const TextMessage = Object.assign({}, Core, {
    name: 'text-message',
  });

  TextMessage.computed = Object.assign({}, TextMessage.computed, {
    message() {
      if (this.chat.Des) { // 对方发送的信息
        if (REG_EXP.test(this.chat.Message)) {
          const [, userName] = REG_EXP.exec(this.chat.Message);
          return this.chat.Message.substring(userName.length + 2, this.chat.Message.length);
        }
        return this.chat.Message;
      }
      return this.chat.Message;
    },
  });

  TextMessage.methods = Object.assign({}, TextMessage.methods, {
    copyText() {
      clipboard.writeText(this.message);
      this.$message.success('消息已经拷贝到剪贴板');
    },
    addBug() {
      bugService.addBug({
        module: '',
        title: this.message,
        type: '',
        state: '',
        source: `${this.sessionInfo.displayName} - ${this.displayName}`,
        detail: this.message,
      });
      this.$message.success('消息已经记录到Bug列表');
    },
  });

  export default TextMessage;
</script>

<style>

</style>