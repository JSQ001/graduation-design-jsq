/**
 * Created by zaranengap on 2017/7/13.
 */
import React from 'react'
import configureStore from 'stores'
import httpFetch from 'share/httpFetch'
import config from 'config'

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
React.Component.prototype.filterMoney = (money, fixed = 2) => <span className="money-cell">{Number(money || 0).toFixed(fixed).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;

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
 * @param code 值列表代码
 */
React.Component.prototype.getSystemValueList = (code) => httpFetch.get(`${config.baseUrl}/api/custom/enumeration/system/by/type?systemCustomEnumerationType=${code}`);

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
}



