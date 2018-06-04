/**
 * Created by zhouli on 18/2/28
 * Email li.zhou@huilianyi.com
 */
import React from 'react';
import {UrlSearch,isValidIP} from 'share/common';
import httpFetch from 'share/httpFetch';
import config from 'config';
export function sso_huilianyi(success, error) {
  //如果host是这些，就保持现有的逻辑
  //否则：跳转到单点登陆的地址
  // let SSO_HOSTS = [
  //   '127.0.0.1',
  //   '0.0.0.0',
  //   'localhost',
  //   'uat.huilianyi.com',
  //   'stage.huilianyi.com',
  //   'console.huilianyi.com'
  // ];
  // var CURRENT_LOCALHOST = "http://handdev.huilianyi.com:8900";
  let CURRENT_LOCALHOST = window.location.href;
  // for (let i = 0; i < SSO_HOSTS.length; i++) {
  //   if (CURRENT_LOCALHOST.match(SSO_HOSTS[i])) {
      //结束，不需要单点登陆
  //     return;
  //   }
  // }
  //验证ip
  // if(isValidIP((window.location.host).split(":")[0])){
    //结束，不需要单点登陆
  //   return;
  // }

  //上面的注释说明：后来添加了接口，通过接口判断登陆方式，所以前端静态过滤的逻辑就可以不要了

  //检查有没有code，如果有，直接去获取token
  let Request = new UrlSearch(); //实例化
  if (Request.code) {
    //这个code参数能否设置复杂一点，比如设置为sso_code
    //有些页面如果有code参数会有冲突
    httpFetch.login(Request.code, Request.code ,'sso').then((data) => {
      if (is_need_redirect(CURRENT_LOCALHOST)) {
        redirect_by_url(CURRENT_LOCALHOST);
      } else {
        success(data);
      }
    }).catch((err) => {
      error(err);
    })
  } else {
    //去拿登陆code
    window.location.href = config.ssoUrl + '/sso/login?redirect_url=' + CURRENT_LOCALHOST + '&origin_url=' + CURRENT_LOCALHOST;
  }
}

export function redirect_by_url(url) {
  let Request = new UrlSearch(url); //实例化

  //根据url类型判断这个是否需要专门定向
  let type = Request.targetState;
  let targetParams = null;
  try {
    //targetParams这个参数可能没有
    targetParams = JSON.parse(atob(decodeURIComponent(Request.targetParams)));
  }catch (e){
    for(let p in e){
      console.log(p + "=" + e[p]);
    }
  }
  let formOID = Request.form_oid;

  // todo
  // genarate_url_by_rule();
  window.location.href =
    window.location.protocol+"//"+window.location.host + "/" + type + "/" + targetParams.expenseReportOID + "/" + formOID;
}

//登陆之后：判断是否需要重新定向
export function is_need_redirect(url) {
  let Request = new UrlSearch(url); //实例化

  //根据url类型判断这个是否需要专门定向
  let type = Request.targetState;
  let targetParams = null;
  try {
    targetParams = JSON.parse(atob(decodeURIComponent(Request.targetParams)));
  }catch (e){
    for(let p in e){
      console.log(p + "=" + e[p]);
    }
  }
  let formOID = Request.form_oid;
  return type && targetParams && formOID
}

//可以根据规则生成要跳转的url
export function genarate_url_by_rule() {
  return;
}
