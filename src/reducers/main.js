/**
 * Created by zaranengap on 2017/7/4.
 */
import {combineReducers} from 'redux';
import {SET_CURRENT_PAGE} from 'actions/main'
import {cr} from 'share/utils'

export default combineReducers({
  currentPage: cr([{name: 'Dashboard', key:'dashboard', url:'/main'}], {
    [SET_CURRENT_PAGE](state, {currentPage}){return currentPage}
  })
})
