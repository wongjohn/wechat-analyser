<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <span class="title">
          当前设备： {{productName}}
        </span>
        <ul class="contacts">
          <li v-for="contact in contacts" :key='contact.userName'>
            <span class="username">{{contact.userName}}</span> 
            <span class="contact-remark">{{contact.dbContactRemark}}</span>
          </li>
        </ul>
      </div>

      <div class="right-side">
        <ul class="chat-sessions">
          <li v-for="chatSession in chatSessions" :key="chatSession.name" @click="viewChatsOf(chatSession.name)">
            {{chatSession.name}}
          </li>
        </ul>
      </div>
      <div class="chats">
        <ul>
          <li v-for="(chat, index) in chats" :key="index">{{chat.Message}}</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
  import WechatService from '../wechat-service';

  export default {
    name: 'landing-page',
    components: {},
    data() {
      return {
        allContacts: [],
        productName: '',
        allChatSessions: [],
        chats: [],
      };
    },
    computed: {
      contacts() {
        return this.allContacts.filter((item, index) => {
          item.dbContactRemark = Buffer.from(item.dbContactRemark).toString();
          return index < 20;
        });
      },
      chatSessions() {
        return this.allChatSessions.filter((item, index) => index < 20);
      },
    },
    methods: {
      viewChatsOf(chatSessionName) {
        WechatService.loadChatsOf(chatSessionName)
          .then((chats) => {
            this.chats = chats;
          });
      },
    },
    mounted() {
      WechatService.getMessageAndContactFileID()
        .then(({ messageFileID, contactFileID }) => {
          WechatService.getUserContacts(contactFileID)
            .then((contacts) => {
              this.allContacts = contacts || [];
            });
          WechatService.getUserChatSessions(messageFileID)
            .then((chatSessions) => {
              this.allChatSessions = chatSessions;
            });
        });
      this.productName = WechatService.getProductName();
    },
  };
</script>

<style>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: '微软雅黑', '宋体'; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .contacts, .chat-sessions {
    list-style: none;
  }

  .contacts .username {
    color: #3ba776;
  }

  .contacts .contact-remark {
    color: #496988;
  }

  .chat-sessions li {
    cursor: pointer;
  }
</style>
