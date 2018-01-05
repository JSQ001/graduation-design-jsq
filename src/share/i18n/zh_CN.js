import login from 'static/i18n/zh_CN/login.json'
import common from 'static/i18n/zh_CN/common.json'
const i18nList = [
  login,  //登录及主界面
  common, //通用
];

let result = {};

i18nList.map(i18n => {
  result = Object.assign(result, i18n)
});

export default result
