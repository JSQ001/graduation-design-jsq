/**
 * Created by 13576 on 2017/10/18.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Input, Switch, Select,Button, Icon ,Tabs,Row,Col,message,Checkbox,InputNumber} from 'antd'
const { TextArea } = Input;
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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.props.submitHandle(values);
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const hourOption=[];
    for(let i=0;i<=24;i++){
      hourOption.push(<option value={i} key={i}>{i+":00"}</option>)
    }
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
                {getFieldDecorator('code', {
                  rules: [{
                  }],
                })(
                  <Input  />
                )}
              </FormItem>
              </Col>
            </Row>
            <Row>

              <Col span={8}>
              <FormItem {...formItemLayout} label="提醒内容" >
                {getFieldDecorator('description', {
                  rules: [{
                  }],
                  initialValue: ''
                })(
                  <TextArea/>
                )}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <hr/>
              <br/>
            </Row>
            {/*定时提醒*/}
            {this.props.type === "regularly" && <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="发送日期" >
                  {getFieldDecorator('date ', {
                    rules: [{
                    }],
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem {...formItemLayout} label="发送时间" >
                  {getFieldDecorator('hour', {
                    rules: [{
                    }],
                    initialValue: ''
                  })(
                    <Select>
                      {hourOption}
                    </Select>
                  )}
                </FormItem>
              </Col>

            </Row>}

            {/*差旅申请单*/}
            { this.props.type === "traver" && (<Row>
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
                  {getFieldDecorator('hour', {
                    rules: [{
                    }],
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>)}
            {/*借款申请单*/}
            {this.props.type === "business-card" && <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="发送日期" >
                  <span>预计还款日期前</span>
                  {getFieldDecorator('data', {
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

            </Row>}

            {/*商务卡*/}
            {this.props.type === "business-card" && <Row>


            </Row>}
            <Row>

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

WrappedBeepFrom.propTypes = {
  type: React.PropTypes.string,  //选择类型 "borrow","traver","business-card","regularly"
  applyData:React.PropTypes.object,
  onEdit:React.PropTypes.func,
  submitHandle:React.PropTypes.func   //保存
}
WrappedBeepFrom.defaultProps = {
  applyData:{},
  onEdit:()=>{},
  submitHandle:()=>{}
}


export default connect(mapStateToProps)(injectIntl(WrappedBeepFrom));


