import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Input, Switch, Button, Icon, Select } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import config from 'config'
import httpFetch from 'share/httpFetch'

class NewContractType extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: true,
      setOfBooks: [],
      defaultSetOfBooks: null,
      contractCategory: [],
    }
  }

  componentWillMount() {
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/query/dto`).then((res) => { //账套
      this.setState({
        setOfBooks: res.data,
        defaultSetOfBooks: res.data[0].setOfBooksId
      })
    });
    this.getSystemValueList(2019).then(res => { //合同大类
      let contractCategory = res.data.values;
      this.setState({ contractCategory })
    });
  }

  switchChange = (isEnabled) => {
    this.setState({ isEnabled })
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
      }
    })
  };

  onCancel = () => {
    // this.setState({});
    this.props.close()
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isEnabled, setOfBooks, defaultSetOfBooks, contractCategory } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 }
    };
    return (
      <div className="new-contract-type">
        <Form style={{marginTop:'30px'}} onSubmit={this.handleSave}>
          <FormItem {...formItemLayout} label="账套">
            {getFieldDecorator('setOfBooksId', {
              rules: [{
                required: true,
                message: '请选择'
              }],
              initialValue: defaultSetOfBooks
            })(
              <Select>
                {setOfBooks.map((option)=>{
                  return <Option key={option.setOfBooksId}>{option.setOfBooksCode}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="合同大类">
            {getFieldDecorator('contractCategory', {
              rules: [{
                required: true,
                message: '请选择'
              }]
            })(
              <Select placeholder="请选择">
                {contractCategory.map((option)=>{
                  return <Option key={option.value}>{option.messageKey}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="合同类型代码">
            {getFieldDecorator('contractTypeCode', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="合同类型名称">
            {getFieldDecorator('contractTypeName', {
              rules: [{
                required: true,
                message: '请输入'
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              initialValue: ''
            })(
              <div>
                <Switch defaultChecked={true}
                        checkedChildren={<Icon type="check"/>}
                        unCheckedChildren={<Icon type="cross" />}
                        onChange={this.switchChange}/>
                <span style={{position:'relative',top:'2px',left:'10px'}}>{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const wrappedNewContractType = Form.create()(injectIntl(NewContractType));

export default wrappedNewContractType
