import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Alert, Form, Switch, Icon, Input, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class BudgetGroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render(){
    return (
      <div>

      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

BudgetGroupDetail.contextTypes = {
  router: React.PropTypes.object
};

const WrappedBudgetGroupDetail = Form.create()(BudgetGroupDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetGroupDetail));
