/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Select,Input, Col, Row, Switch, message } from 'antd';

import httpFetch from 'share/httpFetch';
import config from 'config'

import "styles/budget-setting/budget-organization/budget-item/new-budget-item.scss"


class NewBudgetItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
    }
  }
  render(){
    return (
      <div className="new-budget-item">
        <div className="budget-item-form">
          <Form onSubmit={this.handleSave} className="budget-structure-form">
            <Row gutter={24}>
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
                    <Input placeholder={this.props.intl.formatMessage({id:"prompting.input"})} disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.structureCode"})} /* {/!*预算表代码*!/}*/
                  colon={true}>
                  {getFieldDecorator('structureCode', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"prompting.input"})},
                      {
                        validator:(item,value,callback)=>{
                          httpFetch.get(`${config.budgetUrl}/api/budget/structures/query?structureCode=${value}`).then((response)=>{
                            response.data.length>0 ? callback(this.props.intl.formatMessage({id:"validator.organizationCode.exist"})) : callback()
                          })

                        }
                      }
                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"prompting.input"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.structureName"})} /* {/!*预算表名称*!/}*/
                  colon={true}>
                  {getFieldDecorator('structureName', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"prompting.input"})},
                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"prompting.input"})}
                    />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"periodStrategy"})}  /*{/!*编制期段*!/}*/
                  colon={true}>
                  {getFieldDecorator('periodStrategy', {
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"prompting.input"})},/* {/!*请输入*!/}*/
                    ],
                  })(
                    <Select placeholder={this.props.intl.formatMessage({id:"prompting.select"})}  /* {/!*请选择*!/}*/>
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
                    rules:[
                      {required:true,message:this.props.intl.formatMessage({id:"prompting.input"})},
                    ]
                  })(
                    <Input placeholder={this.props.intl.formatMessage({id:"prompting.input"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"status"},{statusCode:statusCode})} /* {/!*状态*!/}*/
                  colon={false}>
                  {getFieldDecorator("isEnabled", {
                    initialValue: true,
                    valuePropName: 'checked',
                    rules:[
                      {
                        validator: (item,value,callback)=>{
                          this.setState({
                            statusCode: value ? this.props.intl.formatMessage({id:"status.enabled"}) /*启用*/
                              : this.props.intl.formatMessage({id:"status.disabled"}) /*禁用*/
                          })
                          callback();
                        }
                      }
                    ],
                  })
                  (<Switch checkedChildren={this.props.intl.formatMessage({id:"status.enabled"}) /*启用*/ }
                           unCheckedChildren={this.props.intl.formatMessage({id:"status.disabled"}) /*禁用*/}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">{this.props.intl.formatMessage({id:"button.save"}) /*保存*/}</Button>
            <Button style={{ marginLeft: 8 }}> {this.props.intl.formatMessage({id:"button.cancle"}) /*取消*/}</Button>
          </Form>
        </div>
      </div>
    )
  }
}

function mapStateToProps() {
  return {
  }
}

const WrappedNewBudgetItem = Form.create()(NewBudgetItem);
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetItem));
