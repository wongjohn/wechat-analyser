import TextMessage from './text-message';
import SystemMessage from './system-message';
import ImageMessage from './image-message';
import EmojiMessage from './emoji-message';
import * as C from '../../constants';
/**
 * 微信消息——根据不同类型，进行不同方式解析、展示为不同样式
 */
export default {
  name: 'message',
  components: {
    TextMessage, SystemMessage, ImageMessage, EmojiMessage,
  },
  props: {
    chat: Object,
    sessionInfo: Object,
  },
  render(createElement) {
    let messageType = 'text-message';
    const { Type = C.MM_DATA_TEXT } = this.chat;
    switch (Type) {
      case C.MM_DATA_SYS: // '系统消息'
        messageType = 'system-message';
        break;
      case C.MM_DATA_TEXT: // '文本'
        messageType = 'text-message';
        break;
      case C.MM_DATA_IMG: // '图片'
        messageType = 'image-message';
        break;
      case C.MM_DATA_VOICEMSG: // '语音'
      case C.MM_DATA_PUSHMAIL: // '邮件'
      case C.MM_DATA_SHARECARD: // '名片'
      case C.MM_DATA_VIDEO: // '视频'
      case C.MM_DATA_VIDEO_IPHONE_EXPORT: // '视频'
        messageType = 'text-message';
        break;
      case C.MM_DATA_EMOJI: // '表情'
        messageType = 'emoji-message';
        break;
      case C.MM_DATA_LOCATION: // '位置'
      case C.MM_DATA_APPMSG: // '链接'
      case C.MM_DATA_VOIPMSG: // '通话'
      case C.MM_DATA_MICROVIDEO: // '视频'
      default:
        messageType = 'text-message';
    }
    return createElement(messageType, {
      props: this.$props,
    });
  },
};
