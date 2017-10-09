/**
 *  createc by jsq on 2017/9/19
 */
import React from 'react';
import { Button, Form, Select,Input, Col, Row, Switch, message, Icon} from 'antd';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/budget-setting/budget-organization/budget-structure/new-budget-structure.scss';
import menuRoute from 'share/menuRoute'

const FormItem = Form.Item;
const Option = Select.Option;

class NewBudgetStructure extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      statusCode: this.props.intl.formatMessage({id:"common.enabled"}),  /*启用*/
      organization:{},
    }
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

  //新建预算表
  handleSave = (e) =>{
    e.preventDefault();
    this.setState({
      loading: true,
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.organizationId = this.state.organization.id;
        console.log(values)
        httpFetch.post(`${config.budgetUrl}/api/budget/structures`,values).then((response)=>{
          if(response) {
            console.log(response)
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            response.data.organizationName = values.organizationName;
            this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetStructureDetail.url.replace(':id', this.props.params.id).replace(':structureId',response.data.id));
            this.setState({loading:true})
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`保存失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          }
          else {
            console.log(e)
          }
        })
      }
    });
  };

  //点击取消，返回预算组织详情
  handleCancel = (e) =>{
    e.preventDefault();
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetOrganizationDetail.url.replace(':id', this.props.params.id));
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { statusCode, organization, loading } = this.state;
    const { formatMessage } = this.props.intl;
    const periodStrategy = [
      {id:"month",value: formatMessage({id:"periodStrategy.month"})},  /*月度*/
      {id:"quarter",value: formatMessage({id:"periodStrategy.quarter"})}, /*季度*/
      {id:"year",value: formatMessage({id:"periodStrategy.year"})} /*年度*/
    ];
    const options = periodStrategy.map((item)=><Option key={item.id}>{item.value}</Option>)
    return(
      <div className="new-budget-structure">
        <div className="budget-structure-header">
          <Form onSubmit={this.handleSave}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.organization"})}  /*{/!*预算组织*!/}*/
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
                  label={formatMessage({id:"budget.structureCode"})} /* {/!*预算表代码*!/}*/
                  colon={true}>
                  {getFieldDecorator('structureCode', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                      {
                        validator:(item,value,callback)=>{
                          httpFetch.get(`${config.budgetUrl}/api/budget/structures/query?organizationId=${this.props.params.id}&structureCode=${value}`).then((response)=>{
                            console.log(response)
                            response.data.map((item)=>{
                              if(item.structureCode === value){
                                /*该预算表已存在*/
                                callback(formatMessage({id:"budget.structureCode.exist"}))
                                return
                              }
                            });
                            callback()
                          })
                        }
                      }
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.structureName"})} /* {/!*预算表名称*!/}*/
                  colon={true}>
                  {getFieldDecorator('structureName', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.periodStrategy"})}  /*{/!*编制期段*!/}*/
                  colon={true}>
                  {getFieldDecorator('periodStrategy', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},/* {/!*请输入*!/}*/
                    ],
                  })(
                    <Select placeholder={formatMessage({id:"common.please.select"})}  /* {/!*请选择*!/}*/>
                      {options}
                    </Select>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.structureDescription"})} /* {/!*预算表描述*!/}*/
                  colon={true}>
                  {getFieldDecorator('description', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"common.status"},{status:statusCode})} /* {/!*状态*!/}*/
                  colon={false}>
                  {getFieldDecorator("isEnabled", {
                    initialValue: true,
                    valuePropName: 'checked',
                    rules:[
                      {
                        validator: (item,value,callback)=>{
                          this.setState({
                            statusCode: value ? formatMessage({id:"common.enabled"}) /*启用*/
                                                : formatMessage({id:"common.disabled"}) /*禁用*/
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
            <Button type="primary" loading={loading} htmlType="submit">{formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button onClick={this.handleCancel} style={{ marginLeft: 8 }}> {formatMessage({id:"common.cancel"}) /*取消*/}</Button>
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
