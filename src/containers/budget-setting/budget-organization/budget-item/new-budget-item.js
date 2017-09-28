/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Select,Input, Col, Row, Switch, message, Icon } from 'antd';

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'


import "styles/budget-setting/budget-organization/budget-item/new-budget-item.scss"

const FormItem = Form.Item;
const Option = Select.Option;

class NewBudgetItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      organization: {},
      statusCode: this.props.intl.formatMessage({id:"common.statusEnable"}),  /*启用*/
    }
    console.log(this.props)
  }
  componentWillMount(){
    typeof this.props.organization.organizationName === "undefined" ?
      httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${this.props.params.id}`).then((response) =>{
        this.setState({
          organization: response.data,
        })
      })
      :
      this.setState({
        organization: this.props.organization,
      })
  }

  //新建预算项目
  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.organizationId = this.state.organization.id;
        console.log(values)
        values.itemTypeId = 1;
        values.versionNumber = 1.0;
        values.isDeleted = false;
        values.createdBy = 12
        values.createdDate = '2017-09-22T11:07:16+08:00'
        values.lastUpdatedBy = 1;
        httpFetch.post(`${config.budgetUrl}/api/budget/items`,values).then((response)=>{
          if(response) {
            console.log(response)
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            response.data.organizationName = values.organizationName;
            this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetItemDetail.url.replace(':id', this.props.params.id).replace(':id',response.data.id));
          }
        })

      }
    });

  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { organization, statusCode} = this.state;
    const periodStrategy = [
      {id:"month",value: this.props.intl.formatMessage({id:"periodStrategy.month"})},  /*月度*/
      {id:"quarter",value: this.props.intl.formatMessage({id:"periodStrategy.quarter"})}, /*季度*/
      {id:"year",value: this.props.intl.formatMessage({id:"periodStrategy.year"})} /*年度*/
    ];
    const options = periodStrategy.map((item)=><Option key={item.id}>{item.value}</Option>)

    const attribute = [
      {id:"immobilization",value: this.props.intl.formatMessage({id:"variationAttribute.immobilization"})},  /*固定*/
      {id:"quarter",value: this.props.intl.formatMessage({id:"variationAttribute.mix"})}, /*混合*/
      {id:"year",value: this.props.intl.formatMessage({id:"variationAttribute.alteration"})} /*变动*/
    ];
    const variationAttribute = attribute.map((item)=><Option key={item.id}>{item.value}</Option>)
    return (
      <div className="new-budget-item">
        <div className="budget-item-form">
          <Form onSubmit={this.handleSave} className="budget-structure-form">
            <Row gutter={60}>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.organization"})}  /*{/!*预算组织*!/}*/
                  colon={true}>
                  {getFieldDecorator('organizationName', {
                    initialValue: organization.organizationName,
                    rules:[
                      { required:true }
                    ]
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemCode"})} /* {/!*预算项目代码*!/}*/
                  colon={true}>
                  {getFieldDecorator('itemCode', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                      {
                        validator:(item,value,callback)=>{
                          if(value === "undefined" || value === ""){
                            callback();
                            return
                          }
                          httpFetch.get(`${config.budgetUrl}/api/budget/items/query?itemCode=${value}`).then((response)=>{
                            console.log(response)
                            response.data.length>0 ? callback(this.props.intl.formatMessage({id:"budget.itemCodeExist"})) : callback()
                          })
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemName"})} /* {/!*预算项目名称*!/}*/
                  colon={true}>
                  {getFieldDecorator('itemName', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={60}>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemType"}) /*预算项目类型*/}
                  colon={true}>
                  {getFieldDecorator('itemTypeName', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},/* {/!*请输入*!/}*/
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
                  {getFieldDecorator('variationAttribute', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Select placeholder={this.props.intl.formatMessage({id:"common.please.select"})}  /* {/!*请选择*!/}*/>
                      {variationAttribute}
                    </Select>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.itemDescription"}) /*预算项目描述*/}
                  colon={true}>
                  {getFieldDecorator('description', {
                    rules:[

                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"common.status"},{status:statusCode})} /* {/!*状态*!/}*/
                  colon={false}>
                  {getFieldDecorator("isEnabled", {
                    initialValue: true,
                    valuePropName: 'checked',
                    rules:[
                      {
                        validator: (item,value,callback)=>{
                          this.setState({
                            statusCode: value ? this.props.intl.formatMessage({id:"common.statusEnable"}) /*启用*/
                              : this.props.intl.formatMessage({id:"status.disabled"}) /*禁用*/
                          })
                          callback();
                        }
                      }
                    ],
                  })
                  (<Switch  checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross"/>}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">{this.props.intl.formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button style={{ marginLeft: 8 }}> {this.props.intl.formatMessage({id:"common.cancel"}) /*取消*/}</Button>
          </Form>
        </div>
      </div>
    )
  }
}

NewBudgetItem.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedNewBudgetItem = Form.create()(NewBudgetItem);
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetItem));
