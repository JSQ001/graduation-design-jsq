import React from 'react'
import { Form, Card, Row, Col, Badge, Button, Input, Switch, Icon } from 'antd'
const FormItem = Form.Item;

import '../styles/components/basic-info.scss'

class BasicInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      cardShowStyle: {
        display: 'block'
      },
      formShowStyle: {
        display: 'none'
      }
    };
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
    switch(item.type) {
      case 'input': {
        return <div>{item.value}</div>;
      }
      case 'state': {
        return <Badge status={item.value ? 'success' : 'error'} text={item.value ? '启用' : '禁用'} />;
      }
    }
  }
  getInfos() {
    const children = [];
    this.props.infoList.map((item, i)=>{
      children.push(
        <Col span={8} style={{marginBottom: '15px',padding: '0 20px'}}>
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
        return <Input placeholder="请输入"/>;
      }
      case 'state': {
        return (
          <div>
            <Switch defaultChecked={item.value} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
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
        <Col span={8} style={{marginBottom: '15px',padding: '0 20px'}}>
          <FormItem {...formItemLayout} label={item.title} colon={false}>
            {getFieldDecorator(item.id, {initialValue: item.value})(
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
    }), () => {
      console.log(this.state.isEnabled)
    })
  }

  render() {
    const { cardShowStyle, formShowStyle } = this.state;
    const gridStyle = {
      width: '30%',
      textAlign: 'center',
    };
    return (
      <div className="basic-name">
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
  infoList: React.PropTypes.array.isRequired,  //传入的基础信息列表
};

const WrappedBasicInfo= Form.create()(BasicInfo);

export default WrappedBasicInfo;

