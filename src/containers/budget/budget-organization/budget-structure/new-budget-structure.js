/**
 *  createc by jsq on 2017/9/19
 */
import React from 'react';
import { Button, Form, Select,Input, Col, Row } from 'antd';
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
    }
  }

  render(){
    return(
      <div className="new-budget-structure">
        <div>新建预算表</div>
        <Form>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                label={this.props.intl.formatMessage({id:"budget.organization"})}
                colon={true}>
                {getFieldDecorator('organizationCode', {
                  initialValue:1,
                })(
                  <Input placeholder="请输入最多15个字符"
                  />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label={this.props.intl.formatMessage({id:"budget.structureCode"})}
                colon={true}>
                {getFieldDecorator('organizationCode', {
                  rules:[
                    {required:true,message:'请输入'},
                  ]
                })(
                  <Input placeholder="请输入"
                  />)
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

NewBudgetStructure.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(NewBudgetStructure));
