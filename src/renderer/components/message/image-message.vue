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
        <!--<div class="ichat-message-ope">&lt;!&ndash;&ndash;&gt;-->
          <!--<a class="iui-tooltip">-->
            <!--<i class="iui-icon iui-icon-pin"></i>-->
            <!--<div class="iui-tooltip-c" style="margin-left: 0px;">复制</div>-->
          <!--</a>-->
          <!--<a class="iui-tooltip">-->
            <!--<i class="iui-icon iui-icon-task-pad"></i>-->
            <!--<div class="iui-tooltip-c" style="margin-left: 0px;">-->
              <!--转Bug-->
            <!--</div>-->
          <!--</a>-->
        <!--</div>-->
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
  import aesjs from 'aes-js';
  import { REG_EXP } from '../../constants';
  import Core from './core';
  const ImageMessage = Object.assign({}, Core, {
    name: 'image-message',
  });

  ImageMessage.computed = Object.assign({}, ImageMessage.computed, {
    message() {
      let msgXML = this.chat.Message;
      if (REG_EXP.test(this.chat.Message)) {
        const [, userName] = REG_EXP.exec(this.chat.Message);
        msgXML = this.chat.Message.substring(userName.length + 2, this.chat.Message.length);
      }
      const msgObject = JSON.parse(converter.xml2json(msgXML, { compact: true }));
      // TODO aeskey 、 cdnmidimgurl 仍然解码不出来
      const aesKeyBytes = aesjs.utils.hex.toBytes(msgObject.msg.img._attributes.aeskey) // eslint-disable-line
      const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyBytes); // eslint-disable-line
      const encryptedBytes = aesjs.utils.hex.toBytes(msgObject.msg.img._attributes.cdnmidimgurl); // eslint-disable-line
      const decryptedBytes = aesCtr.decrypt(encryptedBytes);
      const skey = Buffer.from(decryptedBytes);
      return `<img referrerpolicy="no-referrer" style="width: ${msgObject.msg.img._attributes.cdnthumbwidth}px; height: ${msgObject.msg.img._attributes.cdnthumbheight}px;" src="https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxgetmsgimg?MsgID=${this.chat.MesSvrID}&&skey=${skey}">`; // eslint-disable-line
    },
  });

  export default ImageMessage;
</script>

<style>

</style>