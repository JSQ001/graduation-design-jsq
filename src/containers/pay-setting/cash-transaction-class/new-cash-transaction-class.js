/**
 *  created by zk on 2017/11/27
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Select,Input, Col, Row, Switch, message, Icon, DatePicker, InputNumber  } from 'antd';

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'routes/menuRoute'

import 'styles/pay-setting/cash-transaction-class/new-cash-transaction-class.scss'
const FormItem = Form.Item;
const Option = Select.Option;

class NewCashTransactionClass extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      // setOfBooks:[],
      // isEnabled: true,
      typeCodes:[],
      cashTransactionClassDetail:menuRoute.getRouteItem('cash-transaction-class-detail', 'key'),
      cashTransactionClass:menuRoute.getRouteItem('cash-transaction-class', 'key'),
    };
  }

  componentWillMount(){
    // httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then(res => {
    //   this.setState({ setOfBooks: res.data })
    // });
    this.getSystemValueList(2104).then(res => { //事务类型
      let typeCodes = res.data.values;
      this.setState({ typeCodes })
    });
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  handleDisabledEndDate = (endValue) =>{
    if (!this.state.startValue || !endValue) {
      return false;
    }
    return endValue.valueOf() <= this.state.startValue.valueOf();
  };

  //新建现金事务
  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.setOfBookId = this.props.company.setOfBooksId;
        httpFetch.post(`${config.payUrl}/api/cash/transaction/classes`,values).then((response)=>{
          message.success(`${response.data.description}保存成功!`); /*保存成功！*/
          this.context.router.push(this.state.cashTransactionClassDetail.url.replace(':classId', response.data.id));
        }).catch((e)=>{
          this.setState({loading: false});
          if(e.response){
            message.error(`${this.props.intl.formatMessage("common.save.filed")},${e.response.data.validationErrors[0].message}`);
          }
        })
      }
    })
  };

  handleCancel = (e) =>{
    e.preventDefault();
    this.context.router.push(this.state.cashTransactionClass.url);
  };

  validateCashTransactionClassCode = (item,value,callback)=>{
    if(item.field === "classCode"){
      // let re = /^[a-z || A-Z]+$/;
      let re = /[^\u4e00-\u9fa5]+$/;
      if(! re.test(value)) {
        this.props.form.setFieldsValue({"classCode":""});
      }
      // else{
      //   httpFetch.get(`${config.payUrl}/api/cash/transaction/classes/queryAll?classCode=${value}&setOfBookId=${this.props.company.setOfBooksId}`).then((response)=>{
      //     let f = false;
      //     response.data.map((item)=>{
      //       if(item.flowCode === value)
      //         f = true;
      //     });
      //     this.setState({               /*该现金事务已存在*/
      //       flowCodeStringHelp: f ? this.props.intl.formatMessage({id:"cash.transaction.class.validateExist"}) : null,
      //       flowCodeLStringStatus: f ? "error" : null,
      //     })
      //   })
      // }
    }
    callback()
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { /*setOfBooks, */isEnabled, typeCodes} = this.state;
    const { formatMessage } = this.props.intl;
    return(
      <div className="new-cash-transaction-class">
        <div className="cash-transaction-class-form">
          <Form onSubmit={this.handleSave} className="cash-transaction-class-form">
            <Row gutter={60}>
              <Col span={8}>
                <FormItem
                  label={ formatMessage({id:"budget.set.of.books"}) /*账套*/}
                  colon={true}>
                  {getFieldDecorator('setOfBookId', {
                    rules:[
                      {required:true,message: formatMessage({id:"common.please.select"})},
                    ],
                    initialValue: this.props.company.setOfBooksName,
                  })(
                    <Select disabled={true}
                      // onBlur={this.handleSelect}
                      placeholder={ formatMessage({id:"common.please.select"})}>
                      {/*{setOfBooks.map((option)=><Option key={option.id}>{option.setOfBooksName}</Option>)}*/}
                    </Select>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={ formatMessage({id:"cash.transaction.class.type"})} /*现金事务类型代码*/
                  colon={true}>
                  {getFieldDecorator('typeCode', {
                    rules:[
                      {required:true,message: formatMessage({id:"common.please.select"})},
                    ]
                  })(
                    <Select onChange={(value)=>{this.setState({ mannerValue: value })}}
                            placeholder={ formatMessage({id:"common.please.select"})}>
                      {typeCodes.map((option)=>{
                        return <Option key={option.value}>{option.messageKey}</Option>
                      })}
                    </Select>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label= { formatMessage({id:"cash.transaction.class.code"})}  /*现金事务分类代码*/
                  colon={true}>
                  {getFieldDecorator('classCode', {
                    rules:[
                      {required:true,message: formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Input placeholder={ formatMessage({id:"common.please.enter"})}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={60}>
              <Col span={8}>
                  <FormItem
                    label={this.props.intl.formatMessage({id:"cash.transaction.class.description"}) /*现金事务分类名称*/}
                    colon={true}>
                    {getFieldDecorator('description', {
                      rules:[
                        {required:true,message:this.props.intl.formatMessage({id:"common.please.enter"})},
                      ]
                    })(
                      <Input placeholder={ formatMessage({id:"common.please.enter"})}/>)
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem  label={formatMessage({id: 'common.column.status'})/* 状态 */}>
                    {getFieldDecorator('isEnabled', {
                      initialValue: true
                    })(
                      <Switch defaultChecked={true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
                    )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('isEnabled') ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})}
                  </FormItem>
                </Col>
            </Row>
            <Button type="primary" htmlType="submit">{this.props.intl.formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button onClick={this.handleCancel} style={{ marginLeft: 8 }}> {this.props.intl.formatMessage({id:"common.cancel"}) /*取消*/}</Button>
          </Form>
        </div>
      </div>
    )
  }
}

NewCashTransactionClass.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

const WrappedNewCashTransactionClass = Form.create()(NewCashTransactionClass);
export default connect(mapStateToProps)(injectIntl(WrappedNewCashTransactionClass));
