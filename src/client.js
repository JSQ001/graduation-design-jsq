import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router'
import Login from 'containers/login'

import 'share/common'

import 'styles/common.scss'
import 'static/animate.css'

import config from 'config'

import configureStore from 'stores';
const store = configureStore.reduxStore();

import menuRoute from './share/menu-route'

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Login} />
        {menuRoute.ClientRoute}
      </Router>
    </Provider>
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default; // eslint-disable-line global-require
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}

console.log(config.appEnv);

