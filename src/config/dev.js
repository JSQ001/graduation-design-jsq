import baseConfig from './base';
const config = {
  appEnv: 'dev',
  baseUrl: 'http://localhost:9995'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
