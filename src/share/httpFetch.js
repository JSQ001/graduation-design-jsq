/**
 * Created by zaranengap on 2017/9/1.
 */
import axios from 'axios'
import config from 'config'
import configureStore from 'stores'
import {setUser,setCompany,setProfile,setUserOrganization,setCompanyConfiguration} from 'actions/login'
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
    let refreshParams = `client_id=ArtemisApp&client_secret=nLCnwdIhizWbykHyuZM6TpQDd7KwK9IXDK8LGsa7SOW&refresh_token=${JSON.parse(localStorage.getItem('hly.token')).refresh_token}&grant_type=refresh_token`;
    return axios(encodeURI(`${config.baseUrl}/oauth/token?${refreshParams}`),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('hly.token')).access_token
      }
    }).then(checkStatus).catch(e => {
      message.error(e.response.data.error_description);
      if(location.href.substr(8, location.href.length - 1).split('/').length !== 2)
        location.href = '/';
    }).then(response => {
      localStorage.setItem('hly.token', JSON.stringify(response.data));

    })
  },

  /**
   * 得到用户信息
   * @return {*|Promise.<TResult>}
   */
  getInfo: function(){
    return this.getUser().then(()=>{
      return Promise.all([this.getCompany(),this.getProfile(),this.getCompanyConfiguration()])
    })
  },

  getUser: function(){
    return this.get(`${config.baseUrl}/api/account`,{}).then((response)=>{
      configureStore.store.dispatch(setUser(response.data));
    })
  },

  getCompany: function(){
    return this.get(`${config.baseUrl}/api/my/companies`,{}).then((response)=>{
      configureStore.store.dispatch(setCompany(response.data));
    })
  },

  getCompanyConfiguration: function(){
    return this.get(`${config.baseUrl}/api/company/configurations/user`).then(response => {
      configureStore.store.dispatch(setCompanyConfiguration(response.data));
    })
  },

  getProfile: function(){
    return this.get(`${config.baseUrl}/api/function/profiles`,{}).then((response)=>{
      configureStore.store.dispatch(setProfile(response.data));
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
      url: encodeURI(`${config.baseUrl}/oauth/token?scope&read write&grant_type=password&username=${username}&password=${password}`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic QXJ0ZW1pc0FwcDpuTENud2RJaGl6V2J5a0h5dVpNNlRwUURkN0t3SzlJWERLOExHc2E3U09X'
      }
    }).then(checkStatus).then((response)=>{
      localStorage.setItem('hly.token', JSON.stringify(response.data));
    });
  }
};

let methodList = ['get','post','put','delete'];
methodList.map(method => {
  httpFetch[method] = function(url, params ,header, options = {}){
    if(!header)
      header = {};
    header.Authorization = "Bearer " + JSON.parse(localStorage.getItem('hly.token')).access_token;
    let option = {
      url: url,
      method: method.toUpperCase(),
      mode: 'cors',
      headers: header,
      data: params
    };
    return axios(url, Object.assign({}, options, option)).catch(e => checkStatus(e.response, true, url, params, header, method.toUpperCase()))
  };
});


export default httpFetch

