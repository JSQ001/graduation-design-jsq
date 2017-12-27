import baseConfig from './base';

const config = {
  appEnv: 'dist',
  budgetUrl: 'http://116.228.77.183:25297/budget',
  baseUrl: 'http://116.228.77.183:25297',
  payUrl: 'http://116.228.77.183:25297/payment',
  contractUrl: 'http://116.228.77.183:25297/',

};

export default Object.freeze(Object.assign({}, baseConfig, config));
