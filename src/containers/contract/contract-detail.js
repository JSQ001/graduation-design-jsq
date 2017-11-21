import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Tabs, Button, Row, Col, Affix } from 'antd'
const TabPane = Tabs.TabPane;

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subTabsList: [
        {label: '详情', key: 'DETAIL'},
        {label: '资金计划', key: 'PLAN'},
        {label: '预付款', key: 'ADVANCE'},
        {label: '费用申请', key: 'APPLY'},
        {label: '费用报销', key: 'PAYMENT'},
        {label: '支付明细', key: 'PayDETAIL'},
      ]
    }
  }

  renderList = (title, value) => {
    return (
      <div style={{fontSize:'15px', color:'#333', marginBottom:'8px'}}>
        {title}：
        <span style={{color:'#666'}}>{value}</span>
      </div>
    )
  };

  render() {
    const { loading, subTabsList } = this.state;
    let subContent = {};
    subContent.DETAIL = (
      <div>detail</div>
    );
    subContent.PLAN = 'PLAN';
    subContent.ADVANCE = 'ADVANCE';
    subContent.APPLY = 'APPLY';
    subContent.PAYMENT = 'PAYMENT';
    subContent.PayDETAIL = 'PayDETAIL';
    let contractInfo = (
      <div>
        <div className="contract-header">
          <h3 className="header-title">审计咨询合同 非摊销类
            <Button type="primary" style={{float:'right'}}>编辑</Button>
          </h3>
          <Row>
            <Col span={6}>
              {this.renderList('创建人', '曲丽丽-11123')}
              {this.renderList('创建日期', '2017-11-11')}
            </Col>
            <Col span={6}>
              {this.renderList('合同编号', '118934342035412')}
            </Col>
            <Col span={12}>
              <div style={{float:'right'}}>
                <div style={{textAlign:'right', fontSize:'14px'}}>合同金额</div>
                <div style={{fontSize:'24px', color: '#333'}}>CNY 568.08</div>
              </div>
              <div style={{float:'right', marginRight:'50px'}}>
                <div style={{textAlign:'right', fontSize:'14px'}}>状态</div>
                <div style={{fontSize:'24px', color: '#333'}}>待审批</div>
              </div>
            </Col>
          </Row>
        </div>
        <Tabs style={{marginTop:'20px'}}>
          {subTabsList.map((item) => {
            return <TabPane tab={item.label} key={item.key}>{subContent[item.key]}</TabPane>
          })}
        </Tabs>
      </div>
    );
    let contractHistory = (
      <div>合同历史</div>
    );
    return (
      <div className="contract-detail background-transparent">
        <Tabs type="card" style={{marginBottom:'20px'}}>
          <TabPane tab="合同信息" key="contractInfo">{contractInfo}</TabPane>
          <TabPane tab="合同历史" key="contractHistory">{contractHistory}</TabPane>
        </Tabs>
        <Affix offsetBottom={0}
               style={{position:'absolute',bottom:0,left: 0, width:'100%', height:'50px', boxShadow:'0px -5px 5px rgba(0, 0, 0, 0.067)', background:'#fff',lineHeight:'50px'}}>
          <Button type="primary" htmlType="submit" loading={loading} style={{margin:'0 20px 0 230px'}}>提 交</Button>
          <Button>保 存</Button>
          <Button style={{marginLeft:'50px'}}>删除该合同</Button>
          <Button style={{marginLeft:'20px'}}>返 回</Button>
        </Affix>
      </div>
    )
  }
}

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
