/**
 * Created by zaranengap on 2017/11/01.
 */
import {combineReducers} from 'redux';
import {cr} from 'share/utils'
import {SET_CODING_RULE_OBJECT_ID} from 'actions/setting'

export default combineReducers({
  codingRuleObjectId: cr('', {
    [SET_CODING_RULE_OBJECT_ID](state, {codingRuleObjectId}){return codingRuleObjectId}
  })
})
