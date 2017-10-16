/**
 * Created by zaranengap on 2017/7/13.
 */
import React from 'react'
import configureStore from 'stores'

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

//金额过滤
React.Component.prototype.filterMoney = (money, fixed = 2) => <span className="money-cell">{(money || 0).toFixed(fixed).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;

//检查用户操作权限
React.Component.prototype.checkAuthorities = auth => {
  let user = configureStore.store.getState().login.user;
  let result = false;
  user.authorities && user.authorities.map(item => { result = result || auth === item });
  return result;
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

