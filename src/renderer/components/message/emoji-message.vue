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
      </div>
      <div class="ichat-message-content-c">
        <section>
          <div class="iui-paragraph" v-html="message"></div>
        </section>
      </div>
    </div>
  </li>
</template>

<script>
  import converter from 'xml-js';
  import { REG_EXP } from '../../constants';
  import Core from './core';

  const EmojiMessage = Object.assign({}, Core, {
    name: 'emoji-message',
  });

  EmojiMessage.computed = Object.assign({}, EmojiMessage.computed, {
    message() {
      let msgXML = this.chat.Message;
      if (REG_EXP.test(this.chat.Message)) {
        const [, userName] = REG_EXP.exec(this.chat.Message);
        msgXML = this.chat.Message.substring(userName.length + 2, this.chat.Message.length);
      }
      const msgObject = JSON.parse(converter.xml2json(msgXML, { compact: true }));
      return `<img referrerpolicy="no-referrer" style="width: ${msgObject.msg.emoji._attributes.width}px; height: ${msgObject.msg.emoji._attributes.height}px;" src="${msgObject.msg.emoji._attributes.cdnurl}">`; // eslint-disable-line
    },
  });

  export default EmojiMessage;
</script>

<style>

</style>