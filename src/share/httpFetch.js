/**
 * Created by zaranengap on 2017/7/4.
 */
import 'whatwg-fetch'
import config from 'config'
import configureStore from '../stores'
import {setUser} from '../actions/login'

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

function parseJSON(response) {
  if(response.type && (response.type === 'basic' || response.type === 'cors' || response === 'error' || response === 'opaque')){
    return response.json();
  }
  return response;
}

const httpFetch = {
  refreshToken: function(){
    let refreshParams = `client_id=ArtemisApp&client_secret=nLCnwdIhizWbykHyuZM6TpQDd7KwK9IXDK8LGsa7SOW&refresh_token=${localStorage.refresh_token}&grant_type=refresh_token`;
    return fetch(encodeURI(`${config.baseUrl}/oauth/token`),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + localStorage.token
      },
      body: refreshParams
    }).then(checkStatus).then(parseJSON).then(response => {
      localStorage.token = response.access_token;
      localStorage.refresh_token = response.refresh_token;
    }).then(()=>{
      if(Object.keys(configureStore.store.getState().login.user).length === 0)
        this.getUser();
    })
  },

  getUser: function(){
    return this.get(`${config.baseUrl}/api/account`,{}).then((response)=>{
      configureStore.store.dispatch(setUser(response));
    })
  },

  post: function(url, params, header){
    if(!header)
      header = {};
    header.Authorization = "Bearer " + localStorage.token;
    header['Content-Type'] = "application/json;charset=UTF-8";
    return fetch(url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(params)
    }).then(response => checkStatus(response, true, url, params, header, 'POST')).then(parseJSON)
  },

  get: function(url, params, header){
    if(!header)
      header = {};
    header.Authorization = "Bearer " + localStorage.token;
    return fetch(url, {
      method: 'GET',
      headers: header
    }).then(response => checkStatus(response, true, url, params, header, 'GET')).then(parseJSON)
  },

  login: function(username, password){
    return fetch(encodeURI(`${config.baseUrl}/oauth/token?scope&read write&grant_type=password&username=${username}&password=${password}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic QXJ0ZW1pc0FwcDpuTENud2RJaGl6V2J5a0h5dVpNNlRwUURkN0t3SzlJWERLOExHc2E3U09X'
      }
    }).then(checkStatus).then(parseJSON).then((response)=>{
      localStorage.token = response.access_token;
      localStorage.refresh_token = response.refresh_token;
      this.getUser();
    });
  }
}


export default httpFetch
