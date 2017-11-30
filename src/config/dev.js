import baseConfig from './base';

const config = {
  appEnv: 'dev',
  budgetUrl: 'http://rjfin.haasgz.hand-china.com:30496',
  baseUrl: 'http://139.224.220.217:11013',
  // baseUrl: 'http://apiuat.huilianyi.com',
  payUrl: 'http://rjfin.haasgz.hand-china.com:30498/payment',
  contractUrl: 'http://rjfin.haasgz.hand-china.com:30498',
  localUrl:'http://localhost:9998'

};

export default Object.freeze(Object.assign({}, baseConfig, config));
