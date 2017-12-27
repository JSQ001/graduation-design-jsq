import baseConfig from './base';
const config = {
  appEnv: 'dev',
  budgetUrl: 'http://116.228.77.183:25297/budget',
  uatUrl: 'http://116.228.77.183:25297',
  baseUrl: 'http://116.228.77.183:25297',
  //baseUrl: 'http://116.228.77.183:25297',
  payUrl: 'http://116.228.77.183:25297/payment',
  contractUrl: 'http://116.228.77.183:25297',
  localUrl:'http://116.228.77.183:25297',
  liouliangUrl:'http://116.228.77.183:25297',
  prePaymentUrl: "http://116.228.77.183:25297/prepayment",
  cdcUrl:'http://116.228.77.183:25297'


};

export default Object.freeze(Object.assign({}, baseConfig, config));
