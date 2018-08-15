import { Message } from 'element-ui/lib';
const Excel = require('exceljs');
const path = require('path');
const os = require('os');
const readFilePath = path.resolve(__dirname, '../assets/alpha__bug_template.xlsx');

let bugs = [];

function exportBugs() {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile(readFilePath)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        bugs.forEach((bug) => {
          worksheet.addRow([bug.module, bug.title, bug.type, bug.source, bug.detail]);
        });
        workbook.xlsx.writeFile(path.resolve(os.homedir(), `Downloads/Alpha-Bugs-${(new Date()).getTime()}.xlsx`));
        bugs = [];
        Message.success('Bug文档生成完毕');
        resolve(bugs);
      }, (error) => {
        reject(error);
      });
  });
}

export default {
  exportBugs,
  addBug(bug) {
    bugs.push(bug);
  },
  getBugs() {
    return bugs;
  },
};
