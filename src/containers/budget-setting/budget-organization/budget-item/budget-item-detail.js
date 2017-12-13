/**
 *  created by jsq on 2017/9/22
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import config from 'config'
import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message, Checkbox   } from 'antd'

import ListSelector from 'components/list-selector.js'
import BasicInfo from 'components/basic-info'
import 'styles/budget-setting/budget-organization/budget-item/budget-item-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class BudgetItemDetail extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      buttonLoading: false,
      companyListSelector: false,  //控制公司选则弹框
      budgetItem:{},
      data: [],
      edit: false,
      visible: false,
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      infoList: [
        {type: 'input', id: 'organizationName', isRequired: true, disabled: true, label: formatMessage({id: 'budget.organization'})+" :" /*预算组织*/},
        {type: 'input', id: 'itemCode', isRequired: true, disabled: true, label: formatMessage({id: 'budget.itemCode'})+" :" /*预算项目代码*/},
        {type: 'input', id: 'itemName', isRequired:true, label: formatMessage({id: 'budget.itemName'}) +" :"/*预算项目名称*/},
        {type: 'select',options: [] , id: 'itemTypeName', required:true, disabled: true, label:"预算项目类型："},
        {type: 'input', id: 'description', label: formatMessage({id: 'budget.itemDescription'}) +" :"/*预算项目描述*/},
        {type: 'switch', id: 'isEnabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],

      columns: [
        {title: formatMessage({id:'structure.companyCode'}), key: 'companyCode', dataIndex: 'companyCode'},/*公司代码*/
        {title: formatMessage({id:'structure.companyName'}), key: 'companyName', dataIndex: 'companyName'}, /*公司明称*/
        {title: formatMessage({id:'structure.companyType'}), key: 'companyTypeName', dataIndex: 'companyTypeName', /*公司类型*/
          render: desc => <span>{desc ? desc : '-'}</span>
        },
        {                        /*启用*/
          title:formatMessage({id:"structure.enablement"}), key: "doneRegisterLead", dataIndex: 'doneRegisterLead',width:'10%',
          render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>
        },
      ],
    }
  }

  //改变启用状态
  onChangeEnabled = (e, record) => {
    this.setState({loading: true});
    record.isEnabled = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/item/companies`, record).then(() => {
      this.getList()
    })
  };

  componentWillMount(){
    //根据路径上的id,查出该条预算项目完整数据
    httpFetch.get(`${config.budgetUrl}/api/budget/items/${this.props.params.itemId}`).then((response)=>{
      if(response.status === 200){
        response.data.itemTypeName = {label:response.data.itemTypeName,value:response.data.itemTypeName};
        response.data.variationAttribute = {label:response.data.variationAttributeName,value:response.data.variationAttribute};
        this.setState({
          budgetItem: response.data
        })
      }
    });
    this.getList();
  }


  //保存所做的详情修改
  handleUpdate = (value) => {
    value.organizationId = this.state.budgetItem.organizationId;
    value.id = this.state.budgetItem.id;
    value.versionNumber = this.state.budgetItem.versionNumber;
    httpFetch.put(`http://192.168.1.72:9996/api/budget/items`,value).then((response)=>{
      if(response) {
        response.data.organizationName = this.state.budgetItem.organizationName;
        response.data.itemTypeName = {label:value.itemTypeName,value:value.itemTypeName};
        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        this.setState({
          budgetItem: response.data,
          edit: true
        })
      }
    })
  };

  //查询已经分配过的公司
  getList(){
    const {pagination} = this.state;
    httpFetch.get(`${config.budgetUrl}/api/budget/item/companies/query?itemId=${this.props.params.itemId}&page=${pagination.page}&size=${pagination.pageSize}`).then((response)=>{
      response.data.map((item)=>{
        item.key= item.id
      });
      if(response.status === 200){
        let pagination = this.state.pagination;
        pagination.total = Number(response.headers['x-total-count']);
        this.setState({
          loading: false,
          data: response.data,
          pagination
        })
      }
    })
  }


  //控制是否编辑
  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  //处理公司弹框点击ok,分配公司
  handleListOk = (result) => {
    let companyIds = [];
    let resourceIds = [];
    resourceIds.push(this.props.params.itemId);
    result.result.map((item)=>{
      companyIds.push(item.id)
    });
    let param = [];
    param.push({"companyIds": companyIds, "resourceIds": resourceIds});
    httpFetch.post(`${config.budgetUrl}/api/budget/item/companies/batch/assign/company`,param).then((response)=>{
      if(response.status === 200){
        this.showListSelector(false);
        message.success(`${this.props.intl.formatMessage({id:"common.operate.success"})}`);
        this.setState({
          loading: true
        },this.getList())
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})},${e.response.data.message}`)
      }
    });
  };

  //返回预算项目
  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetOrganizationDetail.url.replace(':id', this.props.params.id)+ '?tab=ITEM');
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      loading: true,
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  render(){
    const { loading,edit, pagination, columns, data, visible, infoList, budgetItem, companyListSelector} = this.state;
    return(
      <div className="budget-item-detail">
        <BasicInfo
            infoList={infoList}
            infoData={budgetItem}
            updateHandle={this.handleUpdate}
            updateState={edit}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.showListSelector(true)}>{this.props.intl.formatMessage({id: 'structure.addCompany'})}</Button>  {/*添加公司*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>

        <ListSelector type="company_item"
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      extraParams={{itemId: this.props.params.itemId}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>)
  }
}
BudgetItemDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetItemDetail = Form.create()(BudgetItemDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetItemDetail));

