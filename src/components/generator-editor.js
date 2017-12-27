import React from 'react'
import { injectIntl } from 'react-intl';
import { Modal, Form, Input, Select, Switch, Icon } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

class GeneratorEditor extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formItem: {},
      sourceId: ''
    };
  }

  componentDidMount(){
    this.setState({ formItem: this.props.formItem, sourceId: this.props.formItem.id })
  }

  componentWillReceiveProps(nextProps){
    this.setState({ formItem: nextProps.formItem, sourceId: nextProps.formItem.id })
  }

  handleChangeType = () => {

  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onOk(Object.assign({}, this.state.formItem, values));
    })
  }

  render(){
    const { visible, onCancel } = this.props;
    const { formItem } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 0 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal visible={visible} title="表单编辑" onOk={this.handleOk} onCancel={onCancel}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="表单名"
          >
            {getFieldDecorator('label', {
              initialValue: formItem.label,
              rules: [{
                required: true, message: '表单名必填'
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表单类型"
          >
            {getFieldDecorator('type', {
              initialValue: formItem.type,
              rules: [{
                required: true, message: '表单类型必选'
              }],
            })(
              <Select onChange={this.handleChangeType}>
                <Option key="plain">静态文本</Option>
                <Option key="input">输入框</Option>
                <Option key="select">选择框</Option>
                <Option key="date">日期</Option>
                <Option key="radio">单选</Option>
                <Option key="checkbox">多选</Option>
                <Option key="switch">开关</Option>
                <Option key="list">列表选择</Option>
                <Option key="items">容器</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表单ID"
          >
            {getFieldDecorator('id', {
              initialValue: formItem.id,
              rules: [{
                required: true, message: '表单ID必填',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否必填"
          >
            {getFieldDecorator('isRequired', {
              valuePropName: 'checked',
              initialValue: formItem.isRequired
            })(
              <Switch checkedChildren={<Icon type="check"/>}
                      unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否不可用"
          >
            {getFieldDecorator('disabled', {
              valuePropName: 'checked',
              initialValue: formItem.disabled
            })(
              <Switch checkedChildren={<Icon type="check"/>}
                      unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="默认值"
          >
            {getFieldDecorator('defaultValue', {
              initialValue: formItem.defaultValue
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

GeneratorEditor.propTypes = {
  visible: React.PropTypes.bool,
  formItem: React.PropTypes.object,
  onOk: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

GeneratorEditor.defaultProps = {

};

const WrappedGeneratorEditor = Form.create()(injectIntl(GeneratorEditor));

export default WrappedGeneratorEditor
