/**
 *  createc by jsq on 2017/9/19
 */
import React from 'react';
import { Button, Form, Select } from 'antd';
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
