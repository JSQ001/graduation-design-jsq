import React from 'react'
import { injectIntl } from 'react-intl';
import { Modal, Form, Input, Select, Switch, Icon } from 'antd'
import httpFetch from 'share/httpFetch'
import config from 'config'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class GeneratorEditor extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formItem: {},
      sourceId: '',
      options:[],
      isSelected: false,
    };
  }

  componentDidMount(){
    console.log(this.props)
    this.setState({ formItem: this.props.formItem, sourceId: this.props.formItem.id })
  }

  componentWillReceiveProps(nextProps){
    this.setState({ formItem: nextProps.formItem, sourceId: nextProps.formItem.id })
  }

  handleChangeType = (value) => {
    switch(value) {
      case 'select':
        this.setState({isSelected: true});break;
      default: this.setState({isSelected: false});break;
    }
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onOk(Object.assign({}, this.state.formItem, values));
      let options = this.state.options;
      this.props.form.resetFields();
      this.setState({options:[]})
    })
  };

  handleAdd = ()=>{
    let options = this.state.options;
    let i = Number(options.length)+1
    options.push({title: "选项"+i,id: 'option'+i});
    this.setState({options})
  };

  renderOptions(){
    const { getFieldDecorator } = this.props.form;
    const { formItem, options } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 0 },
    };
    return this.state.isSelected ? (<div>
      {options.length>0 ?
        options.map((item,index)=>
          <FormItem
            {...formItemLayout}
            label={item.title}
            key = {item.id}
          >
            {getFieldDecorator(item.id, {
              initialValue: formItem.label,
              rules: [{
                required: true, message: '表单名必填'
              }],
            })(<div>
              <TextArea placeholder="请输入" autosize />
              </div>

            )}
          </FormItem>
        ) : null}
      <Icon onClick={this.handleAdd} type="plus"  style={{ fontSize: 20}}/>
    </div>) : null;
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
      <Modal visible={visible} title={this.props.title} onOk={this.handleOk} onCancel={onCancel}>
        <Form >
          <FormItem
            {...formItemLayout}
            label="题目类型"
          >
            {getFieldDecorator('type', {
              initialValue: formItem.type,
              rules: [{
                required: true, message: '表单类型必选'
              }],
            })(
              <Select onChange={this.handleChangeType}>
                <Option key="select">选择题</Option>
                <Option key="options">填空题</Option>
                <Option key="answer">问答题</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="题目名"
          >
            {getFieldDecorator('title', {
              initialValue: formItem.label,
              rules: [{
                required: true, message: '表单名必填'
              }],
            })(
              <TextArea placeholder="请输入" autosize />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="答案"
          >
            {getFieldDecorator('answer', {
              initialValue: formItem.label,
              rules: [{
                required: true, message: '表单名必填'
              }],
            })(
              <TextArea placeholder="请输入" autosize />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="分值"
          >
            {getFieldDecorator('rate', {
              initialValue: formItem.label,
              rules: [{
                required: true, message: '表单名必填'
              }],
            })(
              <Input placeholder="请输入"  />
            )}
          </FormItem>
          {
            this.renderOptions()
          }
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
