<template>
  <li class="ichat-message">
    <div class="system-message">
      <span>{{chat.Message}}</span>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'system-message',
    props: {
      chat: Object,
    },
  };
</script>

<style>
  .system-message {
    text-align: center;
    font-size: 13px;
    color: #ccc;
  }
</style>