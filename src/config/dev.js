import baseConfig from './base';

const config = {
  appEnv: 'dev',
  budgetUrl: 'http://rjfin.haasgz.hand-china.com:30496',
  baseUrl: 'http://139.224.220.217:9084',
  payUrl: 'http://rjfin.haasgz.hand-china.com:30497'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
