import React from 'react'
import { Form, Card, Row, Col, Badge, Button, Input, Switch, Icon, Select } from 'antd'
const FormItem = Form.Item;

import '../styles/components/basic-info.scss'

class BasicInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      params: this.props.infoData,
      isEnabled: true,
      cardShowStyle: {
        display: 'block'
      },
      formShowStyle: {
        display: 'none'
      }
    };
  }

  componentWillMount() {
    console.log(this.props.infoList);
    console.log(this.props.infoData);
    this.props.infoList.map((item, i) => {
      if(item.type=='state') {
        this.setState({
          isEnabled: this.state.params[item.id]
        })
      }
    })
  }

  editInfo = () => {
    this.setState({
      cardShowStyle: {
        display: 'none'
      },
      formShowStyle: {
        display: 'block'
      }
    })
  }

  renderGetInfo(item) {
    if (item.type == 'state') {
      return <Badge status={this.state.params[item.id] ? 'success' : 'error'} text={this.state.params[item.id] ? '启用' : '禁用'} />;
    } else {
      return <div>{this.state.params[item.id]}</div>;
    }
  }
  getInfos() {
    const children = [];
    this.props.infoList.map((item, i)=>{
      children.push(
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.title}</div>
          {this.renderGetInfo(item)}
        </Col>
      );
    });
    return children;
  }

  renderUpdateInfos = (item) => {
    switch(item.type) {
      case 'input': {
        return <Input placeholder="请输入" disabled={item.isDisabled || false} className="input-disabled-color"/>;
      }
      case 'select': {
        return (
          <Select>
            {item.options.map((option)=>{
              return <Select.Option value={option.value} key={option.value}>{option.label}</Select.Option>
            })}
          </Select>
        )
      }
      case 'state': {
        return (
          <div>
            <Switch defaultChecked={this.state.params[item.id]} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
            <span className="enabled-type">{ this.state.isEnabled ? '启用' : '禁用' }</span>
          </div>
        );
      }
    }
  }
  updateInfos() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {};
    const children = [];
    this.props.infoList.map((item, i)=>{
      children.push(
        <Col span={8} style={{marginBottom: '15px',padding: '0 20px'}} key={item.id}>
          <FormItem {...formItemLayout} label={item.title} colon={false}>
            {getFieldDecorator(item.id, {
              rules: [{
                required: item.message ? true : false,
                message: item.message
              }],
              initialValue: this.state.params[item.id]
            })(
              this.renderUpdateInfos(item)
            )}
          </FormItem>
        </Col>
      );
    });
    return children;
  }

  handleUpdate() {
    console.log("更新数据")
  }

  handelCancel = () => {
    this.setState({
      cardShowStyle: {
        display: 'block'
      },
      formShowStyle: {
        display: 'none'
      }
    })
  }

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  }

  render() {
    const { cardShowStyle, formShowStyle } = this.state;
    return (
      <div className="basic-info">
        <Card title="基本信息"
              extra={<a onClick={this.editInfo}>编辑</a>}
              style={cardShowStyle}
              noHovering >
          <Row>{this.getInfos()}</Row>
        </Card>
        <Form className="ant-advanced-search-form common-top-area"
              style={formShowStyle}
              onSubmit={this.handleUpdate}>
          <Row>{this.updateInfos()}</Row>
          <Button type="primary" htmlType="submit" style={{margin: '0 15px 0 20px'}}>保存</Button>
          <Button onClick={this.handelCancel}>取消</Button>
        </Form>
      </div>
    )
  }
}

BasicInfo.propTypes = {
  infoList: React.PropTypes.array.isRequired,  //传入的基础信息列表，数组
  infoData: React.PropTypes.object.isRequired,  //传入的基础信息值，对象
};

/**
 *
 * infoList参数每一项的格式如下：
 * {
      type: '',    //必填，类型为input、select、state中的一种
      title: '',   //必填，对应标题名称
      id: '',      //必填，对应字段名称
      options: [{label: '', value: ''}],    //可选，如果不为input、date时必填，为该表单选项数组，因为不能下拉刷新，所以如果可以搜索type请选择combobox或multiple，否则一次性传入所有值
      message:     //可选，如果为必填项则需要填写提示信息
      isDisabled:  //可选，布尔值，不可编辑时需要填写  isDisabled: true
    }
 */

const WrappedBasicInfo= Form.create()(BasicInfo);

export default WrappedBasicInfo;

