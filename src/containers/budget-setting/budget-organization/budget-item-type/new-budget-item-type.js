/**
 * Created by 13576 on 2017/9/21.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import {Button,Table,Badge,Popconfirm,Form,DatePicker,Col,Row,Switch,notification,Input} from 'antd'
const FormItem = Form.Item;

import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'

import 'styles/budget/buget-item-type/budget-item-type.scss'


class NewBudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPut:this.props.isPut,
      text:this.props.text,
    };
  }

  render(){
    const {text,isPut}=this.state
    return (
      <div>

      </div>
    )
  }
}


/*NewBudgetItemType.propTypes = {
  isPut:React.PropTypes.bool,
  text:React.PropTypes.object
};*/


const WrappedNewBudgetItemType = Form.create()(NewBudgetItemType);
function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetItemType));
