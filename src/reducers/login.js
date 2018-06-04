/**
 * Created by zaranengap on 2017/7/3.
 */
import {combineReducers} from 'redux';
import {cr} from 'share/utils'
import {SET_USER,SET_ROLE} from 'actions/login'

export default combineReducers({
  user: cr({}, {
    [SET_USER](state, {user}){return user}
  }),
  role: cr({}, {
    [SET_ROLE](state, {role}){return role}
  }),
})
