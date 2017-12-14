import React from 'react'
import { injectIntl } from 'react-intl'
import menuRoute from 'share/menuRoute'
import { Form, Input, Switch, Button, Icon, Select, message, Spin } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import config from 'config'
import httpFetch from 'share/httpFetch'

import PermissionSetting from 'components/template/permission-setting'

class NewContractType extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      infoLoading: false,
      isEnabled: true,
      setOfBooks: [],
      defaultSetOfBooks: null,
      contractCategory: [],
      data: {},
      contractTypeDefine:  menuRoute.getRouteItem('contract-type-define','key'),    //公司类型定义
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
    if (this.props.params.id) {
      this.setState({ infoLoading: true });
      this.getInfo()
    }
  }

  getInfo = () => {
    const { setOfBooksId, id } = this.props.params;
    let url = `${config.contractUrl}/contract/api/contract/type/${setOfBooksId}/${id}`;
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          data: res.data,
          infoLoading: false
        })
      }
    })
  };

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
        values.id = this.state.data.id;
        values.versionNumber = this.state.data.versionNumber;
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

  //取消
  handleCancel = () => {
    this.context.router.push(this.state.contractTypeDefine.url)
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, infoLoading, setOfBooks, defaultSetOfBooks, contractCategory, data } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 }
    };
    return (
      <div className="new-contract-type">
        <Spin spinning={infoLoading}>
          <Form style={{width:'70%', margin:'30px auto 0'}} onSubmit={ data.id ? this.handleUpdate :this.handleSave }>
            <FormItem {...formItemLayout} label="账套">
              {getFieldDecorator('setOfBooksId', {
                rules: [{
                  required: true,
                  message: '请选择'
                }],
                initialValue: data.setOfBooksId || defaultSetOfBooks
              })(
                <Select disabled={!!data.id}>
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
                initialValue: data.contractCategory
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
                initialValue: data.contractTypeCode
              })(
                <Input placeholder="请输入" disabled={!!data.id}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="合同类型名称">
              {getFieldDecorator('contractTypeName', {
                rules: [{
                  required: true,
                  message: '请输入'
                }],
                initialValue: data.contractTypeName
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="关联表单类型">
              {getFieldDecorator('type', {
                initialValue: undefined
              })(
                <Select placeholder="请选择">

                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="适用人员">
              {getFieldDecorator('permission', {
                initialValue: undefined
              })(
                <PermissionSetting/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('isEnabled', {
                valuePropName: 'checked',
                initialValue: data.isEnabled
              })(
                <Switch checkedChildren={<Icon type="check"/>}
                        unCheckedChildren={<Icon type="cross" />}
                        onChange={this.switchChange}/>
              )}
            </FormItem>

            <FormItem wrapperCol={{ offset: 7 }}>
              <Button type="primary" htmlType="submit" loading={loading} style={{marginRight:'10px'}}>保存</Button>
              <Button onClick={this.handleCancel}>取消</Button>
            </FormItem>
          </Form>
        </Spin>
      </div>
    )
  }
}

NewContractType.contextTypes = {
  router: React.PropTypes.object
};

const wrappedNewContractType = Form.create()(injectIntl(NewContractType));

export default wrappedNewContractType
