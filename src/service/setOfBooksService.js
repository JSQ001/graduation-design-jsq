import config from 'config'
import httpFetch from 'share/httpFetch'

export default {
  //根据租户查询帐套信息
  getSetOfBooksByTenant(){
    return httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`)
  }
}
