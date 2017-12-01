/**
 * created by zk on 2017/11/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, Input, Switch, Icon, Select, message } from 'antd';
import debounce from 'lodash.debounce';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/pay/cash-flow-item/createOrUpdate-item.scss'
import SlideFrame from 'components/slide-frame'

const FormItem = Form.Item;
const Option = Select.Option;

class CreateOrUpdateItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      defaultStatus: true,
      statusCode: this.props.intl.formatMessage({id:"common.enabled"}),
      isEnabled: true,
      item:{},
      isEditor: false,
      // setOfBooks: [],
    };
    this.validateCashFlowItemCode = debounce(this.validateCashFlowItemCode,1000)
  }

  componentWillMount(){
    // httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then(res => {
    //   this.setState({ setOfBooks: res.data })
    // })
  }


  componentWillReceiveProps(nextprops){
    console.log(nextprops.params);
    this.setState({
      item: nextprops.params.item,
      isEditor: JSON.stringify(nextprops.params.item) == "{}" ? false : true,
      defaultStatus: JSON.stringify(nextprops.params.item) == "{}" ? true : nextprops.params.item.isEnabled,
//      isEnabled: JSON.stringify(nextprops.params) == "{}" ? true : nextprops.params.isEnabled,
    })
  }

  /**
   * 验证现金流量项（数字/字母）代码,不可重复,代码只能包含字母、数字，特殊字符，否则清空
   * @param item 输入项
   * @param value 输入的值
   */
  validateCashFlowItemCode = (item,value,callback)=>{
    if(item.field === "flowCode"){
      // let re = /^[a-z || A-Z]+$/;
      let re = /[^\u4e00-\u9fa5]+$/;
      if(! re.test(value)) {
        this.props.form.setFieldsValue({"flowCode":""});
      }
      // else{
      //   httpFetch.get(`${config.payUrl}/api/cash/flow/items/queryAll?flowCode=${value}&setOfBookId=${this.props.company.setOfBooksId}`).then((response)=>{
      //     let f = false;
      //     response.data.map((item)=>{
      //       if(item.flowCode === value)
      //         f = true;
      //     });
      //     this.setState({               /*该现金流量项已存在*/
      //       flowCodeStringHelp: f ? this.props.intl.formatMessage({id:"cash.flow.item.validateExist"}) : null,
      //       flowCodeLStringStatus: f ? "error" : null,
      //     })
      //   })
      // }
    }
    callback()
  };

  handleCreate = ()=>{
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.setOfBookId = this.props.company.setOfBooksId;
        httpFetch.post(`${config.payUrl}/api/cash/flow/items`,values).then((response)=>{
          message.success(this.props.intl.formatMessage({id:"common.create.success"},{name:values.description}));
          this.props.close(true);
          this.setState({
            loading: false
          })
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.create.filed"})}, ${e.response.data.validationErrors[0].message}`);
          }
          this.setState({loading: false});
        })
      }
    })
  };

  handleUpdate = ()=>{
    let updateValues = this.props.form.getFieldsValue();
    let values = this.state.item;
    values.isEnabled = updateValues.isEnabled;
    values.setOfBookId = this.props.company.setOfBooksId;
    values.flowCode = updateValues.flowCode;
    values.description = updateValues.description;
    if(values.description === ""){
      return
    }
    httpFetch.put(`${config.payUrl}/api/cash/flow/items`,values).then((response)=>{
      console.log(response)
      message.success(this.props.intl.formatMessage({id:"common.save.success"},{name:values.description}));
      this.setState({
        loading: false
      });
      this.props.close(true);
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.validationErrors[0].message}`);
      }
      this.setState({loading: false});
    })


  };

  handleSubmit = (e)=>{
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.state.isEditor ?
      this.handleUpdate()
      :
      this.handleCreate();
  };

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  };

  handleFormChange =()=>{
    this.setState({
      loading: false
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;

    const { defaultStatus, loading, item, isEditor} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    console.log(this.state.defaultStatus)

    return(
      <div className="new-cash-flow-item">
        <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange} >
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"common.column.status"})+" :"}>
            {getFieldDecorator('isEnabled',{
              initialValue: defaultStatus,
              valuePropName: 'checked'
            })(
                <Switch checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />}
                onChange={(value)=>{
                  this.setState({
                    flag: 'y',
                    isEnabled: value
                  })
                }}
                />
              )}
          </FormItem>
          <span className="enabled-type" style={{marginLeft:25,width:100}}>{(this.state.flag === 'y'? this.state.isEnabled : defaultStatus ) ? "启用" : "禁用"}</span>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"budget.set.of.books"})}>
            {getFieldDecorator('setOfBookId', {
              initialValue: this.props.company.setOfBooksName,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.select"})
                },
              ],
            })(
              <Select disabled={true} placeholder={ formatMessage({id:"common.please.select"})}>
                {/*{this.state.setOfBooks.map((option)=>{
                  return <Option key={option.id}>{option.setOfBooksName}</Option>
                })}*/}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
            label={formatMessage({id:"cash.flow.item.flowCode"})}
            validateStatus={this.state.flowCodeLStringStatus}
            help={this.state.flowCodeStringHelp}>
            {getFieldDecorator('flowCode', {
              initialValue: item.flowCode,
              rules: [{
                required: true,
                message: formatMessage({id:"common.please.enter"})
              },
              {
                validator:(item,value,callback)=>this.validateCashFlowItemCode(item,value,callback)
              }
              ],
            })(
              <Input disabled={isEditor} placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:"cash.flow.item.description"})} >
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true,
                  message: formatMessage({id:"common.please.enter"})
                },

              ],
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})} />
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
const WrappedCreateOrUpdateItem = Form.create()(CreateOrUpdateItem);

export default connect(mapStateToProps)(injectIntl(WrappedCreateOrUpdateItem));

