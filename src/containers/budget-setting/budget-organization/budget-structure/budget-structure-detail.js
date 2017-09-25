/**
 *  created by jsq on 2017/9/20
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import debounce from 'lodash.debounce';


import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;


class BudgetStructureDetail extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      edit:false,
      statusCode: this.props.intl.formatMessage({id:"common.statusEnable"}) /*启用*/,
      total:0,
      data:[],
      pagination:{},
      columns:[
        {
          title:this.props.intl.formatMessage({id:"structure.dimensionCode"}), key: "dimensionCode", dataIndex: 'dimensionCode'   /*维度代码*/
        },
        {
          title:this.props.intl.formatMessage({id:"structure.description"}), key: "description", dataIndex: 'description'   /*描述*/
        },
        {
          title:this.props.intl.formatMessage({id:"structure.layoutPosition"}), key: "layoutPosition", dataIndex: 'layoutPosition'   /*布局位置*/
        },
        {
          title:this.props.intl.formatMessage({id:"structure.layoutPriority"}), key: "layoutPriority", dataIndex: 'layoutPriority'   /*布局顺序*/
        },
        {
          title:this.props.intl.formatMessage({id:"structure.defaultDimValueName"}), key: "defaultDimValueName", dataIndex: 'defaultDimValueName'   /*默认维值*/
        },
        {
          title:this.props.intl.formatMessage({id:"structure.opetation"}), key: "opration", dataIndex: 'opration'   /*操作*/
        },
      ],
      structure:this.props.location.state,
      tabs: [
        {key: 'distribute-dimension', name: this.props.intl.formatMessage({id:"structure.dimensionDistribute"})}, /*维度分配*/
        {key: 'distribute-company', name: this.props.intl.formatMessage({id:"structure.companyDistribute"})}  /*公司分配*/
        ],
      form: {
        name: '',
        enabled: true
      },
    }
    this.handleSearchDimension = debounce(this.handleSearchDimension,1000)
  }

  componentWillMount(){
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/${this.props.params.id}`).then((response)=>{
      console.log(response)
    })
  }


  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //详情页面修改刚新建的预算表
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // delete values.organizationName
        values.id = this.state.structure.id;
        values.versionNumber = this.state.structure.versionNumber;
        values.organizationId = this.state.structure.organizationId;
        console.log(values)
        httpFetch.put(`${config.budgetUrl}/api/budget/structures`,values).then((response)=>{
          if(response) {
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            this.handleEdit(false)
          }
        })
      }
    });
  }

  renderForm(){
    const { getFieldDecorator } = this.props.form;
    const { structure, edit, statusCode } = this.state;
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
                  label={this.props.intl.formatMessage({id:"budget.organization"})}  /*{/!*预算组织*!/}*/
                  colon={true}>
                  {getFieldDecorator('organizationName', {
                    initialValue: structure.organizationName,
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.structureCode"})} /* {/!*预算表代码*!/}*/
                  colon={true}
                  required={true}>
                  {getFieldDecorator('structureCode', {
                    initialValue: structure.structureCode,
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.structureName"})} /* {/!*预算表名称*!/}*/
                  colon={true}>
                  {getFieldDecorator('structureName', {
                    initialValue: structure.structureName,
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
                  label={this.props.intl.formatMessage({id:"budget.periodStrategy"})}  /*{/!*编制期段*!/}*/
                  colon={true}>
                  {getFieldDecorator('periodStrategy', {
                    initialValue:structure.periodStrategy,
                    rules:[
                      {required:true,message: this.props.intl.formatMessage({id:"structure.validatePeriodStrategy"})}, /*该预算表已被预算日记账引用，不允许修改编制期段。*/
                      {
                        //编制预算表如果被预算日记账引用，则不允许修改编制期段。
                        validator:(item,value,callback)=>{
                          httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/headers?structureId=${structure.id}`).then((response)=>{
                            if(response.data.length>0){
                              callback()
                            }
                            callback()
                          })
                        }
                      }
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
                  label={this.props.intl.formatMessage({id:"budget.structureDescription"})} /* {/!*预算表描述*!/}*/
                  colon={true}>
                  {getFieldDecorator('description', {
                    initialValue:structure.description,
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
                    initialValue: structure.isEnabled,
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
            <Button type="primary" htmlType="submit">{this.props.intl.formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button onClick={()=>this.handleEdit(false)} style={{ marginLeft: 8 }}> {this.props.intl.formatMessage({id:"common.cancel"}) /*取消*/}</Button>
          </Form>
        </div>
        :
        <div className="structure-detail-div">
        <Row gutter={40} align="top">
          <Col span={8}>
            <div className="form-title">{this.props.intl.formatMessage({id:"budget.organization"}) /*预算组织*/}:</div>
            <div>{/*{structure.organizationName}*/}111</div>
          </Col>
          <Col span={8}>
            <div className="form-title">{this.props.intl.formatMessage({id:"budget.structureCode"}) /*预算表代码*/}:</div>
            <div>SS{/*{structure.structureCode}*/}</div>
          </Col >
          <Col span={8}>
            <div className="form-title">{this.props.intl.formatMessage({id:"budget.structureName"}) /*预算表名称*/}:</div>
            <div>{/*{structure.structureName}*/}111</div>
          </Col>
        </Row>
        <br/>
        <Row gutter={40} align="top">
          <Col span={8}>
            <div className="form-title">{this.props.intl.formatMessage({id:"budget.periodStrategy"})}:</div>
            <div>{/*{ structure.periodStrategy=="month"?"月度":(structure.periodStrategy="quarter"?"季度":"年度")}*/}11</div>
          </Col>
          <Col span={8}>
            <div className="form-title">{this.props.intl.formatMessage({id:"budget.structureDescription"}) /*预算表描述*/}:</div>
            <div className="structure-detail-description">qwqw{/*{structure.description}*/}</div>
          </Col>
          <Col span={8}>
            <div className="form-title">{this.props.intl.formatMessage({id:"common.columnStatus"}) /*状态*/}:</div>
            <div>  {/*structure.isEnabled*/}
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

  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  //Tabs点击
  onChangeTabs = (key) => {
    this.setState({
      loading: true,
      page: 0,
      status: key
    },()=>{
     // this.getList()
    });
  };

  handleSearchDimension = (e) =>{
    console.log(e.target.value)
  //调维度查询接口
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, edit, form, total, data, columns, pagination} = this.state;
    return(
      <div className="budget-structure-detail">
        <div className="common-top-area">
          <div className="common-top-area-title">
            {this.props.intl.formatMessage({id:"budget.basicInformation"}) /*基本信息*/}
            {!edit ? <span className="title-edit" onClick={()=>this.handleEdit(true)}>{this.props.intl.formatMessage({id:"budget.edit"}) /*编辑*/}</span> : null}
          </div>
          <div className="common-top-area-content form-title-area ">
            {this.renderForm()}
          </div>
        </div>
        <div className="structure-detail-distribution">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.add'})}</Button>  {/*添 加*/}
            <Search className="table-header-search"
                    onChange={this.handleSearchDimension}
                    placeholder={this.props.intl.formatMessage({id: 'structure.searchDimension'})}/>
          </div>
        </div>
        <Table
            dataSource={data}
            columns={columns}
            pagination={pagination}
            size="middle"
            bordered/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetStructureDetail = Form.create()(BudgetStructureDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetStructureDetail));
