/**
 *  created by jsq on 2017/9/27
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Select,Input, Col, Row, Switch, message, Icon } from 'antd';


class NewBudgetControlRules extends React.Component{
 constructor(props){
   super(props);
   this.state = {
     loading: true,
   }

 }
}

NewBudgetControlRules.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedNewBudgetControlRules = Form.create()(NewBudgetControlRules);
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetControlRules));
