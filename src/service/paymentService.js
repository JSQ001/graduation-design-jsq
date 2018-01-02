import config from 'config'
import httpFetch from 'share/httpFetch'

export default {

  /**
   * 更新收款账号
   * @param params = [{
      id: '',
      accountNumber: '',
      versionNumber: ''
    }]
   */
  updateAccountNum(params){
    return httpFetch.put(`${config.contractUrl}/payment/api/cash/transactionData`, params)
  },

  /**
   * 获取付款方式
   * @param params = ONLINE_PAYMENT(线上) || OFFLINE_PAYMENT(线下) || EBANK_PAYMENT(落地文件)
   */
  getPayWay(params){
    return httpFetch.get(`${config.contractUrl}/payment/api/Cash/PaymentMethod/selectByPaymentType?paymentType=${params}`)
  },

  /**
   * 获取未支付状态总金额
   * @param value = ONLINE_PAYMENT(线上) || OFFLINE_PAYMENT(线下) || EBANK_PAYMENT(落地文件)
   * @param searchParams = {searchName: searchValue}
   */
  getUnpaidAmount(value, searchParams){
    let url = `${config.contractUrl}/payment/api/cash/transactionData/select/totalAmountAndDocumentNum?paymentMethodCategory=${value}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 获取未支付状态各项数据列表
   * @param page
   * @param pageSize
   * @param value = ONLINE_PAYMENT(线上) || OFFLINE_PAYMENT(线下) || EBANK_PAYMENT(落地文件)
   * @param searchParams = {searchName: searchValue}
   */
  getUnpaidList(page, pageSize, value, searchParams){
    let url = `${config.contractUrl}/payment/api/cash/transactionData/query?page=${page}&size=${pageSize}&paymentMethodCategory=${value}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 确认支付
   * @param params = {
      dataIds: [],
      versionNumbers: [],
      currentAmount: [],
      cashPayDTO: {
        paymentMethodCategory: 'ONLINE_PAYMENT' || 'OFFLINE_PAYMENT',
        payCompanyBankName: '',
        payCompanyBankNumber: '',
        paymentDescription: '',
        paymentTypeId: '',
        payDate: 'YYYY-MM-DD',
        currency: '',
        description: '',
        rate: ''
      }
    }
   */
  confirmPay(params){
    return httpFetch.post(`${config.contractUrl}/payment/api/cash/transaction/details/insertBatch`, params)
  },

  /**
   * 确认成功
   * @param params = {
       detailIds: [],
       versionNumbers: []
     }
   * @param date = 'YYYY-MM-DD'
   */
  confirmSuccess(params, date){
    return httpFetch.post(`${config.contractUrl}/payment/api/cash/transaction/details/paying/paySuccess/${date}`, params)
  },

  /**
   * 确认失败
   * @param params = {
       detailIds: [],
       versionNumbers: []
     }
   */
  confirmFail(params){
    return httpFetch.post(`${config.contractUrl}/payment/api/cash/transaction/details/paying/PayFail`, params)
  },

  /**
   * 获取总金额
   * @param type = ONLINE_PAYMENT(线上) || OFFLINE_PAYMENT(线下) || EBANK_PAYMENT(落地文件)
   * @param status = P(支付中) || F(退款或失败) || S(成功)
   * @param searchParams = {searchName: searchValue}
   */
  getAmount(type, status, searchParams){
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/select/totalAmountAndDocumentNum?paymentStatus=${status}&paymentTypeCode=${type}`;
    if (type === 'ONLINE_PAYMENT' && status === 'F') url += '&isRefundOrFail=true';
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 获取支付中状态各项数据列表
   * @param page
   * @param pageSize
   * @param value = ONLINE_PAYMENT(线上) || EBANK_PAYMENT(落地文件)
   * @param searchParams = {searchName: searchValue}
   */
  getPayingList(page, pageSize, value, searchParams){
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/paying/query?page=${page}&size=${pageSize}&paymentTypeCode=${value}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 取消支付
   * @param params = {取消支付行的数据对象}
   */
  cancelPay(params){
    return httpFetch.delete(`${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund`, params)
  },

  /**
   * 重新支付
   * @param params =  {
       details: [选中行],
       payDTO: {
        paymentMethodCategory: 'ONLINE_PAYMENT'
        payCompanyBankName: '',
        payCompanyBankNumber: '',
        paymentDescription: '',
        paymentTypeId: '',
        currency: '',
        description: '',
        rate: ''
      }
     }
   */
  rePay(params){
    return httpFetch.post(`${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund`, params)
  },

  /**
   * 获取退款或失败状态各项数据列表
   * @param page
   * @param pageSize
   * @param value = ONLINE_PAYMENT(线上) || EBANK_PAYMENT(落地文件)
   * @param searchParams = {searchName: searchValue}
   */
  getFailList(page, pageSize, value, searchParams){
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/payFailOrRefund/query?page=${page}&size=${pageSize}&paymentTypeCode=${value}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 确认退票
   * @param date = 'YYYY-MM-DD'
   * @param params = {退票行信息}
   */
  confirmRefund(date, params){
    return httpFetch.post(`${config.contractUrl}/payment/api/cash/transaction/details/refund?refundDate=${date}`, params)
  },

  /**
   * 获取成功状态各项数据列表
   * @param page
   * @param pageSize
   * @param value = ONLINE_PAYMENT(线上) || EBANK_PAYMENT(落地文件)
   * @param searchParams = {searchName: searchValue}
   */
  getSuccessList(page, pageSize, value, searchParams){
    let url = `${config.contractUrl}/payment/api/cash/transaction/details/getAlreadyPaid?page=${page}&size=${pageSize}&paymentTypeCode=${value}`;
    for(let searchName in searchParams){
      url += searchParams[searchName] ? `&${searchName}=${searchParams[searchName]}` : '';
    }
    return httpFetch.get(url)
  },

  /**
   * 显示支付历史
   * @param params = 行id
   */
  showPayHistory(params){
    return httpFetch.get(`${config.contractUrl}/payment/api/cash/transaction/details/getHistoryByDateId?id=${params}`)
  },

  /**
   * 获取支付详情
   * @param params = 行id
   */
  getPayDetail(params){
    return httpFetch.get(`${config.contractUrl}/payment/api/cash/transaction/details/getDetailById?id=${params}`)
  },
}
