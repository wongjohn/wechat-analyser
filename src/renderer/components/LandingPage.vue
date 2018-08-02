<template>
  <div id="wrapper" class="main native">
    <main class="main-h">
      <div class="main-menu">
        <a class="main-menu-mine"><img src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLCK5PlaK1piamCgcc1kAFzt2BE8PFPcm5urnmUJGfj53hXH50PT0EGt28ZqicxU8Paria72ohkVUxzA/132?token=eyJhbGciOiJIUzI1NiJ9.eyJvZmZpY2VfaWQiOiI0ZDc5MmUzMTZhMDUxMWU2YWE3NjAwMTYzZTE2MmFkZCIsImRldmljZVR5cGUiOiJ0ZWFtIiwib2ZmaWNlX25hbWUiOiJpQ291cnQiLCJ1c2VyX2lkIjoiRDk5QkUxNTAyQ0FEMTFFODg0Nzk0NDZBMkVEOURDQkQiLCJsb2dpblR5cGUiOiIxIiwidXNlcl9uYW1lIjoi546L5aOr5rGfIiwiaXNzIjoiaUxhdy5jb20iLCJleHAiOjE1MzM2OTYwNzQ3NzAsImlhdCI6MTUzMzA5MTI3NDc3MCwib2ZmaWNlVHlwZSI6ImludGVncmF0aW9uIn0.8nmwzTETmiky4inHiGF3WlDMfKhPfVF0h4-wpU4moZc"></a>
        <a class="main-menu-task"></a>
        <a class="main-menu-customer"></a>
        <a class="main-menu-chat active"></a>
        <a class="main-menu-note"></a>
      </div>
    </main>
    <main class="main-c">
      <section>
        <div class="ichat">
          <div class="ichat-menu">
            <div class="vd-nav" style="width: 100%;">
              <ul class="vd-nav-list">
                <li class="router-link-exact-active router-link-active active"> 消息 </li>
                <li class="router-link-exact-active router-link-active"> 联系人 </li>
                <li class="router-link-exact-active router-link-active"> @我的 </li>
              </ul>
            </div>
          </div>
          <div class="ichat-content">
            <div class="ichat-content-w">
              <div class="ichat-chat">
                <div class="ichat-chat-conversation">
                  <div class="ichat-chat-conversation-search">
                    <div tabindex="2" class="chat-search-w">
                      <i class="iui-icon iui-icon-search"></i>
                      <input type="text" placeholder="讨论组、联系人">
                    </div>
                    <a class="add-group"></a>
                  </div>
                  <div class="ichat-chat-conversation-w">
                    <div class="ichat-chat-conversation-c">
                      <div class="ichat-conversation">
                        <ul>
                          <li v-for="chatSession in chatSessions"
                            :key="chatSession.name"
                            @click="viewChatsOf(chatSession.name)"
                          >
                            <div class="img group">
                              <img src="https://im.alphalawyer.cn/im/v1/imgs/group_head/32518a84-bd66-4199-b1a2-4527b8d5a8af.png?token=eyJhbGciOiJIUzI1NiJ9.eyJvZmZpY2VfaWQiOiI0ZDc5MmUzMTZhMDUxMWU2YWE3NjAwMTYzZTE2MmFkZCIsImRldmljZVR5cGUiOiJ0ZWFtIiwib2ZmaWNlX25hbWUiOiJpQ291cnQiLCJ1c2VyX2lkIjoiRDk5QkUxNTAyQ0FEMTFFODg0Nzk0NDZBMkVEOURDQkQiLCJsb2dpblR5cGUiOiIxIiwidXNlcl9uYW1lIjoi546L5aOr5rGfIiwiaXNzIjoiaUxhdy5jb20iLCJleHAiOjE1MzM2OTYwNzQ3NzAsImlhdCI6MTUzMzA5MTI3NDc3MCwib2ZmaWNlVHlwZSI6ImludGVncmF0aW9uIn0.8nmwzTETmiky4inHiGF3WlDMfKhPfVF0h4-wpU4moZc" alt="">
                            </div>
                            <div class="txt">
                              <h2>{{getNickname(chatSession.name)}}</h2>
                              <div class="p">
                                <p>凡柳松撤回了一条消息</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ichat-detail">
                  <div class="ichat-detail-h-w">
                    <div class="ichat-header">
                      <div class="ichat-header-user">
                        <h2 title="研究所&amp;测试"> 研究所&amp;测试 <span>(32)</span></h2>
                      </div>
                      <div class="ichat-header-menu">
                        <a><i class="icon iui-icon iui-icon-more"></i></a>
                      </div>
                    </div>
                  </div>
                  <div class="ichat-detail-c">
                    <section>
                      <div class="ichat-messages ichattypegroup">
                        <ul>
                          <li class="ichat-message" v-for="(chat, index) in chats" :key="chat.MesLocalID">
                            <div class="ichat-message-from">
                              <img src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLOx5qKJqgjAAAuCIy1jfh3FLTHLUWWicIVfGCjbGWutluRZ9cGLgxaicEZDcoU9jOQtSw0AI6xZl3Q/132?token=eyJhbGciOiJIUzI1NiJ9.eyJvZmZpY2VfaWQiOiI0ZDc5MmUzMTZhMDUxMWU2YWE3NjAwMTYzZTE2MmFkZCIsImRldmljZVR5cGUiOiJ0ZWFtIiwib2ZmaWNlX25hbWUiOiJpQ291cnQiLCJ1c2VyX2lkIjoiRDk5QkUxNTAyQ0FEMTFFODg0Nzk0NDZBMkVEOURDQkQiLCJsb2dpblR5cGUiOiIxIiwidXNlcl9uYW1lIjoi546L5aOr5rGfIiwiaXNzIjoiaUxhdy5jb20iLCJleHAiOjE1MzM2OTYwNzQ3NzAsImlhdCI6MTUzMzA5MTI3NDc3MCwib2ZmaWNlVHlwZSI6ImludGVncmF0aW9uIn0.8nmwzTETmiky4inHiGF3WlDMfKhPfVF0h4-wpU4moZc" alt="" class="success"> <!---->
                            </div>
                            <div class="ichat-message-content withhover">
                              <div class="ichat-message-content-h">
                                <h4>李多</h4>
                                <div class="ichat-message-time">17:58</div>
                                <div class="ichat-message-time-star">
                                  <a class="starBox"><!----> <!---->
                                    <i class="star iui-icon iui-icon-star"></i>
                                  </a>
                                </div>
                                <div class="ichat-message-ope"><!---->
                                  <a class="iui-tooltip">
                                    <i class="iui-icon iui-icon-pin"></i>
                                    <div class="iui-tooltip-c" style="margin-left: 0px;">钉</div>
                                  </a>
                                  <a class="iui-tooltip">
                                    <i class="iui-icon iui-icon-task-pad"></i>
                                    <div class="iui-tooltip-c" style="margin-left: 0px;">
                                      转任务
                                    </div>
                                  </a>
                                </div>
                              </div>
                              <div class="ichat-message-content-c">
                                <section>
                                  <div class="iui-paragraph selectable">
                                    <pre class="">{{chat.Message}}</pre>
                                  </div>
                                </section>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
        contactsHashObject: {},
      };
    },
    computed: {
      contacts() {
        return this.allContacts.filter((item, index) => index < 20);
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
      getNickname(chatRoomName) {
        let destination = chatRoomName.substring('Chat_'.length, chatRoomName.length);
        if (this.contactsHashObject[destination]) {
          destination = this.contactsHashObject[destination];
          return WechatService.parseName(destination.dbContactRemark);
        }
        return destination;
      },
      parseName(remark) {
        return WechatService.parseName(remark);
      },
    },
    mounted() {
      WechatService.getMessageAndContactFileID()
        .then(({ messageFileID, contactFileID }) => {
          WechatService.getUserContacts(contactFileID)
            .then((contacts) => {
              this.allContacts = contacts || [];
              this.contactsHashObject = WechatService.getContactsHashObject();
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
  .main {
    background: #fff;
    height: 100vh;
    padding-left: 70px;
  }
  .main-h {
    -webkit-app-region: drag;
    margin-left: -70px;
    width: 70px;
    background: #262626;
    height: 100%;
    float: left;
    position: relative;
  }
  .main-menu {
    padding-top: 30px;
  }
  .main-menu a {
    display: block;
    cursor: pointer;
    font-size: 14px;
    color: #999;
    height: 48px;
    background-size: 24px;
    transition: background-color .25s ease;
    position: relative;
  }
  .main-menu a:after {
    content: "";
    position: absolute;
    top: 11px;
    bottom: 11px;
    width: 3px;
    left: 0;
    transition: background-color .25s ease;
  }
  .main-menu a.active {
    background-color: #000;
  }
  .main-menu a.active:after {
    background-color: #fa8919;
  }
  .main-menu a.active, .main-menu a:hover {
    background-size: 24px;
  }
  .main-menu a .img, .main-menu a img {
    display: inline-block;
    width: 42px;
    height: 42px;
    margin-top: 11px;
    border-radius: 100%;
  }
  .main-menu a.main-menu-mine {
    height: 64px;
    text-align: center;
  }
  .main-menu-task {
    background: url(data:image/png;base64,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) no-repeat 50%;
  }
  .main-menu-task.active, .main-menu-task:hover {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAABRhJREFUeAHtnH+IFVUUx33+zKQCdcnSCCtwsdYw/EPE/lRIkiQII9xIZFMhIxTMxX9alBJUpEBEKyElIhKWYtf6IxKhLaT8QyRKRfqj1V229TeSu+u6fY4793F23s67b3Z37szs3gPfd8+9595zz/m+M/Pezsy+ceO8eAY8A6OZgb6+vmZwDwwmLQyOTzP/Qpqbk/xE9u8CUST0YptWKBRkTioSFZirYCawUUeZzf7GJiSNLaFyqsFe0Als0s6EXeCZUc8SSc4E34OhiJynjoOqUUsUyTUNhZnQmuMuCYp1kibQ+QT3KpgHHo4IVM4ZjZxYj4btrO9mbFJ4PGa/B9+T9Rr8is8G8KweD+k36P8JjrH+Qsg2vC4BTAW7wV1QifQyqeRQqGRhJXPC2bBmTSXrgjndtA1guG9UfxjiCJwCcaSVyQ8MkkgcH5FzB/G7mMmVvnnG7wkU66e49RDDyU4C2q6CakKX88AlNaZVOcROUcadelB0fLXRzAqPx+y34fvx8Bp8y2EviJInMLwClqkJ9fjapfolalmC2FSSaQXyfUXkHRzu71fjv+JvKavWggHnkBie5Bz2GTH8GmPNgKnEsI2Bj4JB8TcbfyVv5oBFUR2c1QIjv0TNy9s4CZ02SdG+US5+2zEoZWmkxSijoD2pcnhS6SWqjSB9KNwuWZ3fgZsq9ClKL1FtBJUsGGsDniDLO+4J8gRZGLCYfQV5giwMWMy+gjxBFgYsZl9BniALAxZzLiuIPzBXgOcsuY2IOXcEQcwhMm8GP6M/OiIslHGSK4IgRK6H1wX5PEI7s0xuI2LKDUFBtRxUWR/hQtcfqp+ImhuCyP5TYCrmH/R3E2Ek5DQXBFE964h7ZRB7H+1bVI/cxklcMk8Q5MyFhX2KiY8h5yfVT1TNNEGQI/F9AR4KWJAbf/WB7qTJNEEwsAW8GDBxl/ZNqudO0HfSZJYgqqcGBnYoFnZAzu+q70TNJEGQIzcLjgJzQf039A+dMBLaxAlBJLwHdID3QvtHdRswPB8Y/6OtpXrkEHMuiRMEKZPIahOoAvvory6XJfYl2LeqOVsh55zqO1UTJ4jkesioUWV1GBIWqH5RZXwanSPAxPUj+v7ihBQUE0jSW7/NBqYKHkRvhIzpg2y6l7Gng/HrtGshWL4YpiZOCCJJuZO5CtwKMn2K9itIKu6P/hJj6wO7NPKghDw4kaoUA0w6CpL9iz1qgamI5ej3P5kgZwb658DIN8z/0nTSbJ0RJEmS9Lc0+rvN+5DzGmMHwGNApB1svK9l4GViCjF8wJ4vgJeDvaVS5JPOyDqIvGI6abdOK0iSJXk5xNaA89JHNDmHsDt9irU/hOhX5wRJKJAglyr0SVuGL4LNomRJUiFICIAk+ctcKqkL3BadMWkzJWmcg4oEQMh3nKTnMNCLfq1oyJCSKkHCA8QM7QFKRySmdog5ym/Y23iCLBR6gjxBFgYsZl9BniALAxazryBPkIUBi9lXkCfIwoDF7CtomATdU+snKD3vqs5F51iSl62C/lUrnDwTqPZLUtX/Ha1zjLcnlyIWACPy38KL4nnI3mxyWAi6TFK05g7u0ILFgfzagZGrKBuAXMPJlRDzbFAH9M9h/GBLomCbgMNZzDkLzONvtiV5sV8l0BquR10uF7DtHCQXtOQ2zDJwppyjnNnkDV9uI0dyslaQSZxKkquP8hDC66AaRP00BaZMitzdldvfX4NPIEeeGfDiGfAMpMvA/8rirFpvxSeSAAAAAElFTkSuQmCC) no-repeat 50%;
  }
  .main-menu-customer {
    background: url(data:image/png;base64,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) no-repeat 50%;
  }
  .main-menu-customer.active, .main-menu-customer:hover {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAABmNJREFUeAHtm/urVFUUx2e0h5nZwzKKksQMel4KrR+iNwbRwwgp6zdN+iH/gaAI7ZcorB+ii1BG9UsPjEKioIIrFhkEUhBKdMOuWhZWYnW99tLps6Y54/ecffbM2TNnrnfOnAWLs2evx17re9Z+nDMzlUpJJQIlAiUCJQJTFoFqHpHVarVz8bMgD185+thdrVZ3deuva4AA5yqC2Aqf2G0wOdsfxt+tgDTSjd9p3Rg3bIe4TjVwLLTpsN28rui4rqz/N36DyzXwJTn4ytPFTpxtyNNh6atEoESgRGCyEQja5tnSTyLAjfDVcJDtZCfmGe9b+pex9f/gkTvdobvYjXi43fHSPx1nEupy+JmsIYeegz7Hsd2FfqVfCfyDkOCDpwnTzGzOgINtQwLrke4Bpte/PfJdui0RKBEIR8C7jrDWXIm7h2B7zpoLhy7omExp+ovo9sAfwcOsTfvTonUAAhjb+h+FH4NDjwFpY/RD316CXAlIzg4XA6ixQ72D8tJ+yKoHMa4CpJfUbxKgBxFuEIV3aa+Ht8P/SH8RmqeSxGJ4LTy/kZBNu4WAZFPPJSroaziiYVejeD0kOwvWvNelZonS+REyXCfgWamKBewk16WS+1eaou5M54hglDIbl89Fb9ojVETnRQ27KkC6Yx1UpQFoazEoDjGAJgQIe60xSKT5Kg4xgA4JImog3YVtzpTMFAcvQGogtoVtakF4AdLSUoPCoiKJab6KQ+xRQpHLpYLYOu0wtgReCM+Df4RH4c3skj9xnSqk+SoOR+MjmWlyFjhyVNJZC1/3wHvFpzZ/48Pqzjznb0UsSyS4D3WE5pbGHT2Ckh217WvkKu0Z9P2pylnb2F6P7lvmx2Mzm/7n0ZtgjJc9OhXklyOzd+DNOBu6Na4fY/tJ43O3F51i6RVkIxDQfjii0zsdFQdvR07aXGOnVh0PuznwHy3sDyMzALsm/CyXceyr9CbpQdE6FT2dl02DjI2zc9CzR52TW/ix2M9qIQ8RaQV5F2lzqACpUchgppucEj776T4B02cXd3UF8vtS/NkaaQv9iM8+sF+LQTFwElH0ugHIt/Yk405WcEwOAK/SYdxr0lxjACUDVKGimjlA7rqtXVdkNDgN/aGMur1UU4C0SGInaQtAhWoUEpydeUJ+UHVZiPMe6WoxaJE4U0yFahQSV+gXc3/7nFNdi5DdCWdd08zVL/ALTM+QNxJaDFokzsAqVCMbOCvtQHEMvgBuR/ZNwqdpSoBj36NvgTu5UZdityrNr6dPc9UicaaYCjsJrMKds8Pl455AtNsOe3egb98opJEFPSNNkKEv9AynuSoGPakgi38j/BSsbymtX+kVwPlMO7SNbA9V9AB998IhU+xn9NfAIaQVpLPIGVjRU6OQwepVRHJW4u95DO1XFo94ZM1uQHqTD8a9Jm8F5b7NR5mQ3Pu0FfBIZNctyPdpxzFuazHEYk4CpOWlRsHxU0Fmf7zH8BRP/7Hq1lwVg5ZTTMsuKHDAWYzBs7Bv7bgZnTXIn6OSbCdLJXSuRXA37POjdt/xYT3+OvmCU3ONVZAOYE/zD8MRDceEGT5gOARvihxkuI6jY689FiTd0zcXPgSHkP2eIJgYYFQGuVAdJKeYoqeoqo3Txrk9MryG4Av4LkfB32FP66vhb7B/HbY3kBGdQCNL5UT6dtWpov3t2mqnGDgB6PxTo3YDPIHC/e2UWsjtRtmPK7fB60yPqfI9gC2jaZwFqDH0noQ7IS2GlgCpUI3aDTq/nUJGuY5vIG3CzrjXpMWgReLcGQ1QjdoFaGcae107r6Fo72vS2E7Paf321yWbni/Ck0pUaZUBoxN7jZtiTwJNSpauopcZIJxux6NNhX4kzTMGjiWTyyLdj6hIzAqQFkhdJQmQKqih+CtcU9daXWJSAVIFNSwcKpKQFoIWSCpAqqCG4q9wTc1TC6QtQHaIGwTSPLVA6rnH1iB2o4P07mugMpMtcM4AIKS/KBtL5hsDqCG0LTuiG6JGga/XSW47pF1vJs9B1rkZvqkurVSepop20/4StgNekci+ebkNXilJ2TvwGNkpMkYAMpsOe3Vgf3kaJBphibklmbAzxVD6HaUV8HhSucCfd5KbvVVwyKmgSINKupi2PWMtgi+CHTDp62eyZ0f7dclWeC2FcaCfkyljLxEoESgRKBEoEXAR+A8MFLLXoLAoZQAAAABJRU5ErkJggg==) no-repeat 50%;
  }
  .main-menu-chat {
    background: url(data:image/png;base64,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) no-repeat 50%;
  }
  .main-menu-chat.active, .main-menu-chat:hover {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAABOdJREFUeAHtm8trFEEQxjc+QCUH0fgGIT4uHgQxiih6U1AP8RARL6KiKHgQT+opEC+JJ2/+A958oYivgErEg3pMFARRL0aigoqiGI3xV9npSfXs7vRkd5Pdme2Cj66Zruqp79ve3pne3VzOm1fAK+AV8Ap4BbwCXgGvgFegiAJNRc4lOjU6OrqKwHawDSwDS8AiMB3U0ka4+BAYDNBHe6Opqek17eQaokwDh8EASJtJzVL7tElRiYF3gTQKQ9mWCYedVROJwWTW9FiXyB/8oLkCDoD1YCmo9dsrJzUEtbTRSm1So9QatW5OVDabGKAZ3IqM/JXjM2BO1V6FSR5Iag1qltq13eSguazLkygzJyrONc7NL2vAOkiS2oFw0CYiTXwmkXRej4LfBcr+1KsDfcZKEA7gHNDWPaH6yNyts/G7JjRACoLhFBUp2cJNoixyL4CxqzipnznR10w4geuGJG0/cL/VCDqikr7gz4sOnpVjuMmapBfuQ05uJOjZc9qZkPIA+J4FxgZi6RC12kTSfgezYxMy0AlHuQXQ90krNa3oe26P6rzL88svdZxJF44/IXZPkdMa5KICbVWBN5WfdVdzlYfv0KICLQ17crmXys+6+0IR1BoUzCDdKdsFjWKaq9YgZ93fsFjJXoqZVdN5f/5rBIXgLQ/ZfwOuI/CeYXhHBRoNO4gyfiO0iFSUu5ktjaBBWRy9QA7ZvEBeIIcCju5wtXbEJe5mrdtM8AbwEfSy1n9Omlyr3KT1yX5uaImTgkASZ4LL4QB55xPNdtdYxNQkV9el69bnLT9RkJUxfkBup85XvojUMh5Z6NHfqeK1O6m5uhJ9UX3e8hMFWRnjB+S+0vkRf/94ZKFXq1xdia5Xn6/mp9hCPXDEj+uT0Lj+uL5KcyNlFh5WU6DnhcOHZ+L6JCiuP66v0tywwEROqWmWJJncdeC3HiPwL7vya5Wr69J16/OWnyjIyrAPAqL3aWUvW9akTjDTjip+RJwIPOW5phquHZo5J631QCoRppP7F6vPnM9qW4p7NdegTGrnBXK8rF4gL5BDAbpZf/TXW9Y3OX4G5fWTnw8a+2Acab1AeTX0Rr3ewPcCBbNFtmiMvTOOtH4G5dXQ36be0QJZvtwsGbM6MnwA31YwEvAepp1bkm4QNNaUDMpYB2QvKd63Y+mpwPCRIzYh5Z3wbQP/FO+NsZRUYOYFgmsLeKM4O3cdKtqTjlW+zjoRZRZ4pMSRX5mtcJapEjI7g+AoP3h/prjKAp34B5xhnlPNFAZArgMMhiTzzqnEVHRi4qQ6D4STvJ3awVPND18+0o+4yq/6F4fmgly8FX8tmOqNN+G0CMjjwxqwA0T/NiFfanawJ/iYNtaqKhCiLOdqe8E+IN+u1pvJk/oF0IM435IUV7FAiCJ/pusAIsomMNUzhks6rZ+IG+AiwlgPo67MsgRClMUMbETZgl9MlGHOyxT+DqbS5JdiQ0C2Ld6DPkR5Q1u5QTy06Gh0LADHwUNgnl1wLZOF7w44CEo/00QHT8sxpISgMVn95af6R0Ev+AuKmZy/D+QvDJn928LYawhBfQP1luM/oJjJDHoAjoEFaZkAFdcJ2ZOglMlDXR84AeRjtDEN8t3A/HdBRHkCRDi9LdmY4hjWiCH/VV0N9G6/6fatV8Ar4BXwCngFvAKpUOA/NvG0uBZMNq4AAAAASUVORK5CYII=) no-repeat 50%;
  }
  .main-menu-note {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAwhJREFUeAHtnDtvE0EUhe+sHQokiISoUlNQQYN4/AF+AA0SkCoFfmBXdCCRAqio7PghoVQ2kWj4E2kQoqSkRKkQKEICZJwd7qwdJdY+TvzQxHbOStGs58zdmfnmrJOZzY4IDxIgARI4PQLmpFW/bTav/ZPwtrF27aQx81jOWtuTwHwRye2WSqWfqI0QULfbvfhr/0fTWnmILrZIujHyXTv/uFCufshqd5AlOm0Z4bh+6YBfDq28b7frN9zntCOfJrj8drt2PewPnGOMsXrZHRHzNSlGrftc83P6c6BlXyaVmYs8Y1YktPes2Kvanrzty2tN76a1LRNQGAa3RMJhrN0plquP0i7U3Kq9GGq5YrmymVZuHvK3t+uN3l/zTQfViJGbLh0YIN66zFts9As52TnxS85/zsZGZU+h/HYt1XS10+mcT2t1JqC0oLOUT0BgtAmIgAABINNBBAQIAJkOIiBAAMh0EAEBAkCmgwCgzMkqiB1bbjW3XkkYPtVlgXNjB08QoOs9ujgWvCmWnjybIDwK8eognRhWfcFxvXN1uTonhePivALSJYVaNKrTtHiMWFeXq3OMkFhRr7fY0OoT2z3Weg8ZXh3koT8zr4KAAFICIiBAAMh0EAEBAkCmgwgIEACy1z8UORcDo8G5GADEuRgAxLkYALSIMn/Ng1EjIAICBIBMBxEQIABkOoiAAAEgL9RcbBbPuQCPmOz1Fpt2LjaL51wxAiDDK6Bp52KzeM4FeMRkr7cY52Ix/ouf4fUWW0RcBARGjYAICBAAMh1EQIAAkOkgAgIEgEwHERAgAGQ6iIAAASDTQdMA0pel947i7ZWj88U+09fC13RtKnrTWdP99fX16A3opF5lrgetSPBR9+sYxpkHrYb7n+zk18N1tfBAxWhjgVajvjkMmr9ENxbo/Yk2FtD1Nz2sfFJIuliZfAwKJWtRrkLpLtu+Hce62w/y5k6hUPl8LG/kFH4HXVi9VNKNQN6NRC3BB7e5SWDkfhYc103ooEMWZ3V7nMP+MyUBEiCB0yDwHxJV3Cx/4mwXAAAAAElFTkSuQmCC) no-repeat 50%;
  }
  .main-menu-note.active, .main-menu-note:hover {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAo5JREFUeAHtnD1Ow0AQhQl/BQX0qSmoQgsX4AA0SNCDRMEFoKCAC1BwAqDkApQ0CFFQUFJTIQENEggIb1BGCrHGL7KjjZ28kUZr7+x6x58fkdZmd2JCJgIiIALDI9Dod+h2u91C2xV4s98+FW33ibwe4NeNRuOF5UgBAcw8LnIK32IXq1n8GfnuANJlXt79ADrDBUYNjjP5wsEqIN15RW+ZCwjqWUaH+06nNsoL+GPnvLc4QMUU/Bt+1Bus0PkMclmHL3VyugKgtUL5AdA23M2UFJo3sjJsVJEAUmzCfyxX2Cs8FMokybn7BzlSDrlE9cJQzBOyeu9ktoByLsqSAYr6jU29AJFHLUACRAiQsBQkQIQACUtBAkQIkLAUJECEAAlLQVUChEnhMfwDnspsrGPCIDecWkF7yGY2N6PBBm0sG7OwpQZ0gkztlWcqs7FszMI2XbhngY54zbCPbua1sdQKqg0YT1SAnERQClAAxqsFyEkEpQAFYLxagJxEUApQAMarBchJBGVSQDYvgmsuFjwMq9ZcLAeOhTQXywOkuVgenZrGkv5I15GRAJGnJkACRAiQsBQkQIQACUtBVQI0gLlY6e9chEcmnFpBZedipb9zZQiQitSAys7FSn/nIjwyYX0XyyD5X5FaQf9Hr8GZAJGHJEACRAiQsBQkQIQACUtBAkQIkLAUJECEAAlLQQJECJCwFCRAhAAJMwXZ6mC3RT+oe4k3m7aa21c6v+HYV0Bnbo29D7rp6rGJC9tptDzcNhT421gA7Q6tYUXNNxbwtfK3+J+BcK2/NwrvBTd7huDYbk3B/sQM3C783A5GzGxzkw2oJ9y3w+6XKsihQEktHI/d9jh+/ypFQAREYBgEfgFTCbLmGf0EzgAAAABJRU5ErkJggg==) no-repeat 50%;
  }
  .main-c {
    width: 100%;
  }
  .main-c, .main-c>section {
    height: 100%;
  }
  .vd-my-task {
    height: 100%;
  }
  .ichat-menu {
    -webkit-app-region: drag;
  }
  .vd-nav {
    -webkit-app-region: drag;
    width: 100%;
    height: 50px;
    background: #f8f8f9;
    border-bottom: 1px solid #dbdbdb;
    box-sizing: border-box;
  }
  .vd-nav-list {
    font-size: 15px;
    color: #9f9f9f;
    float: left;
  }
  .vd-nav-list li {
    padding-top: 10px;
    line-height: 40px;
    float: left;
    text-align: center;
    cursor: pointer;
    margin: -2px 10px;
    transition: all .2s ease;
    border-bottom: 2px solid transparent;
  }
  .vd-nav-list .active {
    border-bottom: 2px solid #ed6c00;
    color: #fa8919;
  }
  .ichat-content {
    height: 100%;
    padding-top: 50px;
    margin-top: -50px;
    box-sizing: border-box;
  }
  .ichat-content-w {
    height: 100%;
  }
  .ichat-chat {
    height: 100%;
  }
  .ichat-chat-conversation {
    height: 100%;
    float: left;
    width: 260px;
    border-right: 1px solid #f0f0f0;
    background: #fff;
    box-sizing: border-box;
  }
  .ichat-chat-conversation-search {
    border-bottom: 1px solid #f0f0f0;
    overflow: hidden;
  }
  .chat-search-w {
    height: 30px;
    width: 210px;
    margin: 10px auto;
    border: 1px solid #d5d5d5;
    border-radius: 20px;
    box-shadow: inset 0 1px 4px 0 rgba(0,0,0,.1);
    background: #fefeff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    background: #f8f8f9;
    transition: border-color .2s ease;
    outline: none;
  }
  .ichat-chat-conversation-search .chat-search-w {
    margin: 10px;
    height: 31px;
    border-radius: 4px;
    border: 1px solid #f8f8f9;
    box-shadow: none;
  }
  .chat-search-w i {
    line-height: 34px;
    margin-left: 8px;
    color: #cdc9c5;
  }
  .chat-search-w input {
    border: none;
    outline: none;
    height: 28px;
    width: 160px;
    font-size: 12px;
    margin-left: 5px;
    color: #4a4a4a;
    background: transparent;
  }
  .ichat-chat-conversation-search .add-group {
    float: right;
    width: 30px;
    height: 30px;
    background: url(data:image/png;base64,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) no-repeat 50%;
    background-size: 20px;
    margin: -41px 4px 0 0;
    color: #737373;
    font-size: 14px;
  }
  .ichat-chat-conversation-w {
    height: 100%;
    overflow-y: auto;
    padding-top: 54px;
    box-sizing: border-box;
    margin-top: -54px;
    pointer-events: none;
  }
  .ichat-chat-conversation-c {
    height: 100%;
    overflow-y: auto;
    pointer-events: auto;
  }
  .ichat-conversation li {
    padding: 10px;
    height: 64px;
    cursor: default;
    border-bottom: 1px solid #e7e7e7;
    position: relative;
  }
  .ichat-conversation li:after {
    content: ' ';
    display: table-cell;
    clear: both;
  }
  .ichat-conversation li.star {
    background: #f1f1f1;
  }
  .ichat-conversation li.active {
    background: #edeae7;
  }
  .ichat-conversation .img {
    width: 44px;
    height: 44px;
    float: left;
    position: relative;
  }
  .ichat-conversation .img img {
    width: 44px;
    height: 44px;
    background: #f0f0f0;
    border-radius: 100%;
  }
  .ichat-conversation .img.group img {
    border-radius: 0;
    background: transparent;
  }
  .ichat-conversation .txt {
    float: left;
    margin-left: 14px;
    width: 180px;
  }
  .font-overflow, .ichat-conversation .txt .p p, .ichat-conversation .txt h2 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ichat-conversation .txt h2 {
    font-size: 14px;
    color: #4a4a4a;
    line-height: 24px;
    height: 24px;
  }
  .ichat-conversation .txt .p {
    font-size: 12px;
    color: #737373;
  }
  .ichat-conversation .txt .p p {
    margin-right: 15px;
  }
  .ichat-detail {
    margin-left: 260px;
    height: 100%;
    position: relative;
  }
  .ichat-detail-h-w {
    height: 53px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
  }
  .ichat-header {
    height: 100%;
  }
  .ichat-header-user {
    float: left;
    margin-left: 20px;
  }
  .font-overflow, .ichat-header-user h2 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ichat-header-user h2 {
    font-size: 16px;
    color: #4a4a4a;
    line-height: 50px;
    max-width: 400px;
  }
  .ichat-header-menu {
    float: right;
    height: 50px;
  }
  .ichat-header-menu a {
    height: 24px;
    width: 24px;
    float: left;
    margin: 0 10px;
    font-size: 16px;
    text-align: center;
    border-radius: 3px;
    margin-top: 15px;
    transition: all .2s ease;
  }
  .ichat-header-menu .icon {
    transition: all .2s ease;
    color: #cdc9c5;
    position: relative;
    top: 3px;
  }
  .ichat-detail-c {
    height: 100%;
    margin-top: -54px;
    padding-top: 54px;
    box-sizing: border-box;
  }
  .ichat-detail-c>section {
    height: 100%;
    overflow-y: auto;
  }
  .ichat-messages {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .ichat-message {
    margin: 10px 0;
  }
  .ichat-message:after {
    content: "";
    display: block;
    visibility: hidden;
    clear: both;
  }
  .ichat-message-from {
    float: left;
    margin: 5px 10px 0 20px;
    position: relative;
  }
  .ichat-message-from img {
    height: 36px;
    width: 36px;
    border-radius: 100%;
    pointer-events: none;
  }
  .ichattypegroup .ichat-message-from img {
    cursor: pointer;
    pointer-events: all;
  }
  .ichat-message-content {
    margin: 0 20px 0 61px;
    border-radius: 5px;
    padding: 5px;
  }
  .native .ichat-message-content {
    margin: 0 35px 0 61px;
  }
  .ichat-message-content.withhover:hover {
    background: #f8f8f9;
  }
  .ichat-message-content-h {
    height: 20px;
    line-height: 20px;
  }
  .ichat-message-content-h h4 {
    color: #777;
    font-size: 12px;
    float: left;
    font-weight: 400;
  }
  .ichat-message-time {
    float: left;
    margin-left: 10px;
    font-size: 11px;
    color: #737373;
  }
  .ichat-message-time-star {
    float: left;
    margin-left: 10px;
    font-size: 13px;
    display: none;
  }
  .ichat-message-time-star a {
    color: #737373;
  }
  .ichat-message-content-h .starBox {
    position: relative;
  }
  .ichat-message-ope {
    float: right;
    font-size: 14px;
    display: none;
  }
  .ichat-message-content.withhover:hover .ichat-message-ope, .ichat-message-content.withhover:hover .ichat-message-time-star {
    display: block;
  }
  .ichat-message-ope a {
    display: inline-block;
    color: #fdba78;
    margin-right: 5px;
    cursor: pointer;
    transition: color .1s ease;
  }
  .ichat-message-content-c {
    padding: 5px 0;
  }
  .selectable {
    -webkit-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }
  .iui-paragraph pre {
    margin-bottom: .5em;
    white-space: pre-wrap;
  }
  .ichat-message-content-c p, .ichat-message-content-c pre {
    margin-top: 0;
    font-size: 14px;
    word-break: break-all;
  }
  .iui-paragraph pre:last-child {
    margin-bottom: 0;
  }
  .ichat-message-content-img {
    margin-top: 5px;
    font-size: 0;
    border-radius: 5px;
    overflow: hidden;
    display: inline-block;
    position: relative;
    cursor: pointer;
    max-width: 100%;
  }
  .ichat-message-content-img:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 5px;
    transition: background .15s ease;
  }
  .ichat-message-content-img img.success {
    opacity: 1;
    width: auto;
  }
  .ichat-message-content-img .iui-icon {
    font-size: 30px;
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -21px 0 0 -15px;
    display: none;
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
  .chats {
    width: 200px;
  }
</style>
