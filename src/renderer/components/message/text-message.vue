<template>
    <li class="ichat-message" :class="{'self': !chat.Des}">
        <div class="ichat-message-from">
            <img :src="headImage">
        </div>
        <div class="ichat-message-content withhover">
            <div class="ichat-message-content-h">
                <h4>{{ displayName }}</h4>
                <div class="ichat-message-time">{{messageTime}}</div>
                <div class="ichat-message-time-star">
                    <a class="starBox"><!----> <!---->
                        <i class="star iui-icon iui-icon-star"></i>
                    </a>
                </div>
                <div class="ichat-message-ope"><!---->
                    <a class="iui-tooltip">
                        <i class="iui-icon iui-icon-pin"></i>
                        <div class="iui-tooltip-c" style="margin-left: 0px;" @click="copyText">复制</div>
                    </a>
                    <a class="iui-tooltip">
                        <i class="iui-icon iui-icon-task-pad"></i>
                        <div class="iui-tooltip-c" style="margin-left: 0px;">
                            转Bug
                        </div>
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
  const TextMessage = Object.assign({}, Core, {
    name: 'text-message',
    methods: {
      copyText() {
        clipboard.writeText(this.message);
        this.$message.success('消息已经拷贝到剪贴板');
      },
    },
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

  export default TextMessage;
</script>

<style>

</style>