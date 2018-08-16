import { Message } from 'element-ui/lib';
const Excel = require('exceljs');
const path = require('path');
const os = require('os');
const readFilePath = path.resolve(__dirname, '../assets/alpha__bug_template.xlsx');

let bugs = [];

const MODULES = (['word alpha', 'note', '安装指引', '登录', '账号', 'Chrome浏览器', '大数据',
  '收藏夹', '市场拓展', '实践指引', '项目', '服务报告', '任务', '日历', '计时', '工作类型',
  '律助', '文档', 'alphabox', '客户', '行业雷达', '利冲', '合同库', '项目模板', '任务模板',
  '合同模板', '文书模板', '权限', '部门', '安卓', 'iOS', '享聊', '通知', 'km', '客户端',
  '成就分析', '财务', '报表', '审批', '职级', '帮助中心', '设置', 'chrome插件', '系统',
  '橙信', '培训', '课程', '其他'].map(module => ({ label: module, value: module })));

const TYPES = [
  { label: '缺陷', value: '缺陷' },
  { label: '使用问题', value: '使用问题' },
  { label: '安装问题', value: '安装问题' },
  { label: '需求', value: '需求' },
  { label: '校友肯定', value: '校友肯定' },
  { label: '其他问题', value: '其他问题' },
];

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
  getModules() {
    return MODULES;
  },
  getTypes() {
    return TYPES;
  },
};
