import * as C from '../constants/index';
const fs = require('fs');
const os = require('os');
const path = require('path');
const plist = require('plist');
const sqlite3 = require('sqlite3').verbose();

const PATH = path.resolve(os.homedir(), C.ROOT_DIR, '7a99001c2b3b7136d02a561ad1815a7a4d156b9a');
const InfoPlist = plist.parse(fs.readFileSync(path.resolve(PATH, C.INFO_PLIST_FILE), 'utf8'));

let messageFileID; // 消息文件ID
let contactFileID; // 通讯录文件ID
let contacts; // 通讯录
/**
 * 根据contactFileID、获取通讯录
 * @param contactFileID
 */
function getUserContacts({ contactFileID }) {
  const contactFolderName = contactFileID.substr(0, 2);
  const db = new sqlite3.Database(path.resolve(PATH, contactFolderName, contactFileID),
    sqlite3.OPEN_READONLY);

  db.all(`
        SELECT userName, dbContactRemark, dbContactProfile, dbContactChatRoom FROM Friend
        `, (error, rows) => {
    if (!error) {
      contacts = rows;
    } else {
      // Do nothing
    }
  });

  db.close();
}

/**
 * 消息文件ID/通讯录文件ID
 */
function getMessageAndContactFileID() {
  const db = new sqlite3.Database(path.resolve(PATH, C.MANIFEST_FILE), sqlite3.OPEN_READONLY);

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
      getUserContacts({ messageFileID, contactFileID });
    } else {
      // Do nothing
    }
  });

  db.close();
}

getMessageAndContactFileID();

export default {
  /**
   * 获取手机信息
   * @returns {*}
   */
  getProductName() {
    return InfoPlist['Product Name'];
  },
  getMessageFileID() {
    return messageFileID;
  },
  getContactFileID() {
    return contactFileID;
  },
  getContacts() {
    return contacts;
  },
};
