<template>
  <div id="wrapper" class="main native">
    <main class="main-h">
      <div class="main-menu">
        <a class="main-menu-mine">
          <img src="http://wx.qlogo.cn/mmhead/ver_1/ozntzvibcWdPugmdr7ngLwLkuUt2L6sel2nLbH4pXu4opERGCicDHsvgR7kzWBMY8EibggYnqg9of4wVLIQNZywHdmlPV8tMwK3lvQb2UbN7GQ/132">
        </a>
        <router-link to="/chats-history" exact class="main-menu-chat"><i></i></router-link>
        <router-link to="/chats-history/contacts" class="main-menu-customer"><i></i></router-link>
        <router-link to="/chats-history/bugs" class="main-menu-task"><i></i></router-link>
      </div>
    </main>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
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
    background: #2e3238;
    height: 100%;
    float: left;
    position: relative;
  }
  .main-menu {
    padding-top: 30px;
  }
  .main-menu a {
    position: relative;
    display: block;
    cursor: pointer;
    transition: background .25s ease;
    text-align: center;
    margin: 18px 0;
  }
  .main-menu a i {
    display: inline-block;
    vertical-align: middle;
    width: 35px;
    height: 35px;
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
  .main-menu-task i {
    background: url(../assets/wechat@2x.png) no-repeat;
    background-position: -376px -322px;
    background-size: 487px 462px;
  }
  .main-menu-task.router-link-active i, .main-menu-task.active i, .main-menu-task:hover i {
    background: url(../assets/wechat@2x.png) no-repeat;
    background-position: -304px -281px;
    background-size: 487px 462px;
  }
  .main-menu-customer i {
    background: url(../assets/wechat@2x.png) no-repeat;
    background-position: -220px -96px;
    background-size: 487px 462px;
  }
  .main-menu-customer.router-link-active i, .main-menu-customer.active i, .main-menu-customer:hover i {
    background: url(../assets/wechat@2x.png) no-repeat;
    background-position: -304px -246px;
    background-size: 487px 462px;
  }
  .main-menu-chat i {
    background: url(../assets/wechat@2x.png) no-repeat;
    background-position: -150px -96px;
    background-size: 487px 462px;
  }
  .main-menu-chat.router-link-active i, .main-menu-chat.active i, .main-menu-chat:hover i {
    background: url(../assets/wechat@2x.png) no-repeat;
    background-position: -185px -96px;
    background-size: 487px 462px;
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
    width: 160px;
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
    -webkit-app-region: drag;
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
  .ichat-message.self .ichat-message-from {
    float: right;
  }
  .ichat-message.self .ichat-message-content {
    margin-left: 35px;
    margin-right: 60px;
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
  .empty-message {
    text-align: center;
    font-size: 13px;
    color: #ccc;
    margin: 18px auto;
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
  .suggestion-menus {
    max-height: calc(100vh - 50px);
    overflow: auto;
  }
  .suggestion-menus.el-popper .popper__arrow {
    display: none;
  }
  .suggestion-menus.el-popper .no-suggestion {
    display: none;
  }
</style>
