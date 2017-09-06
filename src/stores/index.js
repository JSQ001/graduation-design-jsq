import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from 'reducers'

const logger = store => next => action => {
  // window.console.log('dispatching', action);
  next(action);
  // window.console.log('next state', store.getState());
};

const store = {
  store: {},

  reduxStore: function(initialState) {

    let createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)
    let store = createStoreWithMiddleware(reducers, initialState,
      window.devToolsExtension && window.devToolsExtension());

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        // We need to require for hot reloading to work properly.
        const nextReducer = require('../reducers');  // eslint-disable-line global-require

        store.replaceReducer(nextReducer);
      });
    }

    this.store = store;

    return store;
  }
};


export default store;
