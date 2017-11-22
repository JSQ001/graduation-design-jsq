import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Input, Switch, Button, Icon, Select, message } from 'antd'
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
      defaultValue: {
        isEnabled: true
      },
    }
  }

  componentWillMount() {
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/query/dto`).then((res) => { //账套
      this.setState({
        setOfBooks: res.data,
        defaultSetOfBooks: res.data[0].setOfBooksId
      })
    });
    this.getSystemValueList(2202).then(res => { //合同大类
      let contractCategory = res.data.values;
      this.setState({ contractCategory })
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id &&
      (nextProps.params.id !== this.state.defaultValue.id ||
        nextProps.params.versionNumber !== this.state.defaultValue.versionNumber)) {  //编辑
      this.setState({ defaultValue: nextProps.params }, () => {
        this.setState({ isEnabled: this.state.defaultValue.isEnabled });
        for (let key in this.props.form.getFieldsValue()) {
          let params = {};
          params[key] = this.state.defaultValue[key];
          this.props.form.setFieldsValue(params)
        }
      })
    } else if (!nextProps.params.id && this.state.defaultValue.id) {  //新建
      this.setState({
        isEnabled: true,
        defaultValue: {isEnabled: true}
      }, () => {
        this.props.form.resetFields()
      })
    }
  }

  //状态改变
  switchChange = (status) => {
    this.setState({ isEnabled: status })
  };

  //新建保存
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.isEnabled = this.state.isEnabled;
        let params = [];
        params.push(values);
        this.setState({ loading: true });
        httpFetch.post(`${config.contractUrl}/contract/api/contract/type/${values.setOfBooksId}`, params).then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            message.success('保存成功');
            this.props.form.resetFields();
            this.props.close(true)
          }
        }).catch((e) => {
          this.setState({ loading: false });
          if (e.response) {
            message.error(`保存失败，${e.response.data.message}`);
          } else {
            message.error(`保存失败`);
          }
        })
      }
    })
  };

  //更新保存
  handleUpdate = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.isEnabled = this.state.isEnabled;
        values.id = this.state.defaultValue.id;
        values.versionNumber = this.state.defaultValue.versionNumber;
        let params = [];
        params.push(values);
        this.setState({ loading: true });
        httpFetch.put(`${config.contractUrl}/contract/api/contract/type/${values.setOfBooksId}`, params).then((res) => {
          if (res.status === 200) {
            this.setState({ loading: false });
            message.success('保存成功');
            this.props.form.resetFields();
            this.props.close(true)
          }
        }).catch((e) => {
          this.setState({ loading: false });
          if (e.response) {
            message.error(`保存失败，${e.response.data.message}`);
          } else {
            message.error(`保存失败`);
          }
        })
      }
    })
  };

  onCancel = () => {
    this.props.form.resetFields();
    this.props.close()
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, setOfBooks, defaultSetOfBooks, contractCategory, defaultValue } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 }
    };
    return (
      <div className="new-contract-type">
        <Form style={{marginTop:'30px'}} onSubmit={ this.state.defaultValue.id ? this.handleUpdate :this.handleSave }>
          <FormItem {...formItemLayout} label="账套">
            {getFieldDecorator('setOfBooksId', {
              rules: [{
                required: true,
                message: '请选择'
              }],
              initialValue: defaultValue.setOfBooksId || defaultSetOfBooks
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
              }],
              initialValue: defaultValue.contractCategory
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
              initialValue: defaultValue.contractTypeCode
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
              initialValue: defaultValue.contractTypeName
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('isEnabled', {
              valuePropName: 'checked',
              initialValue: defaultValue.isEnabled
            })(
              <Switch checkedChildren={<Icon type="check"/>}
                      unCheckedChildren={<Icon type="cross" />}
                      onChange={this.switchChange}/>
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
