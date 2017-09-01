import baseConfig from './base';

const config = {
  appEnv: 'dev',
  baseUrl: 'http://stage.huilianyi.com'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
