import baseConfig from './base';

const config = {
  appEnv: 'dev',
  baseUrl: 'http://139.224.220.217:11013',
  budgetUrl: 'http://rjfin.haasgz.hand-china.com:30496'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
