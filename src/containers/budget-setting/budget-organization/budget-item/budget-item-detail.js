/**
 *  created by jsq on 2017/9/22
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message  } from 'antd'

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
        {type: 'select',options: [] , id: 'itemTypeName', required:true, disabled: true, label:"项目类型"},
        {type: 'select',options: [] , id: 'variationAttribute',disabled: true, label: formatMessage({id: 'budget.item.variationAttribute'}) +" :"/*变动属性*/},
        {type: 'input', id: 'description', label: formatMessage({id: 'budget.itemDescription'}) +" :"/*预算项目描述*/},
        {type: 'switch', id: 'isEnabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],

      columns: [
        {title: formatMessage({id:'structure.companyCode'}), key: 'companyCode', dataIndex: 'companyCode'},/*公司代码*/
        {title: formatMessage({id:'structure.companyName'}), key: 'companyName', dataIndex: 'companyName'}, /*公司明称*/
        {title: formatMessage({id:'structure.companyType'}), key: 'companyType', dataIndex: 'companyType'} /*公司类型*/
      ],
    }
  }

  componentWillMount(){
    //根据路径上的id,查出该条预算项目完整数据
    httpFetch.get(`${config.budgetUrl}/api/budget/items/${this.props.params.itemId}`).then((response)=>{
      if(response.status === 200){
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
    httpFetch.put(`${config.budgetUrl}/api/budget/items`,value).then((response)=>{
      if(response) {
        console.log(response)

        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        this.setState({
          budgetItem: response.data,
          edit: true
        })
      }
    })
  };

  //分配公司
  handleSave = (e) =>{

    /*this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        httpFetch.put(`${config.budgetUrl}/api/budget/items`,values).then((response) => {
          if(response.status === 200){
            this.setState({
              buttonLoading: false,
              edit: false
            })
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`修改失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          }
          else {
            console.log(e)
          }
        })
      }
    })*/
  };

  //查询公司
  getList(){

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

  //处理公司弹框点击ok
  handleListOk = (result) => {
    console.log(result)
    this.setState({
        data: result.result
      },
      this.showListSelector(false)
    );
  };


  render(){
    const { edit, pagination, columns, data, visible, infoList, budgetItem, companyListSelector} = this.state;
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
            <Button onClick={this.handleSave()}>{this.props.intl.formatMessage({id: 'common.save'})}</Button>
          </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>

        <ListSelector type="company"
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>)
  }
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetItemDetail = Form.create()(BudgetItemDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetItemDetail));

