<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'wechat-analyser',
  };
</script>

<style>
  /* CSS */

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    color: #4a4a4a;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }
  body, button, input, pre, textarea {
    font-family: PingFang SC,Hiragino Sans GB,Microsoft Yahei,sans-serif;
  }
  .ichat, .vd-approval-detail, body, html {
    height: 100%;
  }
  li, ul {
    list-style: none;
  }
</style>
