import * as C from '../constants/index';
const fs = require('fs');
const os = require('os');
const path = require('path');
const plist = require('plist');
const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const MOBILE_BACKUP_FOLDER_PATH = path.resolve(os.homedir(), C.ROOT_DIR);
let SELECTED_BACKUP_FOLDER_PATH;

let messageFileID; // 消息文件ID
let contactFileID; // 通讯录文件ID
let contacts; // 通讯录
let chats; // 聊天
let contactsHashObject; // 使用Hash形式、读取内容

/**
 * 消息文件ID/通讯录文件ID
 */
function getMessageAndContactFileID() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      path.resolve(SELECTED_BACKUP_FOLDER_PATH, C.MANIFEST_FILE), sqlite3.OPEN_READONLY);

    db.all(`
  select f.fileID, f.domain, f.relativePath from Files as f
  where f.domain = '${C.WEIXIN_APP_DOMAIN}'
  and (f.relativePath like '%${C.WEIXIN_SQLITE_DB_MESSAGE_FILE}'
  or f.relativePath like '%${C.WEIXIN_SQLITE_DB_CONTACT_FILE}')
  `, (error, rows) => {
      if (!error) {
        if (rows[0].relativePath.endsWith(C.WEIXIN_SQLITE_DB_MESSAGE_FILE)) {
          messageFileID = rows[0].fileID;
          contactFileID = rows[1].fileID;
        } else {
          messageFileID = rows[1].fileID;
          contactFileID = rows[0].fileID;
        }
        resolve({ messageFileID, contactFileID });
      } else {
        reject(error);
      }
    });

    db.close();
  });
}

/**
 * 抽取有效名称
 * 例1： remark 取值：[10, 14, 81, 81, 233, 130, 174, 231, 174, 177, 230, 143, 144, 233, 134, 146]
 * remark[0]值——"10"——是指示位，remark[1]值"14"是长度，
 * 后面14个字节remark[2:16]取值[81, 81, 233, 130, 174, 231, 174, 177, 230, 143, 144, 233, 134, 146]，
 * 使用Buffer.from([81, 81, 233, 130, 174, 231, 174, 177, 230, 143, 144, 233, 134, 146]).toString()
 * 结果为"QQ邮箱提醒"
 * 例2： remark 取值：[10, 6, 231, 159, 179, 231, 142, 143, 18, 8, 115, 104, 105, 108, 101, 48, 49, 48,
 *        26, 0, 34, 0, 42, 0, 50, 5, 115, 104, 105, 108, 101, 58, 0, 66, 0]
 * (1) remark[0]值"10"是指示位，remark[1]值"6"是长度，
 * 后面6个字节remark[2:7]取值[231, 159, 179, 231, 142, 143]，
 * 使用Buffer.from([231, 159, 179, 231, 142, 143]).toString()
 * 结果为"石玏"
 * (2) remark[8]值——"18"——是指示位，remark[9]值"8"是长度，
 * 后面8个字节remark[10:17]取值[115, 104, 105, 108, 101, 48, 49, 48]，
 * 使用Buffer.from([115, 104, 105, 108, 101, 48, 49, 48]).toString()
 * 结果为"shile010"
 * (3) remark[18]值——"26"——是指示位, remark[19]值"0"是长度
 * (4) remark[20]值——"34"——是指示位, remark[21]值"0"是长度
 * (5) remark[22]值——"42"——是指示位, remark[23]值"0"是长度
 * (6) remark[24]值——"50"——是指示位, remark[25]值"5"是长度
 * 后面5个字节remark[26:30]取值[115, 104, 105, 108, 101]，
 * 使用Buffer.from([115, 104, 105, 108, 101]).toString()
 * 结果为"shile"
 * (7) remark[31]值——"58"——是指示位, remark[32]值"0"是长度
 * (8) remark[33]值——"66"——是指示位, remark[34]值"0"是长度
 * @param remark
 */
function parseName(remark) {
  // remark[0] is 0x0a
  const length = remark[1];
  const offset = 2;
  return Buffer.from(remark.slice(offset, offset + length)).toString();
}

/**
 * 解析用户头像
 * @param headImage
 */
function parseImage(headImage) {
  if (headImage[3] !== 0) {
    return Buffer.from(headImage.slice(4, headImage[3] + 5)).toString();
  }
  return '';
}

/**
 * 根据contactFileID、获取通讯录
 * @param contactFileID
 */
function getUserContacts(contactFileID) {
  return new Promise((resolve, reject) => {
    const contactFolderName = contactFileID.substr(0, 2);
    const db = new sqlite3.Database(
      path.resolve(SELECTED_BACKUP_FOLDER_PATH, contactFolderName, contactFileID),
      sqlite3.OPEN_READONLY);

    db.all(`
          SELECT userName, dbContactRemark, dbContactProfile, dbContactChatRoom, dbContactHeadImage FROM Friend
          `, (error, rows) => {
      if (!error) {
        contactsHashObject = {}; // Init
        rows.forEach((row) => {
          row.hashName = md5(row.userName);
          contactsHashObject[row.hashName] = row;
        });
        contacts = rows;
        resolve(rows);
      } else {
        reject(error);
      }
    });

    db.close();
  });
}

/**
 * 根据messageFileID、获取聊天信息
 * @param messageFileID
 */
function getUserChatSessions(messageFileID) {
  return new Promise((resolve, reject) => {
    const messageFolderName = messageFileID.substr(0, 2);
    const db = new sqlite3.Database(
      path.resolve(SELECTED_BACKUP_FOLDER_PATH, messageFolderName, messageFileID),
      sqlite3.OPEN_READONLY);

    db.all(`
    SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'Chat_%'
    AND name NOT LIKE 'ChatExt%' order by rootpage desc`, (error, rows) => {
      if (!error) {
        chats = rows;
        resolve(rows);
      } else {
        reject(error);
      }
    });

    db.close();
  });
}

function queryContacts(keyword) {
  return new Promise((resolve, reject) => {
    const contactFolderName = contactFileID.substr(0, 2);
    const db = new sqlite3.Database(
      path.resolve(SELECTED_BACKUP_FOLDER_PATH, contactFolderName, contactFileID),
      sqlite3.OPEN_READONLY);

    db.all(`
          SELECT userName, dbContactRemark, dbContactProfile, dbContactChatRoom, dbContactHeadImage FROM Friend where dbContactRemark like '%${keyword}%'
          `, (error, rows) => {
      if (!error) {
        contactsHashObject = {}; // Init
        rows.forEach((row) => {
          row.hashName = md5(row.userName);
          contactsHashObject[row.hashName] = row;
        });
        contacts = rows;
        resolve(rows);
      } else {
        reject(error);
      }
    });

    db.close();
  });
}

export default {
  /**
   * 消息文件ID/通讯录文件ID
   * @returns { messageFileID, contactFileID }
   */
  getMessageAndContactFileID,
  /**
 * 根据contactFileID、获取通讯录
 * @param contactFileID
 */
  getUserContacts,
  /**
   * 根据messageFileID、获取聊天信息
   * @param messageFileID
   */
  getUserChatSessions,
  getMessageFileID() {
    return messageFileID;
  },
  getContactFileID() {
    return contactFileID;
  },
  getContacts() {
    return contacts;
  },
  parseName,
  parseImage,
  getContactsHashObject() {
    return contactsHashObject;
  },
  getContactsUserNameMapObject() {
    const contactsUserNameMapObject = {}; // Init
    contacts.forEach((row) => {
      contactsUserNameMapObject[row.userName] = row;
    });
    return contactsUserNameMapObject;
  },
  getChatSessions() {
    return chats;
  },
  loadChatsOf(chatTableName) {
    return new Promise((resolve, reject) => {
      const messageFolderName = messageFileID.substr(0, 2);
      const db = new sqlite3.Database(
        path.resolve(SELECTED_BACKUP_FOLDER_PATH, messageFolderName, messageFileID),
        sqlite3.OPEN_READONLY);

      db.all(`select * from ${chatTableName}`, (error, rows) => {
        if (!error) {
          resolve(rows);
        } else {
          reject(error);
        }
      });

      db.close();
    });
  },
  findMobileBackupFolders() {
    const backupFolders = fs.readdirSync(MOBILE_BACKUP_FOLDER_PATH);
    const backupFoldersInfo = [];
    backupFolders.forEach((backupFolder) => {
      if (fs.statSync(path.resolve(MOBILE_BACKUP_FOLDER_PATH, backupFolder)).isDirectory()) {
        // 获取手机信息
        const InfoPlist = plist.parse(
          fs.readFileSync(path.resolve(MOBILE_BACKUP_FOLDER_PATH, backupFolder, C.INFO_PLIST_FILE), 'utf8'));
        backupFoldersInfo.push(InfoPlist);
      }
    });
    return backupFoldersInfo;
  },
  selectBackup(backupFolderInfo) {
    SELECTED_BACKUP_FOLDER_PATH = path.resolve(MOBILE_BACKUP_FOLDER_PATH, backupFolderInfo['Target Identifier']);
  },
  getSelectedBackupPath() {
    return SELECTED_BACKUP_FOLDER_PATH;
  },
  queryContacts,
  md5,
};
