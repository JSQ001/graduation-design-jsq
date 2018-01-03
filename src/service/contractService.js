import config from 'config'
import httpFetch from 'share/httpFetch'

export default {

  /**
   * 获取合同列表
   * @param page
   * @param size
   * @param searchParams
   */
  getContractList(page, size, searchParams){
    let url = `${config.contractUrl}/contract/api/contract/header/update/query?page=${page}&size=${size}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 获取合同头信息
   * @param id
   */
  getContractHeaderInfo(id){
    return httpFetch.get(`${config.contractUrl}/contract/api/contract/header/${id}`)
  },

  /**
   * 保存合同头信息
   * @param params
   */
  newContractHeader(params){
    return httpFetch.post(`${config.contractUrl}/contract/api/contract/header`, params)
  },

  /**
   * 更新合同头信息
   * @param params
   */
  updateContractHeader(params){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header`, params)
  },

  /**
   * 获取资金行计划
   * @param page
   * @param size
   * @param id
   */
  getPayPlan(page, size, id){
    return httpFetch.get(`${config.contractUrl}/contract/api/contract/line/herder/${id}?page=${page}&size=${size}`)
  },

  /**
   *  新建资金行计划
   * @param params
   */
  newPayPlan(params){
    return httpFetch.post(`${config.contractUrl}/contract/api/contract/line`, params)
  },

  /**
   * 更新资金行计划
   * @param params
   */
  updatePayPlan(params){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/line`, params)
  },

  /**
   * 删除资金行计划
   * @param id
   */
  deletePayPlan(id){
    return httpFetch.delete(`${config.contractUrl}/contract/api/contract/line/${id}`)
  },

  /**
   * 提交合同
   * @param id = 合同id
   */
  submitContract(id){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/submit/${id}`, {id})
  },

  /**
   * 删除合同
   * @param id
   */
  deleteContract(id){
    return httpFetch.delete(`${config.contractUrl}/contract/api/contract/header/${id}`, {id})
  },

  /**
   * 撤回合同
   * @param id
   */
  recallContract(id){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/withdrawal/${id}`)
  },

  /**
   * 暂挂合同
   * @param id
   */
  holdContract(id){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/hold/${id}`)
  },

  /**
   * 取消暂挂合同
   * @param id
   */
  unHoldContract(id){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/unHold/${id}`)
  },

  /**
   * 取消合同
   * @param id
   */
  cancelContract(id){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/cancel/${id}`)
  },

  /**
   * 完成合同
   * @param id
   */
  finishContract(id){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/finish/${id}`)
  },

  /**
   * 获取合同类型定义列表
   * @param page
   * @param size
   * @param setOfBooksId
   * @param searchParams
   */
  getContractTypeDefineList(page, size, setOfBooksId, searchParams) {
    let url = `${config.contractUrl}/contract/api/contract/type/${setOfBooksId}/query?page=${page}&size=${size}`;
    for(let searchName in searchParams) {
      searchName !== 'setOfBooksId' && (url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '')
    }
    return httpFetch.get(url)
  },

  /**
   * 查询某合同类型下的分配公司列表
   * @param page
   * @param size
   * @param setOfBooksId
   * @param id
   */
  getCompanyDistributionByContractType(page, size, setOfBooksId, id){
    return httpFetch.get(`${config.contractUrl}/contract/api/contract/type/${setOfBooksId}/companies/query?page=${page}&size=${size}&contractTypeId=${id}`)
  },

  /**
   * 查询合同类型信息
   * @param setOfBooksId
   * @param id
   */
  getContractTypeInfo(setOfBooksId, id){
    return httpFetch.get(`${config.contractUrl}/contract/api/contract/type/${setOfBooksId}/${id}`)
  },

  /**
   * 新建合同类型定义
   * @param setOfBooksId
   * @param params = [{ }]
   */
  newContractType(setOfBooksId, params) {
    return httpFetch.post(`${config.contractUrl}/contract/api/contract/type/${setOfBooksId}`, params)
  },

  /**
   * 更新合同类型定义
   * @param setOfBooksId
   * @param params = [{ }]
   */
  updateContractType(setOfBooksId, params) {
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/type/${setOfBooksId}`, params)
  },

  /**
   * 更新公司分配状态
   * @param setOfBooksId
   * @param params
   */
  updateCompanyDistributionStatus(setOfBooksId, params){
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/type/${setOfBooksId}/toCompany`, params)
  },

  /**
   * 分配公司
   * @param setOfBooksId
   * @param params
   */
  distributionCompany(setOfBooksId, params){
    return httpFetch.post(`${config.contractUrl}/contract/api/contract/type/${setOfBooksId}/toCompany`, params)
  },

  /**
   * 获取未审批合同列表
   * @param page
   * @param size
   * @param searchParams
   */
  getUnapprovedContractList(page, size, searchParams){
    let url = `${config.contractUrl}/contract/api/contract/header/confirm/query?page=${page}&size=${size}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 获取已审批合同列表
   * @param page
   * @param size
   * @param searchParams
   */
  getApprovedContractList(page, size, searchParams){
    let url = `${config.contractUrl}/contract/api/contract/header/confirmEd/query?page=${page}&size=${size}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 合同审批通过
   * @param id = 合同id
   * @param reason = 审批意见(可空)
   */
  contractApprovePass(id, reason) {
    let params = { id, reason };
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/confirm/${id}`, params)
  },

  /**
   * 合同审批驳回
   * @param id = 合同id
   * @param reason = 审批意见(不可空)
   */
  contractApproveReject(id, reason) {
    let params = { id, reason };
    return httpFetch.put(`${config.contractUrl}/contract/api/contract/header/rejected/${id}?reason=${reason}`, params)
  }
}
