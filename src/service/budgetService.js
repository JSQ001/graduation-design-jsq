import config from 'config'
import httpFetch from 'share/httpFetch'

export default {

  //根据id查询当前预算组织
  getOrganizationsById(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${id}`)
  },

  //条件搜索预算组织(分页)
  getOrganizations(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/organizations/query`, params)
  },

  //新增预算组织
  addOrganization(organization){
    return httpFetch.post(`${config.budgetUrl}/api/budget/organizations`, organization)
  },

  //更新预算组织
  updateOrganization(organization){
    return httpFetch.put(`${config.budgetUrl}/api/budget/organizations`, organization)
  },

  //根据预算组织id得到预算组织信息
  getOrganizationById(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${id}`)
  },

  //根据帐套id得到默认预算组织信息
  getOrganizationBySetOfBooksId(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/${id}`)
  },

  //条件搜索预算组(分页)
  getOrganizationGroups(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/groups/query`, params)
  },

  //新增预算组
  addOrganizationGroup(group){
    return httpFetch.post(`${config.budgetUrl}/api/budget/groups`, group)
  },

  //更新预算组
  updateOrganizationGroup(group){
    return httpFetch.put(`${config.budgetUrl}/api/budget/groups`, group)
  },

  //根据预算组id得到预算组信息
  getOrganizationGroupById(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/groups/${id}`)
  },

  //根据预算项目组id与预算组织id查找当前预算项目组中未被添加的预算项目（不分页）
  filterItemByGroupIdAndOrganizationId(groupId, organizationId){
    return httpFetch.get(`${config.budgetUrl}/api/budget/groupDetail/${groupId}/query/filterAll?organizationId=${organizationId}`)
  },

  //根据预算组Id查找预算组下的预算项目（分页）
  getItemByGroupId(groupId, page, size){
    return httpFetch.get(`${config.budgetUrl}/api/budget/groupDetail/${groupId}/query?page=${page}&size=${size}`)
  },

  //根据id从预算组内删除单个预算项目
  deleteItemFromGroup(groupId, itemId){
    return httpFetch.delete(`${config.budgetUrl}/api/budget/groupDetail/${groupId}/${itemId}`)
  },

  //根据id从预算组内批量删除预算项目
  batchDeleteItemFromGroup(groupId, itemList){
    return httpFetch.delete(`${config.budgetUrl}/api/budget/groupDetail/${groupId}/batch`, itemList)
  },

  //为预算组批量增加预算项目
  batchAddItemToGroup(groupId, itemList){
    return httpFetch.post(`${config.budgetUrl}/api/budget/groupDetail/${groupId}/batch`, itemList)
  },

  //条件搜索预算表（分页）
  getStructures(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/structures/query`,params)
  },

  //根据id查询预算表
  getStructureById(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/structures/${id}`)
  },

  //查询所有预算表（不分页）
  getAllStructures(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/structures/queryAll`,params)
  },

  //更新预算表
  updateStructures(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/structures`,params)
  },

  //新增预算表
  addStructure(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/structures`,params)
  },

  //获取某预算表下分配的公司
  getCompanyAssignedStructure(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/structure/assign/companies/query`,params)
  },

  //预算表分配公司
  structureAssignCompany(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/structure/assign/companies/batch`,params)
  },

  //改变某预算表分配的公司状态
  updateStructureAssignCompany(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/structure/assign/companies`,params)
  },

  //预算表分配维度
  structureAssignDimension(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/structure/assign/layouts`,params)
  },

  //预算表更新维度
  structureUpdateDimension(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/structure/assign/layouts`,params)
  },

  //获取某预算表下分配的维度
  getDimensionAssignedStructure(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/structure/assign/layouts/query`,params)
  },

  //查询预算项目（不分页）
  getItems(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/items/find/all`,params)
  },

  //条件查询预算项目（分页）
  getItemsByOption(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/items/query`,params)
  },

  //根据id查询预算项目
  getItemById(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/items/${id}`)
  },

  //新增预算项目
  addItem(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/items`,params)
  },

  //更新预算项目
  updateItem(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/items`,params)
  },

  //预算项目批量分配公司
  batchAddCompanyToItem(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/item/companies/batch/assign/company`,params)
  },

  //查询预算项目已分配的公司
  itemAssignedCompany(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/item/companies/query`,params)
  },

  //改变某项目已分配的公司的状态
  updateItemAssignedCompany(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/item/companies`,params)
  },

  //条件查询控制规则（分页）
  getRuleByOptions(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/control/rules/query`,params)
  },

  //根据id查询规则
  getRuleById(id){
    return httpFetch.get(`${config.budgetUrl}/api/budget/control/rules/${id}`)
  },

  //更新预算规则
  updateRule(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/control/rules`,params)
  },

  //增加预算规则
  addRule(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/control/rules`,params)
  },

  //获取规则明细
  getRuleDetail(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/control/rule/details/query`,params)
  },

  //新增规则明细
  addRuleDetail(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/control/rule/details`,params)
  },

  //更新规则名称
  updateRuleDetail(params){
    return httpFetch.put(`${config.budgetUrl}/api/budget/control/rule/details`,params)
  },

  //删除规则名称
  deleteRuleDetail(id){
    return httpFetch.delete(`${config.budgetUrl}/api/budget/control/rule/details/${id}`)
  },

  //获取成本中心
  getCostCenter(){
    return httpFetch.get(`${config.baseUrl}/api/cost/center/company`)
  },

  //条件查询项目映射（分页）
  getItemMapByOptions(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/itemsMapping/selectByInput`,params)
  },

  //新增或修改项目映射
  insertOrUpdateItemMap(params){
    return httpFetch.post(`${config.budgetUrl}/api/budget/itemsMapping/insertOrUpdate`,params)
  },

  //删除项目映射
  deleteItemMap(params){
    return httpFetch.delete(`${config.budgetUrl}/api/budget/itemsMapping/deleteByIds`,params)
  },

  //查询预算策略（不分页）
  getStrategy(params){
    return httpFetch.get(`${config.budgetUrl}/api/budget/control/strategies/query/all`,params)
  },



}
