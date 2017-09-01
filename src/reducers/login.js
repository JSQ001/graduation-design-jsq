/**
 * Created by zaranengap on 2017/7/3.
 */
import {combineReducers} from 'redux';
import {cr} from 'share/utils'
import {INPUT_USERNAME, INPUT_PASSWORD, SET_USER} from 'actions/login'

export default combineReducers({
  username: cr('', {
    [INPUT_USERNAME](state, {value}){return value}
  }),
  password: cr('', {
    [INPUT_PASSWORD](state, {value}){return value}
  }),
  user: cr({}, {
    [SET_USER](state, {user}){return user}
  })
})
