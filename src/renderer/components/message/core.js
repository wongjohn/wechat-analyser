import moment from 'moment';
import { mapState } from 'vuex';
import WechatService from '../../service/wechat-service';
import { DEFAULT_HEAD_IMAGE, REG_EXP } from '../../constants';

export default {
  props: {
    chat: Object,
    sessionInfo: Object,
  },
  computed: {
    ...mapState({
      contactsUserNameMapObject: state => state.Contacts.contactsUserNameMapObject,
      isMultiSelectionMode: state => state.Global.isMultiSelectionMode,
      multiSelections: state => state.Global.multiSelections,
      titleSelection: state => state.Global.titleSelection,
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
    isTitle() {
      return !!this.titleSelection[this.chat.MesLocalID];
    },
    isSelected() {
      return !!this.multiSelections[this.chat.MesLocalID];
    },
  },
  methods: {
    markMessageAsTitle() {
      this.$store.commit('MULTI_SELECTION_ADD_TITLE', {
        id: this.chat.MesLocalID,
        module: '',
        title: this.message,
        type: '',
        source: `${this.sessionInfo.displayName} - ${this.displayName}`,
        detail: this.message,
      });
    },
    addMessageAsBug() {
      this.$store.commit('MULTI_SELECTION_ADD_SELECTION', {
        id: this.chat.MesLocalID,
        module: '',
        title: this.message,
        type: '',
        source: `${this.sessionInfo.displayName} - ${this.displayName}`,
        detail: this.message,
      });
    },
  },
};
