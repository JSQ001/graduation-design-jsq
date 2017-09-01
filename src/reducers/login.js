/**
 * Created by zaranengap on 2017/7/3.
 */
import {combineReducers} from 'redux';
import {cr} from 'share/utils'
import {SET_USER, SET_PROFILE, SET_COMPANY} from 'actions/login'

export default combineReducers({
  user: cr({}, {
    [SET_USER](state, {user}){return user}
  }),
  profile: cr({}, {
    [SET_PROFILE](state, {profile}){return profile}
  }),
  company: cr({}, {
    [SET_COMPANY](state, {company}){return company}
  })
})
