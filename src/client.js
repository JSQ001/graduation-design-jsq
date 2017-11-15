import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from 'containers/App'

import 'share/common'

import 'styles/common.scss'
import 'static/animate.css'

import config from 'config'

import configureStore from 'stores';
const store = configureStore.reduxStore();

/**
 *          ___   ___    ________   ___        ________    _________   _______
 *         /  /  /  /  /  ______/  /  /       /__   __ /  /  ___   /  /  ____/
 *        /  /  /  /  /  /        /  /          /  /     /  /  /  /  /  /
 *       /  /__/  /  /  /_____   /  /          /  /     /  /  /  /  /  /___
 *      /  ___   /  /  ______/  /  /          /  /     /  /  /  /  /___   /
 *     /  /  /  /  /  /        /  /          /  /     /  /  /  /      /  /
 *    /  /  /  /  /  /_____   /  /_____   __/  /__   /  /__/  /  ____/  /
 *   /__/  /__/  /________/  /________/  /_______/  /________/  /______/
 *
 * -------------------------------------------------------------------------
 *
 *                         汇联易中控重构项目入口
 */
ReactDOM.render(
  <AppContainer warnings={false}>
    <Provider store={store}>
      <App/>
    </Provider>
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default; // eslint-disable-line global-require
    ReactDOM.render(
      <AppContainer warnings={false}>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}

console.log(config.appEnv);

