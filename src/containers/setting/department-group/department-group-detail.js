/**
 *  created by jsq on 2017/11/10
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import config from 'config'
import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message  } from 'antd'

import ListSelector from 'components/list-selector.js'
import BasicInfo from 'components/basic-info'
import 'styles/budget-setting/budget-organization/budget-item/budget-item-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DepartmentGroupDetail extends React.Component{
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
      selectedRowKeys: [],
      selectedEntityOIDs: [],   //已选择的列表项的OIDs
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      infoList: [
        {type: 'input', id: 'companyGroupCode', isRequired: true, disabled: true, label: "公司组代码"+" :"},
        {type: 'input', id: 'companyGroupName', isRequired: true, label: "公司组名称"+" :" },
        {type: 'select',options: [] , id: 'setOfBook', required:true, label:"账套"},
        {type: 'switch', id: 'isEnabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],

      columns: [
        {title: formatMessage({id:'structure.companyCode'}), key: 'companyCode', dataIndex: 'companyCode'},/*公司代码*/
        {title: formatMessage({id:'structure.companyName'}), key: 'companyName', dataIndex: 'companyName'}, /*公司明称*/
        {title: formatMessage({id:'structure.companyType'}), key: 'companyType', dataIndex: 'companyType'}, /*公司类型*/
        {                        /*启用*/
          title:formatMessage({id:"structure.enablement"}), key: "doneRegisterLead", dataIndex: 'doneRegisterLead',width:'10%',
          render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>
        },
      ],
    }
  }

  componentWillMount(){
    //根据路径上的id,查出该条预算项目完整数据
    httpFetch.get(`${config.budgetUrl}/api/budget/items/${this.props.params.itemId}`).then((response)=>{
      if(response.status === 200){
        response.data.itemTypeName = {label:response.data.itemTypeName,value:response.data.itemTypeName};
        response.data.variationAttribute = {label:response.data.variationAttributeName,value:response.data.variationAttributeName};
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
    console.log(this.state.budgetItem)
    httpFetch.put(`${config.budgetUrl}/api/budget/items`,value).then((response)=>{
      if(response) {
        console.log(response)
        response.data.organizationName = this.state.budgetItem.organizationName;
        console.log(value)
        response.data.itemTypeName = {label:value.itemTypeName,value:value.itemTypeName};
        response.data.variationAttribute = {label:response.data.variationAttribute,value:response.data.variationAttribute};
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
    httpFetch.get(`${config.budgetUrl}/api/budget/item/companies/query?itemId=${this.props.params.itemId}`).then((response)=>{
      console.log(response)
      if(response.status === 200){
        this.setState({
          loading: false,
          data: response.data
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
    resourceIds.push(parseInt(this.props.params.itemId));
    result.result.map((item)=>{
      companyIds.push(item.id)
    });
    let param = [];
    param.push({"companyIds": companyIds, "resourceIds": resourceIds});
    httpFetch.post(`${config.budgetUrl}/api/budget/item/companies/batch/assign/company`,param).then((response)=>{
      if(response.status === 200){
        this.showListSelector(false);
        this.setState({
          loading: true
        },this.getList())
      }
    });
  };

  //返回预算项目
  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('company-group', 'key').url);
  };

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.id);
    else
      temp.delete(record.id);
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.id === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  render(){
    const { edit, pagination, columns, data, visible, infoList, budgetItem, companyListSelector, selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };

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
            <Button type="primary" onClick={()=>this.showListSelector(true)}>{this.props.intl.formatMessage({id: 'common.add'})}</Button>  {/*添加公司*/}
            <Button disabled onClick={()=>this.showListSelector(true)}>{this.props.intl.formatMessage({id: 'common.delete'})}</Button>
            </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          pagination={pagination}
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
DepartmentGroupDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedDepartmentGroupDetail = Form.create()(DepartmentGroupDetail);

export default connect(mapStateToProps)(injectIntl(WrappedDepartmentGroupDetail));

