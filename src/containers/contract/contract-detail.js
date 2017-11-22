import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Tabs, Button, Row, Col, Affix, Spin, Breadcrumb, Table } from 'antd'
const TabPane = Tabs.TabPane;

import SlideFrame from 'components/slide-frame'
import NewPayPlan from 'containers/contract/new-pay-plan'
import 'styles/contract/contract-detail.scss'

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topLoading: false,
      bottomLoading: false,
      topTapValue: 'contractInfo',
      subTabsList: [
        {label: '详情', key: 'DETAIL'},
        {label: '资金计划', key: 'PLAN'},
        {label: '预付款', key: 'ADVANCE'},
        {label: '费用申请', key: 'APPLY'},
        {label: '费用报销', key: 'PAYMENT'},
        {label: '支付明细', key: 'PayDETAIL'},
      ],
      columns: [
        {title: '序号', dataIndex: 'index'},
        {title: '币种', dataIndex: 'currency'},
        {title: '计划金额', dataIndex: 'amount'},
        {title: '合同方类型', dataIndex: 'partnerCategory'},
        {title: '合同方', dataIndex: 'partnerId'},
        {title: '计划付款日期', dataIndex: 'dueDate'},
        {title: '备注', dataIndex: 'remark'},
        {title: '操作', dataIndex: 'id'}
      ],
      data: [],
      pagination: {
        total: 0
      },
      showSlideFrame: false,
    }
  }

  handleTabsChange = (tab) => {
    this.setState({ topTapValue: tab })
  };

  showSlide = (flag) => {
    this.setState({ showSlideFrame: flag })
  };

  renderList = (title, value) => {
    return (
      <div className="list-info">
        <span className="title">{title}：</span>
        <span className="content">{value}</span>
      </div>
    )
  };

  render() {
    const { loading, topLoading, bottomLoading, topTapValue, subTabsList, pagination, columns, data, showSlideFrame } = this.state;
    let contractInfo = (
      <Spin spinning={topLoading}>
        <h3 className="header-title">审计咨询合同 非摊销类
          <Button type="primary">编辑</Button>
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
              <div className="amount-title">合同金额</div>
              <div className="amount-content">CNY 568.08</div>
            </div>
            <div style={{float:'right', marginRight:'50px'}}>
              <div className="status-title">状态</div>
              <div className="status-content">待审批</div>
            </div>
          </Col>
        </Row>
      </Spin>
    );
    let contractHistory = (
      <div>合同历史</div>
    );
    let subContent = {};
    subContent.DETAIL = (
      <div className="tab-container">
        <Spin spinning={bottomLoading}>
          <h3 className="sub-header-title">合同信息</h3>
          <Row>
            <Col span={8}>{this.renderList('合同名称', '张艺兴明星代言合同')}</Col>
            <Col span={8}>{this.renderList('签署日期', '2017年12月25日')}</Col>
          </Row>
          <Row>
            <Col span={8}>{this.renderList('公司', '上海甄汇信息科技有限公司')}</Col>
            <Col span={8}>{this.renderList('有效期限', '-')}</Col>
          </Row>
          <h3 className="margin-20-0">合同方信息</h3>
          <Row>
            <Col span={8}>{this.renderList('合同方类型', '张艺兴明星代言合同')}</Col>
            <Col span={8}>{this.renderList('合同方', '甄汇科技')}</Col>
          </Row>
          <h3 className="margin-20-0">其他信息</h3>
          <Row>
            <Col span={8}>{this.renderList('责任部门', '112099-产品部')}</Col>
            <Col span={8}>{this.renderList('责任人', '李XX-11234')}</Col>
          </Row>
          <Row>
            <Col span={8}>{this.renderList('备注', '-')}</Col>
          </Row>
          <h3 className="margin-20-0">附件信息</h3>
        </Spin>
      </div>
    );
    subContent.PLAN = (
      <div className="tab-container">
        <h3 className="sub-header-title">付款计划</h3>
        <div className="table-header">
          <div className="table-header-buttons">
            <Button type="primary" onClick={() => this.showSlide(true)}>添 加</Button>
          </div>
          <Breadcrumb style={{marginBottom:'10px'}}>
            <Breadcrumb.Item>{`共 ${pagination.total || 0} 条数据`}</Breadcrumb.Item>
            <Breadcrumb.Item>{`合同总金额: CNY 568.00`}</Breadcrumb.Item>
            <Breadcrumb.Item>{`计划总金额: CNY 568.00`}</Breadcrumb.Item>
            <Breadcrumb.Item>{`待计划金额: CNY 568.00`}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={data}
               bordered
               size="middle"/>
      </div>
    );
    subContent.ADVANCE = (
      <div className="tab-container">
        <h3 className="sub-header-title">预付款</h3>
      </div>
    );
    subContent.APPLY = (
      <div className="tab-container">
        <h3 className="sub-header-title">费用申请</h3>
      </div>
    );
    subContent.PAYMENT = (
      <div className="tab-container">
        <h3 className="sub-header-title">费用报销</h3>
      </div>
    );
    subContent.PayDETAIL = (
      <div className="tab-container">
        <h3 className="sub-header-title">支付明细</h3>
      </div>
    );
    return (
      <div className="contract-detail background-transparent">
        <div className="top-info">
          <Tabs onChange={this.handleTabsChange}>
            <TabPane tab="合同信息" key="contractInfo">{contractInfo}</TabPane>
            <TabPane tab="合同历史" key="contractHistory">{contractHistory}</TabPane>
          </Tabs>
        </div>
        {topTapValue === 'contractInfo' &&
          <Tabs className="detail-tabs">
            {subTabsList.map((item) => {
              return <TabPane tab={item.label} key={item.key}>{subContent[item.key]}</TabPane>
            })}
          </Tabs>}
        <Affix offsetBottom={0} className="bottom-bar">
          <Button type="primary" htmlType="submit" loading={loading} style={{margin:'0 20px'}}>提 交</Button>
          <Button>保 存</Button>
          <Button style={{marginLeft:'50px'}}>删除该合同</Button>
          <Button style={{marginLeft:'20px'}}>返 回</Button>
        </Affix>
        <SlideFrame title="新建付款计划"
                    show={showSlideFrame}
                    content={NewPayPlan}
                    onClose={() => this.showSlide(false)}/>
      </div>
    )
  }
}

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
