import config from 'config'
import httpFetch from 'share/httpFetch'

export default {
  //条件查询科目段结构
  getSectionStructures(params){
    return httpFetch.get(`${config.locationUrl}/api/general/ledger/segment/sets/query`,params)
  }
}
