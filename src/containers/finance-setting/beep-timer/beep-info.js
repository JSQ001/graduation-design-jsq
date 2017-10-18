/**
 * Created by 13576 on 2017/10/18.
 */

import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon ,Tabs} from 'antd'
const FormItem = Form.Item;
const TabPane =Tabs.TabPane;

class BeepTimer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount(){

  }

  handleSave = (e) =>{
    e.preventDefault();
    let value = this.props.form.getFieldsValue();
    this.props.close(value);
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="beep-timer">

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedBeepTimer = Form.create()(BeepTimer);

export default connect(mapStateToProps)(WrappedBeepTimer);
