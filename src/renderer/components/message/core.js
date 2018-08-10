import moment from 'moment';
import { mapState } from 'vuex';
import WechatService from '../../wechat-service';
import { DEFAULT_HEAD_IMAGE, REG_EXP } from '../../constants';

export default {
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
  },
};
