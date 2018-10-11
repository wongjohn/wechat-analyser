import { Message } from 'element-ui/lib';
const Excel = require('exceljs');
const path = require('path');
const os = require('os');
const exec = require('child_process').exec;
const readFilePath = path.resolve(__dirname, 'alpha__bug_template.xlsx');

const BUGS_STORE_KEY = 'BUGS';
const MODULES_STORE_KEY = 'MODULES';
const TYPES_STORE_KEY = 'TYPES';
const STATES_STORE_KEY = 'STATES_STORE_KEY';
let bugs = [];

const MODULES = ['wordalpha', 'note', '安装指引', '登录', '账号', 'Chrome浏览器', '大数据',
  '收藏夹', '市场拓展', '实践指引', '项目', '服务报告', '任务', '日历', '计时', '工作类型',
  '律助', '文档', 'alphabox', '客户', '行业雷达', '利冲', '合同库', '项目模板', '任务模板',
  '合同模板', '文书模板', '权限', '部门', '安卓', 'iOS', '享聊', '通知', 'km', '客户端',
  '成就分析', '财务', '报表', '审批', '职级', '帮助中心', '设置', 'chrome插件', '系统',
  '橙信', '培训', '课程', '手机端计算器', '其他'];

const TYPES = ['缺陷', '使用问题', '安装问题', '需求', '校友肯定', '其他问题'];

const STATES = ['初始状态'];

function exportBugs() {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile(readFilePath)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        bugs.forEach((bug) => {
          worksheet.addRow([bug.module, bug.title, bug.type, bug.state, bug.source, bug.detail]);
        });
        const genDir = path.resolve(os.homedir(), `Downloads/Alpha-Bugs-${(new Date()).getTime()}.xlsx`);
        workbook.xlsx.writeFile(genDir);
        bugs = [];
        localStorage.setItem(BUGS_STORE_KEY, JSON.stringify(bugs));
        Message.success('Bug文档生成完毕');
        resolve(bugs);
        exec('open .', { cwd: path.dirname(genDir) });
      }, (error) => {
        reject(error);
      });
  });
}

export default {
  exportBugs,
  addBug(bug) {
    bugs.push(bug);
    localStorage.setItem(BUGS_STORE_KEY, JSON.stringify(bugs));
  },
  getBugs() {
    const storeBugs = JSON.parse(localStorage.getItem(BUGS_STORE_KEY) || '[]');
    bugs = storeBugs;
    return storeBugs;
  },
  getModules() {
    const storeModules = JSON.parse(localStorage.getItem(MODULES_STORE_KEY) || '[]');
    return storeModules.length ? storeModules : MODULES;
  },
  setModules(modules) {
    localStorage.setItem(MODULES_STORE_KEY, JSON.stringify(modules));
  },
  getTypes() {
    const storeTypes = JSON.parse(localStorage.getItem(TYPES_STORE_KEY) || '[]');
    return storeTypes.length ? storeTypes : TYPES;
  },
  setTypes(types) {
    localStorage.setItem(TYPES_STORE_KEY, JSON.stringify(types));
  },
  getStates() {
    const storeStates = JSON.parse(localStorage.getItem(STATES_STORE_KEY) || '[]');
    return storeStates.length ? storeStates : STATES;
  },
  setStates(states) {
    localStorage.setItem(STATES_STORE_KEY, JSON.stringify(states));
  },
};
