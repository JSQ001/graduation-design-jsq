/**
 *  createc by jsq on 2017/9/19
 */
import React from 'react';
import { Button, Form, Select,Input, Col, Row, Switch, message } from 'antd';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/budget/budget-organization/budget-structure/new-budget-structure.scss';

const FormItem = Form.Item;
const Option = Select.Option;

class NewBudgetStructure extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading: true,
      statusCode: "启用",
      organization:{},
    }
  }

  componentWillMount(){
    typeof this.props.organization.organizationName === "undefined" ?
      httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${this.props.params.id}`).then((response) =>{
        this.setState({
          organization: response.data
        })
      })
      :
      this.setState({
        organization: this.props.organization
      })
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(this.state.organization)
        console.log(values)
        delete values.organizationName
        values.organizationId = this.state.organization.id
        console.log(values)
        httpFetch.post(`${config.budgetUrl}/api/budget/structures`,values).then((response)=>{
          console.log(response)
        })
        message.success("保存成功！")
      }
    });

  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { statusCode, organization} = this.state;

    const periodStrategy = [
      {id:"month",value:"月度"},
      {id:"quarter",value:"季度"},
      {id:"year",value:'年度'}
    ]
    const options = periodStrategy.map((item)=><Option key={item.id}>{item.value}</Option>)

    return(
      <div className="new-budget-structure">
        <div className="budget-structure-title">新建预算表</div>
        <div className="budget-structure-form">
          <Form onSubmit={this.handleSave}>
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
                            response.data.length>0 ? callback("该预算表代码已存在") : callback()
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
                            statusCode: value ? "启用" : "禁用"
                          })
                          callback();
                        }
                      }
                    ],
                  })
                  (<Switch checkedChildren="启用" unCheckedChildren="禁用"/>)
                  }
                </FormItem>
              </Col>
            </Row>


                <Button type="primary" htmlType="submit">保 存</Button>

                <Button style={{ marginLeft: 8 }}> 取 消</Button>

          </Form>
        </div>
      </div>
    )
  }
}

NewBudgetStructure.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedNewBudgetStructure = Form.create()(NewBudgetStructure);

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetStructure));
