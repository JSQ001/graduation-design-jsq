import config from 'config'
import React from 'react'
import httpFetch from 'share/httpFetch'
import configureStore from 'stores'
import { setUser, setCompany, setTenant,
  setProfile, setCompanyConfiguration, setIsOldCompany, setLanguageList} from 'actions/login'
import { setLanguage, setTenantMode } from 'actions/main'

import en from 'share/i18n/en_US'
import zh from 'share/i18n/zh_CN'

export default {

  //切换语言并设置
  changeLanguage(value){
    let language = {};
    let param = '';
    switch(value){
      case 'en':
        language = {
          locale: 'en',
          messages: en
        };
        param = 'en';
        break;
      case 'zh':
        language = {
          locale: 'zh',
          messages: zh
        };
        param = 'zh_CN';
        break;
    }
    return httpFetch.post(`${config.baseUrl}/api/users/language/${param}`).then(response => {
      configureStore.store.dispatch(setLanguage(language));
    })
  },

  pageRolesToObj(pageRoles){
    var temp = {};
    console.log(pageRoles)
    if(typeof pageRoles!=='undefined')
    pageRoles.forEach(function (item) {
      temp[item.pageName] = {
        pageName: item.pageName,
        action: item.action
      }
    });
    return null;
  },
 /* //得到用户信息并存储信息
  getUser(){
    return httpFetch.get(`${config.baseUrl}/api/account`).then((response)=>{
      let user = response.data;
      //根据老中控设置
      let pageRoles = this.pageRolesToObj(response.data.pageRoles);
      sessionStorage.setItem('HLY-PageRoles', JSON.stringify(pageRoles));
      this.getTenant(user.tenantId);
      let language;
      switch(response.data.language){
        case 'en':
          language = {
            locale: 'en',
            messages: en,
            code: 'en'
          };
          break;
        case 'zh_CN':
          language = {
            locale: 'zh',
            messages: zh,
            code: 'zh_cn'
          };
          break;
      }
      configureStore.store.dispatch(setLanguage(language));
      configureStore.store.dispatch(setUser(response.data));

      if(sessionStorage.getItem('HLY-RoleType')){
        let roleType = JSON.parse(sessionStorage.getItem('HLY-RoleType'));
        configureStore.store.dispatch(setTenantMode(roleType === 'tenant'))
      } else {
        configureStore.store.dispatch(setTenantMode(React.Component.prototype.checkAuthorities('ROLE_TENANT_ADMIN')))
      }
      return response;
    })
  },*/


  /**
   * 得到用户信息
   * @return {*|Promise.<TResult>}
   */
  getInfo(){
    return this.getUser().then(()=>{
      return Promise.all([
        this.getCompany(),
        this.getProfile(),
        this.getCompanyConfiguration(),
        this.getIsOldCompany(),
        this.getLanguageList()
      ])
    })
  },

  getLanguageList(){
    return httpFetch.post(`${config.baseUrl}/api/lov/language/zh_CN`,{}).then((response) => {
      configureStore.store.dispatch(setLanguageList(response.data));
      return response;
    })
  },

  //得到公司信息并存储在redux内
  getCompany(){
    return httpFetch.get(`${config.baseUrl}/api/my/companies`,{}).then((response) => {
      configureStore.store.dispatch(setCompany(response.data));
      return response;
    })
  },

 //得到集团信息并存储在redux内
  getTenant(tenantId){
    return httpFetch.get(config.baseUrl + '/api/tenant/getById?tenantId=' + tenantId,{}).then((response) => {
      //给老中控用，新中控替换完毕，这个可以去掉--start
      sessionStorage.setItem('HLY-tenantInfo', JSON.stringify(response.data));
      //给老中控用，新中控替换完毕，这个可以去掉--end
      configureStore.store.dispatch(setTenant(response.data));
      return response;
    })
  },
  //得到公司配置并存储在redux内
  getCompanyConfiguration(){
    return httpFetch.get(`${config.baseUrl}/api/company/configurations/user`).then(response => {
      configureStore.store.dispatch(setCompanyConfiguration(response.data));
      return response;
    })
  },

  //得到functionProfile并存储在redux内
  getProfile(){
    return httpFetch.get(`${config.baseUrl}/api/function/profiles`).then((response)=>{
      configureStore.store.dispatch(setProfile(response.data));
      return response;
    })
  },

  //得到是否为老公司并存储在redux内
  getIsOldCompany(){
    return httpFetch.get(`${config.baseUrl}/api/tenant/check/exsit/company/his`).then((response)=>{
      sessionStorage.setItem('HLY-isOldCompanyFlag', response.data);
      configureStore.store.dispatch(setIsOldCompany(response.data));
      return response;
    })
  },

  //根据租户查询帐套信息
  getSetOfBooksByTenant(){
    return httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant`)
  },

  //调用腾讯地图搜索区域
  searchLocation(keyword){
    return httpFetch.get(`${config.mapUrl}/ws/place/v1/suggestion/?region=&keyword=${keyword}&key=${config.mapKey}`)
  },

  //获取国家
  getCountries(params){
    return httpFetch.get(`${config.accountingUrl}/location-service/api/localization/query/country`,params)
  },

  //根据国家code获取城市信息
  getCities(params){
    return httpFetch.get(`${config.accountingUrl}/location-service/api/localization/query/all/address`,params)
  },

  //根据表单OID获取费用类型
  getExpenseTypesByFormOID(formOID){
    return httpFetch.get(`${config.baseUrl}/api/v2/custom/forms/${formOID}/selected/expense/types`)
  },

  //根据公司OID获取费用类型
  getExpenseTypeByCompanyOID(companyOID){
    return httpFetch.get(`${config.baseUrl}/api/expense/types?companyOID=${companyOID}`)
  },

  //获取费用大类型
  getExpenseTypeCategory(){
    return httpFetch.get(`${config.baseUrl}/api/expense/types/category`)
  },

  //根据费用OID获取费用类型
  getExpenseTypeByOID(expenseTypeOID){
    return httpFetch.get(`${config.baseUrl}/api/expense/types/${expenseTypeOID}`)
  },

  //根据费用id获取费用类型
  getExpenseTypeById(id){
    return httpFetch.get(`${config.baseUrl}/api/expense/types/select/${id}`)
  },

  //根据语言和本位币获取货币列表
  getCurrencyList(currencyCode = configureStore.store.getState().login.company.baseCurrency, language = 'chineseName'){
    return httpFetch.get(`${config.baseUrl}/api/company/standard/currency/baseCode/list?currencyCode=${currencyCode}&language=${language}`)
  },

  //根据语言获得货币列表
  getAllCurrencyByLanguage(language = 'chineseName'){
    return httpFetch.get(`${config.baseUrl}/api/company/standard/currency/getAll?language=${language}`)
  },

  //根据本位币获取汇率
  getExchangeRate(baseCurrency, currency){
    return httpFetch.get(`${config.baseUrl}/api/standardCurrency/selectStandardCurrency?base=${baseCurrency}&otherCurrency=${currency}`)
  },

  //根据用户OID获得用户
  getUserByOID(userOID){
    return httpFetch.get(`${config.baseUrl}/api/users/oid/${userOID}`)
  },

  //得到商务卡消费记录，分页
  getBusinessCardConsumptionList(bankCard, used, ownerOID){
    return httpFetch.get(`${config.baseUrl}/api/bankcard/transactions/${bankCard}/${used}?ownerOID=${ownerOID}`)
  },

  //得到表单内容
  getFormDetail(formId){
    return httpFetch.get(`${config.baseUrl}/api/custom/forms/${formId}`)
  },

  //获取用户信息
  getUserInfo(userOID) {
    return httpFetch.get(`${config.baseUrl}/api/users/v2/${userOID}`)
  },

  //得到成本中心
  getCostCenter(){
    return httpFetch.get(`${config.baseUrl}/api/cost/center/company`)
  },

  //得到公司银行账户
  getCompanyBank(setOfBooksId, page, size){
    return httpFetch.get(`${config.baseUrl}/api/CompanyBank/get/by/setOfBooksId?setOfBooksId=${setOfBooksId}&page=${page}&size=${size}`)
  },

  //获取汇率容差配置
  getRateDeviation(tenantId) {
    return httpFetch.get(`${config.baseUrl}/api/tenant/config/by/tenantId?tenantId=${tenantId}`)
  },

  //根据OID获得值列表
  getCustomEnumerationsByOID(enumOID){
    return httpFetch.get(`${config.baseUrl}/api/custom/enumerations/${enumOID}/simple`)
  },

  //根据部门OID得到部门
  getDepartmentByOID(departmentOID){
    return httpFetch.get(`${config.baseUrl}/api/departments/${departmentOID}`)
  }

}
