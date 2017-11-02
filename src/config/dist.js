import baseConfig from './base';

const config = {
  appEnv: 'dist',
  budgetUrl: '',
  baseUrl: '',
  payUrl: ''
};

export default Object.freeze(Object.assign({}, baseConfig, config));
