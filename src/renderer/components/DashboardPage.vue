<template>
  <div id="wrapper" class="backup-finder">
    <div class="dashboard-title">选择手机备份</div>
    <div class="backup-folders">
      <div class="backup-folders-wrapper" v-if="foldersInfo.length">
        <h1>发现手机备份</h1>
        <div class="backup-folder-wrapper" v-for="backupInfo in foldersInfo" @click="viewHistory(backupInfo)">
          <div class="iphone">
            <img src="~@/assets/iphone.png">
          </div>
          <div class="phone-info">
            <div class="device-name">
              <h2>设备：{{backupInfo['Display Name'] || backupInfo['Device Name']}}</h2>
            </div>
            <div class="product-name">
              {{backupInfo['Product Name']}}
            </div>
            <div class="phone-number">
              {{backupInfo['Phone Number']}}
            </div>
            <div class="last-backup-date">
              {{backupInfo['Last Backup Date']}}
            </div>
            <div class="guid">
              {{backupInfo['Target Identifier']}}
            </div>
          </div>
        </div>
      </div>
      <div class="no-mobile-backup-found" v-else>
        <h1>没有发现iTunes手机备份</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import WechatService from '../service/wechat-service';

  export default {
    name: 'landing-page',
    data() {
      return {
        foldersInfo: [],
      };
    },
    methods: {
      viewHistory(backupInfo) {
        WechatService.selectBackup(backupInfo);
        this.$router.push('chats-history');
      },
    },
    created() {
      // this.foldersInfo = WechatService.findMobileBackupFolders();
      this.$nextTick(() => {
        this.foldersInfo = WechatService.findMobileBackupFolders();
      });
    },
  };
</script>

<style>
  .backup-finder .dashboard-title {
    -webkit-app-region: drag;
    text-align: center;
    font-size: 13px;
    background-color: #252526;
    color: #ccc;
    padding: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    height: 25px;
    line-height: 19px;
  }
  .backup-folders {
    height:  calc(100vh - 25px);
    overflow: auto;
    background-color: #fff;
  }
  .backup-finder h1 {
    text-align: center;
  }
  .backup-folders .backup-folder-wrapper {
    display: flex;
    width: 600px;
    margin: 16px auto;
    cursor: pointer;
    padding: 16px;
  }
  .backup-folders .backup-folder-wrapper:hover,
  .backup-folders .backup-folder-wrapper:focus,
  .backup-folders .backup-folder-wrapper:active {
    border-radius: 12px;
    box-shadow: 6px 6px 22px #ccc;
  }
  .backup-folder-wrapper .iphone {
    width: 180px;
  }
  .backup-folder-wrapper .iphone img {
    width: 100%;
  }
  .no-mobile-backup-found {

  }
</style>
