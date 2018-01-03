import config from 'config'
import httpFetch from 'share/httpFetch'

export default {
  getExpenseTypesByFormOID(formOID){
    return httpFetch.get(`${config.baseUrl}/api/v2/custom/forms/${formOID}/selected/expense/types`)
  },

  getExpeenseTypeCategory(){
    return httpFetch.get(`${config.baseUrl}/api/expense/types/category`)
  }
}
