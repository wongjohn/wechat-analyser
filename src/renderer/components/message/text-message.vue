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
                        <div class="iui-tooltip-c" style="margin-left: 0px;">复制</div>
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
  import moment from 'moment';
  import { mapState } from 'vuex';
  import WechatService from '../../wechat-service';
  const DEFAULT_HEAD_IMAGE = 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLCK5PlaK1piamCgcc1kAFzt2BE8PFPcm5urnmUJGfj53hXH50PT0EGt28ZqicxU8Paria72ohkVUxzA/132?token=eyJhbGciOiJIUzI1NiJ9.eyJvZmZpY2VfaWQiOiI0ZDc5MmUzMTZhMDUxMWU2YWE3NjAwMTYzZTE2MmFkZCIsImRldmljZVR5cGUiOiJ0ZWFtIiwib2ZmaWNlX25hbWUiOiJpQ291cnQiLCJ1c2VyX2lkIjoiRDk5QkUxNTAyQ0FEMTFFODg0Nzk0NDZBMkVEOURDQkQiLCJsb2dpblR5cGUiOiIxIiwidXNlcl9uYW1lIjoi546L5aOr5rGfIiwiaXNzIjoiaUxhdy5jb20iLCJleHAiOjE1MzM2OTYwNzQ3NzAsImlhdCI6MTUzMzA5MTI3NDc3MCwib2ZmaWNlVHlwZSI6ImludGVncmF0aW9uIn0.8nmwzTETmiky4inHiGF3WlDMfKhPfVF0h4-wpU4moZc';
  const REG_EXP = /^([a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}):\n.*/; // wxid_qi45uqjuajox12:
  export default {
    name: 'text-message',
    props: {
      chat: Object,
      sessionInfo: Object,
    },
    computed: {
      ...mapState({
        contactsUserNameMapObject: state => state.Contacts.contactsUserNameMapObject,
      }),
      messageTime() {
        return moment(new Date(this.chat.CreateTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
      },
      displayName() {
        if (this.chat.Des) { // 对方发送的信息
          if (REG_EXP.test(this.chat.Message)) {
            const [, userName] = REG_EXP.exec(this.chat.Message);
            if (this.contactsUserNameMapObject[userName]) {
              return WechatService.parseName(
                this.contactsUserNameMapObject[userName].dbContactRemark);
            }
            return this.sessionInfo.displayName;
          }
          return this.sessionInfo.displayName;
        }
        return '我';
      },
      headImage() {
        if (this.chat.Des) { // 对方发送的信息
          if (REG_EXP.test(this.chat.Message)) {
            const [, userName] = REG_EXP.exec(this.chat.Message);
            if (this.contactsUserNameMapObject[userName]) {
              return WechatService.parseImage(
                this.contactsUserNameMapObject[userName].dbContactHeadImage);
            }
            return this.sessionInfo.headImage;
          }
          return this.sessionInfo.headImage;
        }
        return DEFAULT_HEAD_IMAGE;
      },
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
    },
  };
</script>

<style>

</style>