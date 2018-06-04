import { combineReducers } from 'redux';
import login from 'reducers/login'
import main from 'reducers/main'
const reducers = {
  login,main
};
const combined = combineReducers(reducers);
module.exports = combined;
