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


import 'styles/budget-setting/budget-organization/budget-item/budget-item-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class BudgetItemDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      buttonLoading: false,
      budgetItem:{},
      data: [],
      edit: false,
      visible: false,
      pagination:{
        total:0,
      },
      columns: [
        {title: this.props.intl.formatMessage({id:'structure.companyCode'}), key: 'companyCode', dataIndex: 'companyCode'},/*公司代码*/
        {title: this.props.intl.formatMessage({id:'structure.companyName'}), key: 'companyName', dataIndex: 'companyName'}, /*公司明称*/
        {title: this.props.intl.formatMessage({id:'structure.companyType'}), key: 'companyType', dataIndex: 'companyType'} /*公司类型*/
      ],
    }
  }

  componentWillMount(){
    //根据路径上的id,查出该条预算项目完整数据
    httpFetch.get(`${config.budgetUrl}/api/budget/items/${this.props.params.id[1]}`).then((response)=>{
      if(response.status === 200){
        this.setState({
          budgetItem: response.data
        })
      }
    })
    this.getList();
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.setState({
      buttonLoading: true
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        httpFetch.put(`${config.budgetUrl}/api/budget/items`,values).then((response) => {
          console.log(response)
          if(response.status === 200){
            this.setState({
              buttonLoading: false,
              edit: false
            })
          }
        })
      }
    })
  }

  //查询公司
  getList(){

  }

  renderForm(){
    console.log(this.props)
    const { getFieldDecorator } = this.props.form;
    const { budgetItem, edit, statusCode, buttonLoading} = this.state;
    const periodStrategy = [
      {id:"month",value: this.props.intl.formatMessage({id:"periodStrategy.month"})},  /*月度*/
      {id:"quarter",value: this.props.intl.formatMessage({id:"periodStrategy.quarter"})}, /*季度*/
      {id:"year",value: this.props.intl.formatMessage({id:"periodStrategy.year"})} /*年度*/
    ];
    const options = periodStrategy.map((item)=><Option key={item.id}>{item.value}</Option>)
    return(
      edit ?
        <div className="structure-detail-form">
          <Form onSubmit={this.handleSave}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.organization"}) /*预算组织*/}
                  colon={true}>
                  {getFieldDecorator('organizationName', {
                    initialValue: this.props.organization.organizationName,
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemCode"}) /*预算项目代码*/}
                  colon={true}
                  required={true}>
                  {getFieldDecorator('itemCode', {
                    initialValue: budgetItem.itemCode,
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemName"}) /*预算项目名称*/}
                  colon={true}>
                  {getFieldDecorator('itemName', {
                    initialValue: budgetItem.itemName,
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                      {
                        validator:(item,value,callback)=>{
                          if(value==="")
                            callback();
                          callback();
                        }
                      }
                    ],
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemType"}) /*预算项目类型*/}
                  colon={true}>
                  {getFieldDecorator('itemTypeName', {
                    initialValue:budgetItem.itemTypeName,
                    rules:[
                      {required:true,message: this.props.intl.formatMessage({id:"structure.validatePeriodStrategy"})},
                    ],
                  })(
                    <Select placeholder={this.props.intl.formatMessage({id:"common.please.select"})}  /* {/!*请选择*!/}*/>
                      {options}
                    </Select>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.item.variationAttribute"}) /*变动属性*/}
                  colon={true}>
                  {getFieldDecorator('description', {
                    initialValue:budgetItem.variationAttribute,
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                      {validator:(item,value,callback)=>{
                        if(value==="")
                          callback();
                        callback();
                      }}
                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"common.status"},{status:statusCode}) /* 状态*/}
                  colon={false}>
                  {getFieldDecorator("isEnabled", {
                    initialValue: budgetItem.isEnabled,
                    valuePropName: 'checked',
                    rules:[
                      {
                        validator: (item,value,callback)=>{
                          this.setState({
                            statusCode: value ? this.props.intl.formatMessage({id:"common.statusEnable"}) /*启用*/
                              : this.props.intl.formatMessage({id:"common.statusDisable"}) /*禁用*/
                          })
                          callback();
                        }
                      }
                    ],
                  })
                  (<Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross"/>}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Button loading={buttonLoading} type="primary" htmlType="submit">{this.props.intl.formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button onClick={()=>this.handleEdit(false)} style={{ marginLeft: 8 }}> {this.props.intl.formatMessage({id:"common.cancel"}) /*取消*/}</Button>
          </Form>
        </div>
        :
        <div className="structure-detail-div">
          <Row gutter={40} align="top">
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.organization"}) /*预算组织*/}:</div>
              <div>{this.props.organization.organizationName}</div>
            </Col>
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.structureCode"}) /*预算表代码*/}:</div>
              <div>{budgetItem.itemCode}</div>
            </Col >
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.structureName"}) /*预算表名称*/}:</div>
              <div>{budgetItem.itemName}</div>
            </Col>
          </Row>
          <br/>
          <Row gutter={40} align="top">
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.itemType"}) /*预算项目类型*/}:</div>
              <div>{budgetItem.itemTypeName}</div>
            </Col>
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"budget.item.variationAttribute"}) /*变动属性*/}:</div>
              <div className="structure-detail-description">{budgetItem.variationAttribute}</div>
            </Col>
            <Col span={8}>
              <div className="form-title">{this.props.intl.formatMessage({id:"common.columnStatus"}) /*状态*/}:</div>
              <div>
                <Badge status={true ? 'success' : 'error'}/>
                {true ?
                  this.props.intl.formatMessage({id:"common.statusEnable"}) /*启用*/ :
                  this.props.intl.formatMessage({id:"common.statusDisable"}) /*禁用*/
                }
              </div>
            </Col>
          </Row>
        </div>
    )
  }

  //控制是否编辑
  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //添加公司
  handleAddCompany = ()=>{
    console.log(1)
    this.setState({
      visible: true
    })

  };

  render(){
    const { edit, pagination, columns, data, visible} = this.state;
    return(
      <div className="budget-item-detail">
        <div className="common-top-area">
          <div className="common-top-area-title">
            {this.props.intl.formatMessage({id:"budget.basicInformation"}) /*基本信息*/}
            {!edit ? <span className="title-edit" onClick={()=>this.handleEdit(true)}>{this.props.intl.formatMessage({id:"budget.edit"}) /*编辑*/}</span> : null}
          </div>
          <div className="common-top-area-content form-title-area ">
            {this.renderForm()}
          </div>
        </div>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleAddCompany}>{this.props.intl.formatMessage({id: 'structure.addCompany'})}</Button>  {/*添加公司*/}
            <Button>{this.props.intl.formatMessage({id: 'common.save'})}</Button>
          </div>
          <ListSelector type='company' visible={visible}/>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>
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

