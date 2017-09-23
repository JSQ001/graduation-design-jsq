import React from 'react'
import { connect } from 'react-redux'

import { Form, Button, Input, Radio, Select, Row, Col, InputNumber, Popover, Icon } from 'antd'
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

class NewStrategyControlDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formulaDisplay: 'block',
      functionDisplay: 'none',
      manner: '绝对额',
    };
  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        /*httpFetch.post(`${config.budgetUrl}/api/budget/scenarios`, values).then((res)=>{
          console.log(res);
          if(res.status == 200){
            this.props.close(true);
            message.success('操作成功');
          }
        }).catch((e)=>{

        })*/
      }
    });
  };

  radioChange = (e) => {
    if(e.target.value=='函数') {
      this.setState({
        formulaDisplay: 'none',
        functionDisplay: 'block'
      })
    } else {
      this.setState({
        formulaDisplay: 'block',
        functionDisplay: 'none'
      })
    }
  }

  mannerChange = (value) => {
    this.setState({
      manner: value
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formulaDisplay, functionDisplay, manner } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    const content = (
      <div style={{color:'#999'}}>
        <div style={{marginBottom:'10px'}}>控制策略控制期段即以何种方式对预算进行控制</div>
        <div>
          <span style={{color:'#666'}}>【年度】</span>：按全年预算额控制<br/>
          <span style={{color:'#666'}}>【年初至今】</span>：按年初至今预算额控制<br/>
          <span style={{color:'#666'}}>【累计季度】</span>：按年初至当季度预算额控制<br/>
          <span style={{color:'#666'}}>【滚动季度】</span>：按当月至后两个月共3个月合计预算额控制<br/>
          <span style={{color:'#666'}}>【季度】</span>：按当季预算额控制<br/>
          <span style={{color:'#666'}}>【季初至今】</span>：按季度初至今预算额控制<br/>
          <span style={{color:'#666'}}>【月度】</span>：按当月录入预算额控制<br/>
        </div>
      </div>
    );
    return (
      <div className="new-strategy-control-detail">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="类型" help="参数公式无法满足需求时，可通过自定义函数进行预算控制" style={{margin:'24px 0'}}>
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true
              }],
              initialValue: '公式'
            })(
              <RadioGroup onChange={this.radioChange}>
                <RadioButton value="公式">公式</RadioButton>
                <RadioButton value="函数">函数</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <div style={{display:formulaDisplay}}>
            <FormItem {...formItemLayout} label="控制对象" hasFeedback>
              {getFieldDecorator('object', {
                rules: [{
                  required: true,
                  message: '请输入'
                }]})(
                <Select placeholder="请选择">
                  <Option value="金额">金额</Option>
                  <Option value="金额进度">金额进度</Option>
                  <Option value="数量">数量</Option>
                  <Option value="数量进度">数量进度</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="比较" hasFeedback>
              {getFieldDecorator('range', {
                rules: [{
                  required: true,
                  message: '请输入'
                }]})(
                <Select placeholder="请选择">
                  <Option value="小于">小于</Option>
                  <Option value="小于等于">小于等于</Option>
                  <Option value="大于">大于</Option>
                  <Option value="大于等于">大于等于</Option>
                  <Option value="等于">等于</Option>
                  <Option value="不等于">不等于</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="方式" hasFeedback>
              {getFieldDecorator('manner', {
                rules: [{
                  required: true,
                  message: '请输入'
                }]})(
                <Row>
                  <Col span={8} style={{marginRight:'15px'}}>
                    <Select placeholder="请选择" onChange={this.mannerChange}>
                      <Option value="绝对额">绝对额</Option>
                      <Option value="百分比">百分比</Option>
                    </Select>
                  </Col>
                  <Col span={8} style={{marginRight:'15px',display:(manner=='百分比'?'none':'block')}}>
                    <Select placeholder="请选择">
                      <Option value="加">加</Option>
                      <Option value="减">减</Option>
                      <Option value="乘">乘</Option>
                      <Option value="除">除</Option>
                    </Select>
                  </Col>
                  <Col span={6}>
                    <InputNumber formatter={value => `${value}%`}
                                 parser={value => value.replace('%', '')}/>
                  </Col>
                </Row>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="控制期段" hasFeedback>
              {getFieldDecorator('periodStrategy', {
                rules: [{
                  required: true,
                  message: '请选择'
                }]})(
                <Row>
                  <Col span={20} style={{marginRight:'20px'}}>
                    <Select placeholder="请选择">
                      <Option value="月度">月度</Option>
                      <Option value="季度">季度</Option>
                      <Option value="年度">年度</Option>
                      <Option value="季度至今">季度至今</Option>
                      <Option value="年度至今">年度至今</Option>
                      <Option value="季度滚动">季度滚动</Option>
                      <Option value="累计季度">累计季度</Option>
                    </Select>
                  </Col>
                  <Col span={2}>
                    <Popover content={content} title="预算控制期段">
                      <Icon type="question-circle-o" style={{fontSize:'18px'}}/>
                    </Popover>
                  </Col>
                </Row>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="条件">
              {getFieldDecorator('scenarioName')(
                <div>{manner}</div>
              )}
            </FormItem>
          </div>
          <div style={{display:functionDisplay}}>
            <FormItem {...formItemLayout} label="自定义函数" hasFeedback>
              {getFieldDecorator('function', {
                rules: [{
                  required: true,
                  message: '请输入'
                }],
                initialValue: ''
              })(
                <TextArea rows={4} placeholder="请输入"/>
              )}
            </FormItem>
          </div>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit">保存</Button>
            <Button>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

const WrappedNewStrategyControlDetail = Form.create()(NewStrategyControlDetail);

export default connect(mapStateToProps)(WrappedNewStrategyControlDetail);
