/**
 * Created by 13576 on 2017/10/18.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Button, Icon ,Tabs,Row,Col,message,Checkbox,InputNumber} from 'antd'
const CheckboxGroup = Checkbox.Group;
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/finance-setting/beep-timer/beep-from.scss'


const FormItem = Form.Item;
const TabPane =Tabs.TabPane;

class BeepFrom extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

     options : [
        { label: '差旅申请单', value: 'ee' },
        { label: '国际出差申请单', value: 'pp' },
        { label: '差旅申请单', value: 'Orange' },
       { label: '国际出差申请单', value: 'Orange2' },
      ]
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

  //保存控制
  handSubmit=(e)=>{
    e.preventDefault();
   const value = this.props.getFieldsValue();
    console.log(value)
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span:24 },
      wrapperCol: { span:24 },
    };

    const formItemLayout2 ={
      labelCol: { span:16 },
      wrapperCol: { span:16 },
    }
    return (
      <div className="beep-from">
        <div className="beep-from-in">
          <Form onSubmit={this.handSubmit}>
            <Row>
              <Col span={8}>
              <FormItem {...formItemLayout} label="提醒标题" >
                {getFieldDecorator('code1', {
                  rules: [{
                  }],
                  initialValue: '提醒标题'
                })(
                  <Input  />
                )}
              </FormItem>
              </Col>
            </Row>
            <Row>

              <Col span={8}>
              <FormItem {...formItemLayout} label="提醒内容" >
                {getFieldDecorator('code2', {
                  rules: [{
                  }],
                  initialValue: ''
                })(
                  <Input type="提醒内容提醒内容提醒内容提醒内容提醒内容提醒内容提醒内容提醒内容提醒内容" />
                )}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <hr/>
              <br/>
            </Row>
            <Row>
              <Col span={8}>

                <FormItem {...formItemLayout} label="发送日期" >
                  <span>预计还款日期前</span>
                  {getFieldDecorator('code3', {
                    rules: [{
                    }],
                    initialValue: ''
                  })(
                    <Input style={{width:40}} />
                  )}
                  <span> 天提醒员工</span>
                </FormItem>

              </Col>

              <Col span={8}>
                <FormItem {...formItemLayout} label="发送时间" >
                  {getFieldDecorator('code4', {
                    rules: [{
                    }],
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>

              </Col>

            </Row>
            <Row>
              <Col>

                <FormItem {...formItemLayout} label="适用单据" >
                  {getFieldDecorator('code5', {
                    rules: [{
                    }],
                    initialValue: ''
                  })(
                    <CheckboxGroup options={this.state.options}  />

                  )}

                </FormItem>

              </Col>

            </Row>
            <Row>
              <FormItem wrapperCol={{ offset: 0 }}>
                <Button type="primary" htmlType="submit" loading={this.state.loading} style={{marginRight:'10px'}}>保存</Button>
                <Button>取消</Button>
              </FormItem>
            </Row>

          </Form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedBeepFrom= Form.create()(BeepFrom);

export default connect(mapStateToProps)(WrappedBeepFrom);




