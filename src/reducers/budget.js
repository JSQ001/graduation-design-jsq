/**
 * Created by ZaraNengap on 2017/09/18
 */
import {combineReducers} from 'redux';
import {SET_ORGANIZATION} from 'actions/budget'
import {cr} from 'share/utils'

export default combineReducers({
  organization: cr({}, {
    [SET_ORGANIZATION](state, {organization}){return organization}
  })
})
