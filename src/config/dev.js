import baseConfig from './base';
const config = {
  appEnv: 'dev',
  budgetUrl: 'http://rjfin.haasgz.hand-china.com:30496',
  // budgetUrl: 'http://uat.huilianyi.com/budget-service',
  uatUrl: 'https://apiuat.huilianyi.com',
  baseUrl: 'http://139.224.2.45:11011',
  // baseUrl: 'http://apiuat.huilianyi.com',
  locationUrl: 'http://116.228.77.183:25299',
  payUrl: 'http://rjfin.haasgz.hand-china.com:30498/payment',
  contractUrl: 'http://rjfin.haasgz.hand-china.com:30498',
  prePaymentUrl: "http://rjfin.haasgz.hand-china.com:30498/prepayment",
  cdcUrl:'http://192.168.1.72:9996',
  vendorUrl:`http://139.224.2.45:11012` //供应商url    +  /vendor-info-service
};

export default Object.freeze(Object.assign({}, baseConfig, config));
