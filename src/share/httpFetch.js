/**
 * Created by zaranengap on 2017/9/1.
 */
import axios from 'axios'
import config from 'config'
import configureStore from 'stores'
import {setUser,setRole} from 'actions/login'
import { message } from 'antd'

/**
 * 检查是否token过期
 * @param response    该请求的response
 * @param needRefresh    是否需要刷新token，如果是登录操作则不需要
 * @param url    原请求路径，将在刷新成功后再次请求
 * @param params    原请求参数
 * @param header    原请求头
 * @param method    原请求方法
 * @return {*}
 */
function checkStatus(response, needRefresh, url, params, header, method) {
  console.log(response)
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    if(response.status == 401){
      if(needRefresh){
        return httpFetch.refreshToken().then(() => {
          return new Promise((resolve) => {
              httpFetch[method.toLowerCase()](url, params, header).then((res) => resolve(res));
          })
        });
      }
      else
        console.log("to login");
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}


const httpFetch = {
  /**
   * 刷新token
   * @return {Promise.<TResult>}
   */
  refreshToken: function(){
    let refreshParams = `client_id=client_1&client_secret=nLCnwdIhizWbykHyuZM6TpQDd7KwK9IXDK8LGsa7SOW&refresh_token=${JSON.parse(localStorage.getItem('jsq.token')).refresh_token}&grant_type=refresh_token`;
    return axios(encodeURI(`${config.baseUrl}/oauth/token?${refreshParams}`),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jsq.token')).access_token
      }
    }).then(checkStatus).catch(e => {
      message.error(e.response.data.error_description);
      if(location.href.substr(8, location.href.length - 1).split('/').length !== 2)
        location.href = '/';
    }).then(response => {
      let expiredAt = new Date();
      let token = response.data;
      expiredAt.setSeconds(expiredAt.getSeconds() + token.expires_in);
      token.expires_at = expiredAt.getTime();
      localStorage.setItem('jsq.token', JSON.stringify(token));

    })
  },

  getUser: function(){
    return this.get(`${config.baseUrl}/api/account`,{}).then((response)=>{
      configureStore.store.dispatch(setUser(response.data));
    })
  },

  /**
   * 登录，不需刷新token
   * @param username    用户名
   * @param password    密码
   * @return {*|Promise.<TResult>}
   */
  login: function(username, password){
    return axios({
      url: encodeURI(`${config.baseUrl}/oauth/token?scope=select&grant_type=password&client_id=client_2&client_secret=123456&username=${username}&password=${password}`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
       // 'Authorization': 'Basic QXJ0ZW1pc0FwcDpuTENud2RJaGl6V2J5a0h5dVpNNlRwUURkN0t3SzlJWERLOExHc2E3U09X'
      }
    }).then(checkStatus).then((response)=>{
      let expiredAt = new Date();
      let token = response.data;
      /*expiredAt.setSeconds(expiredAt.getSeconds() + token.expires_in);
      token.expires_at = expiredAt.getTime();*/
      console.log(JSON.stringify(token))

      localStorage.setItem('jsq.token', JSON.stringify(token));
    });
  }
};

let methodList = ['get','post','put','delete', 'patch'];
methodList.map(method => {
  httpFetch[method] = function(url, params ,header, options = {}){
    if(!header)
      header = {};
    header.Authorization = "Bearer " + JSON.parse(localStorage.getItem('jsq.token')).access_token;
    let option = {
      url: url,
      method: method.toUpperCase(),
      mode: 'cors',
      headers: header,
      data: params,
      params:(method === 'get' || method === 'delete') ? params : undefined
    };
    return axios(url, Object.assign({}, options, option)).catch(e => checkStatus(e.response, true, url, params, header, method.toUpperCase()))
  };
});


export default httpFetch

