/**
 * Created by zaranengap on 2017/7/13.
 */
import React from 'react'
import configureStore from 'stores'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { FormattedMessage } from 'react-intl';

Array.prototype.delete = function(item){
  for(let i = 0; i < this.length; i++){
    if(this[i] === item){
      this.splice(i, 1);
      return i;
    }
  }
  return -1;
};

Array.prototype.addIfNotExist = function(item){
  for(let i = 0; i < this.length; i++){
    if(this[i] === item)
      return;
  }
  this.push(item)
};

//给String类型添加 '_self' 的getter， 使得 typeof a === 'string' && a['_self'] === a 成立
if(String.prototype.__defineGetter__)
  String.prototype.__defineGetter__('_self', function(){
    return this.toString();
  });
else
  Object.defineProperty(String.prototype, '_self', {
    get: function(){
      return this.toString();
    }
  });

//金额过滤
React.Component.prototype.filterMoney = (money, fixed = 2) => {
  money = Number(money || 0).toFixed(fixed).toString();
  let numberString = '';
  if(money.indexOf('.') > -1) {
    let integer = money.split('.')[0];
    let decimals = money.split('.')[1];
    numberString = integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '.' + decimals;
  } else {
    numberString = money.replace(/(\d)(?=(\d{3})+(?!\d))\./g, '$1,');
  }
  numberString += (numberString.indexOf('.') > -1 ? '' : '.00');
  return <span className="money-cell">{numberString}</span>;
};

//检查用户操作权限
React.Component.prototype.checkAuthorities = auth => {
  let user = configureStore.store.getState().login.user;
  let result;
  if(auth.splice){
    result = true;
    user.authorities && auth.length >= 1 && auth.map(authItem => {
      let authFlag = false;
      user.authorities.map(item => {
        authFlag = authFlag || authItem === item;
      });
      result = result && authFlag;
    })
  } else {
    result = false;
    user.authorities && user.authorities.map(item => { result = result || auth === item });
  }
  return result;
};

//检查单个functionProfile
let checkFunctionProfile = (fpItem, fpValue) => {
  let profile = configureStore.store.getState().login.profile;
  if(fpItem[0] === '[') {
    fpItem = fpItem.replace(/]/g, '');
    let attrs = fpItem.split('[');
    let targetItem = profile;
    attrs.map(attr => {
      if (attr.length > 0) {
        try {
          targetItem = targetItem[attr]
        } catch (e) {
          targetItem = false
        }
      }
    });
    return targetItem && (fpValue.splice ? fpValue.indexOf(targetItem) > -1 : targetItem === fpValue);
  } else {
    return (fpValue.splice ? fpValue.indexOf(profile[fpItem]) > -1 : profile[fpItem] === fpValue);
  }
};

//检查用户functionProfile,可为数组或单个值
React.Component.prototype.checkFunctionProfiles = (fpItem, fpValue) => {
  if(!fpItem || !fpValue)
    return false;
  //为数组时
  if(fpItem.splice){
    if(fpItem.length !== fpValue.length || fpItem.length === 0)
      return false;
    let result = true;
    fpItem.map((item, index) => {
      result = result && checkFunctionProfile(item, fpValue[index]);
    });
    return result;
  }
  //为单字符串时
  else {
    return checkFunctionProfile(fpItem, fpValue)
  }
};

//检查用户操作权限拥有任意之一
React.Component.prototype.hasAnyAuthorities = auth => {
  let user = configureStore.store.getState().login.user;
  console.log(user)
  let result = false;
  user.authorities && auth.length >= 1 && auth.map(authItem => {
    user.authorities.map(item => {
      if(authItem === item)
        result = true
    });
  });
  return true;
};

// 格式化时间yyyy-MM-dd hh:mm:ss.S
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));

  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
};

/**
 * 得到系统值列表
 * 1001 人员类型
 * 1002 职务
 * 1003 携程子账户
 * 1004 银行名称
 * 1005 国籍
 * 1006 证件类型
 * 1007 性别
 * 1008 员工级别
 * 1010 会计期间名称附加
 * 2001 版本状态
 * 2002 编制期段
 * 2003 布局位置
 * 2004 预算项目变动属性
 * 2005 预算控制方法
 * 2006 预算控制策略类型
 * 2007 预算控制策略范围
 * 2008 预算控制策略对象
 * 2009 预算控制策略方式
 * 2010 预算控制策略预算符号
 * 2011 控制期段
 * 2012 规则参数类型
 * 2013 取值方式
 * 2014 取值范围
 * 2015 规则参数类型_预算相关
 * 2016 规则参数类型_组织架构相关
 * 2017 规则参数类型_维度相关
 * 2018 预算业务类型
 * 2019 金额／数量
 * 2020 期间汇总标志
 * 2021 预算季度
 * 2022 预算控制消息
 * 2023 单据类别
 * 2024 重置频率
 * 2025 段值
 * 2026 日期格式
 * 2101 汇率方法
 * 2102 汇率标价方法
 * 2103 银行类型
 * 2104 现金交易事务类型
 * 2105 付款方式类型
 * 2106 单据类别
 * 2107 收款方类型
 * 2108 通用待付信息付款状态
 * 2109 付款状态
 * 2110 退款状态
 * 2111 支付日志操作类型
 * 2201 合同状态
 * 2202 合同大类
 * 2205 科目类型
 * 2206 报表类型
 * 2207 余额方向
 * 2208 来源事务
 * 2209 核算场景
 * 2210 核算要素取值方式
 * 2211 核算要素转换规则
 * 2212 交易判断规则
 * 2213 交易核算段取值方式
 *
 * @param code 值列表代码
 */
React.Component.prototype.getSystemValueList = (code) => {
  let url = '';
  if(Number(code) > 2000)
    url = '/api/custom/enumerations/template/by/type?type=';
  else
    url = '/api/custom/enumeration/system/by/type?systemCustomEnumerationType=';
  return httpFetch.get(`${config.baseUrl}${url}${code}`).then(res =>{
    return new Promise((resolve) => {
      if(res.data.splice){
        let result = JSON.parse(JSON.stringify(res));
        result.data = {values: res.data};
        resolve(result);
      } else {
        resolve(res);
      }
    });
  });
};

/**
 * 将一个元素包装成雪碧图动画，雪碧图为垂直方向
 * @param dom  需要包装的dom
 * @param img  雪碧图资源
 * @param height  单个frame的高
 * @param width  单个frame的宽
 * @param total  总共帧数
 * @param duration 动画持续时间
 * @param hoverDom hover所需要的dom
 */
window.spriteAnimation = function(dom, img, height, width, total, duration = 500, hoverDom = dom){
  dom.style.backgroundImage = `url('${img}')`;
  dom.style.backgroundSize = `${width}px`;
  dom.frames = total;
  hoverDom.onmouseenter = function(){
    let enterInterval = setInterval(() => {
      clearInterval(dom.leaveInterval);
      dom.enterInterval = enterInterval;
      dom.style.backgroundPosition = `0 ${dom.frames * height}px`;
      dom.frames--;
      if(dom.frames === 0)
        clearInterval(enterInterval);
    }, duration / total)
  };
  hoverDom.onmouseleave = function(){
    let leaveInterval = setInterval(() => {
      clearInterval(dom.enterInterval);
      dom.leaveInterval = leaveInterval;
      dom.frames++;
      dom.style.backgroundPosition = `0 ${dom.frames * height}px`;
      if(dom.frames === total)
        clearInterval(leaveInterval);
    }, duration / total)
  };
};


//公用接口
React.Component.prototype.service = {
  //获取货币
  getCurrencyList : () => {
    return httpFetch.get(`${config.baseUrl}/api/company/standard/currency/getAll?language=chineseName`)
  },

};

//公共函数:对象深拷贝
export function deepCopy (obj){
  return JSON.parse(JSON.stringify(obj));
}
//对象列表，通过对象唯一属性，去掉重复的项目：conditionValue
export function uniquelizeArray(t,index) {
  const tmp = {},
    ret = [];
  for (let i = 0, j = t.length; i < j; i++) {
    if (!tmp[t[i][index]]) {
      tmp[t[i][index]] = 1;
      ret.push(t[i]);
    }
  }
  return ret;
}

//节流函数
//一般用户输入框
export function superThrottle(fn, delay, mustRunDelay) {
  let timer = null;
  let t_start;
  return function () {
    let context = this;
    let args = arguments;
    let t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);
      t_start = t_curr;
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
}

//检测空对象
export function isEmptyObj(obj) {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
}
//从url中获取参数
//参数选填，不填就获取当前地址
//使用方式：var Request = new UrlSearch();
export function UrlSearch(url) {
  let name, value;
  let str = url ? url : window.location.href; //取得整个地址栏
  let num = str.indexOf("?")
  str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
  let arr = str.split("&"); //各个参数放到数组里
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}

//验证是否是ip
export function isValidIP(ip) {
  let reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip);
}

/**
 * 检测用户是否具有某种权限
 * @param authoritys  用户的所有权限 user.pageRoles
 * @param authority  是否具有这个权限 ROLE_TENANT_ADMIN
 * @return boolean
 */
export function hasAuthority(authoritys, authority) {
  for (let i = 0; i < authoritys.length; i++) {
    if(authoritys[i] === authority){
      return true;
    }
  }
  return false;
}

/**
 * 超过一定限制的字符就截取
 * @param length 开始截取的长度
 * @param string 字符串
 * @return obj 返回的对象，包含源字符串与截取后的
 */
export function fitText(string,length) {
  const obj = {
    origin: string,
    text: false
  }
  if(string === "" || string === null || string === undefined ){
    return obj;
  }
  if(string && string.length > length){
    obj.text = string.substr(0,length)
  }
  return obj;
}

/**
 * 简化的国际化方法
 * @param id
 * @param values
 * @return {XML}
 */
export function messages(id, values = {}) {
  if(!configureStore.store.getState)
  //如果没有store，初始化
    configureStore.reduxStore();
  let result = configureStore.store.getState().main.language.messages[id];
  //#代表没找到
  if(result === undefined){
    return "#";
  }
  //匹配 {*} 格式
  result = result.replace(/\{(.*?)\}/g, (target, $1) => {
    let replacement = false;
    //values内寻找是否有值，否则不替换
    Object.keys(values).map(key => {
      if(key === $1)
        replacement = values[key]
    });
    return replacement === undefined ? target : replacement;
  });
  return result
}
/**
 * 产生随机 id
 * @param length 长度
 * @return obj 字符串
 */
export function randomString(length) {
  let id = '';
  let chars = 'ABCDEFGHiJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * 60));
  }
  return id;
}
//
/**
 * 根据语言代码获取语言名称
 * @param code 语言国际化代码，zh_cn,en等
 * @param languageList 多语言列表,后端返回的
 * @return name 字符串
 */
export function getLanguageName (code,languageList) {
  if(code){
    let name = "";
    languageList.map((item) => {
      if (code.toLowerCase() === item.code.toLowerCase()) {
        name = item.value;
      }
    })
    return name;
  }else {
    return "简体中文";
  }
}
