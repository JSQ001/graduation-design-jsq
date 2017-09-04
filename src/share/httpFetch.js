/**
 * Created by zaranengap on 2017/9/1.
 */
import axios from 'axios'
import config from 'config'
import configureStore from 'stores'
import {setUser,setCompany,setProfile} from 'actions/login'

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
            if(method === 'POST')
              httpFetch.post(url, params, header).then((res) => resolve(res));
            else
              httpFetch.get(url, params, header).then((res) => resolve(res));
          })
        });
      }
      else
        console.log("to login");
    }
    let error = new Error(response.statusText);
    error.response = response;
    throw error
  }
}


const httpFetch = {
  /**
   * 刷新token
   * @return {Promise.<TResult>}
   */
  refreshToken: function(){
    let refreshParams = `client_id=ArtemisApp&client_secret=nLCnwdIhizWbykHyuZM6TpQDd7KwK9IXDK8LGsa7SOW&refresh_token=${localStorage.refresh_token}&grant_type=refresh_token`;
    return axios(encodeURI(`${config.baseUrl}/oauth/token?${refreshParams}`),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + localStorage.token
      }
    }).then(checkStatus).then(response => {
      localStorage.token = response.data.access_token;
      localStorage.refresh_token = response.data.refresh_token;
    }).then(()=>{
      if(Object.keys(configureStore.store.getState().login.user).length === 0)
        this.getInfo();
    })
  },

  /**
   * 得到用户信息
   * @return {*|Promise.<TResult>}
   */
  getInfo: function(){
    return Promise.all([this.getUser(),this.getCompany(),this.getProfile()]);
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

  getProfile: function(){
    return this.get(`${config.baseUrl}/api/function/profiles`,{}).then((response)=>{
      configureStore.store.dispatch(setProfile(response.data));
    })
  },

  post: function(url, params, header){
    if(!header)
      header = {};
    header.Authorization = "Bearer " + localStorage.token;
    header['Content-Type'] = "application/json;charset=UTF-8";
    return axios({
      url: url,
      method: 'POST',
      mode: 'cors',
      headers: header,
      data: params
    }).catch(e => e.toString().indexOf('401') > -1 && checkStatus({status: 401}, true, url, params, header, 'POST'))
  },

  get: function(url, params, header){
    if(!header)
      header = {};
    header.Authorization = "Bearer " + localStorage.token;
    return axios(url, {
      url: url,
      method: 'GET',
      mode: 'cors',
      headers: header
    }).catch(e => e.toString().indexOf('401') > -1 && checkStatus({status: 401}, true, url, params, header, 'GET'))
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
      localStorage.token = response.data.access_token;
      localStorage.refresh_token = response.data.refresh_token;
      this.getInfo();
    });
  }
}


export default httpFetch

