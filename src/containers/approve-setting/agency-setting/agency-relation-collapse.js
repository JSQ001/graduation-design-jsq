import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Form, Button, Icon, Select, Switch, Checkbox, DatePicker, message, Collapse, Spin, Row, Col, Badge, Menu, Dropdown, Popconfirm } from 'antd';

class AgencyRelationCollapse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billProxyRuleDTOs: [],
      principalInfo: {},
    };
  }

  componentWillReceiveProps(nextProps){
    !this.state.principalInfo.principalOID && this.setState({
      billProxyRuleDTOs: nextProps.billProxyRuleDTOs,
      principalInfo: nextProps.principalInfo
    }, () => {

    })
  }

  //删除某个代理关系
  handleDelete = (e, index) => {
    console.log(index);
    let billProxyRuleDTOs = this.state.billProxyRuleDTOs;
    let principalInfo = this.state.principalInfo;
    billProxyRuleDTOs = billProxyRuleDTOs.slice(0, index).concat(billProxyRuleDTOs.slice(index+1));
    principalInfo.billProxyRuleDTOs = billProxyRuleDTOs;
    this.handleSave(principalInfo);
  };

  //编辑某个代理关系
  handleEdit = () => {

  };

  render(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, data, statusValue, billOptions, proxyVerify, fetching, billProxyRuleDTOs } = this.state;
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginTop: 10,
      border: 0,
      overflow: 'hidden',
    };
    console.log(billProxyRuleDTOs);
    const panel = billProxyRuleDTOs.map((item, index) => {
      console.log(item);
      const menu = (
        <Menu>
          <Menu.Item>
            <Popconfirm onConfirm={(e) => this.handleDelete(e, index)} title="你确定要删除这条数据吗?">
              <a>删除</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item><a>复制</a></Menu.Item>
        </Menu>
      );
      const panelHeader = (
        <div>
          <span className="header-principal">代理人：{item.proxyName}</span>
          <span className="header-more">
            <a onClick={this.handleEdit}>{formatMessage({id: 'common.edit'})/* 编辑 */}</a>
            <span className="ant-divider"/>
            <Dropdown overlay={menu}><a>更多 <Icon type="down"/></a></Dropdown>
          </span>
        </div>
      );
      return (
        <Panel header={panelHeader} key={index} style={customPanelStyle}>
          <div>
            <Row style={{marginBottom:'10px'}}>
              代理单据：{item.customFormDTOs.map((bill, index) => {
              return index < item.customFormDTOs.length-1 ? bill.formName + '，' : bill.formName
            })}
            </Row>
            <Row>
              <Col span={8}>代理日期：{item.startDate} 至 {item.proxyTimeRange == 102 ? item.endDate : '无限制'}</Col>
              <Col span={8}>状态：<Badge status={item.enabled ? 'success': 'error'} text={item.enabled ? '启用' : '禁用'} /></Col>
            </Row>
          </div>
        </Panel>
      )
    });
    console.log(panel);
    return (
      <div className="agency-relation-collapse">
        <Collapse bordered={false}>{panel}</Collapse>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

const WrappedAgencyRelationCollapse = Form.create()(AgencyRelationCollapse);

export default connect(mapStateToProps)(injectIntl(WrappedAgencyRelationCollapse));
