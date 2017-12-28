import config from 'config'
import httpFetch from 'share/httpFetch'

export default {
  getOrganization(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/organizations/query`, params)
  }
}
