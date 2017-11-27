import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Tabs, Button, Row, Col, Spin, Breadcrumb, Table, Timeline } from 'antd'
const TabPane = Tabs.TabPane;

import SlideFrame from 'components/slide-frame'
import NewPayPlan from 'containers/contract/new-pay-plan'
import 'styles/contract/contract-detail.scss'

class ContractDetailCommon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { topLoading, bottomLoading, topTapValue, subTabsList, pagination, columns, data, showSlideFrame } = this.state;
    let contractInfo = (
      <Spin spinning={topLoading}>
        <h3 className="header-title">审计咨询合同 非摊销类
          {this.props.contractEdit && <Button type="primary">编辑</Button>}
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
      <div>
        <Timeline>
          <Timeline.Item color="grey">
            <p>
              <span style={{fontWeight:'bold'}}>等待审批</span>
              <span style={{marginLeft:50}}>【部门主管】王小明 1234，李丽丽 2234，王小明 1234</span>
            </p>
          </Timeline.Item>
          <Timeline.Item color="green">
            <p>
              <span style={{fontWeight:'bold'}}>审批通过</span>
              <span style={{marginLeft:50}}>【部门主管】王小明 1234</span>
            </p>
            <p>审批意见啦啦啦啦啦啦啦啦啦啦啦啦啦</p>
          </Timeline.Item>
          <Timeline.Item color="#ff6600">
            <p>
              <span style={{fontWeight:'bold'}}>审批驳回</span>
              <span style={{marginLeft:50}}>【部门主管】王小明 1234</span>
            </p>
            <p style={{color:'#ff6600'}}>金额超标，不同意！金额超标，不同意！金额超标，不同意！金额超标，不同意！</p>
          </Timeline.Item>
          <Timeline.Item>
            <p>
              <span style={{fontWeight:'bold'}}>提交审批</span>
              <span style={{marginLeft:50}}>王小明 1234</span>
            </p>
          </Timeline.Item>
        </Timeline>
      </div>
    );
    let subContent = {};
    subContent.DETAIL = (
      <div className="tab-container">
        <Spin spinning={bottomLoading}>
          <h3 className="sub-header-title">合同信息
            {this.props.contractEdit && <a className="edit">编辑</a>}
          </h3>
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
            {this.props.contractEdit && <Button type="primary" onClick={() => this.showSlide(true)}>添 加</Button>}
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
      <div className="contract-detail-common">
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
        <SlideFrame title="新建付款计划"
                    show={showSlideFrame}
                    content={NewPayPlan}
                    onClose={() => this.showSlide(false)}/>
      </div>
    )
  }
}

ContractDetailCommon.propTypes = {
  contractEdit: React.PropTypes.bool,  //合同信息是否可编辑
};

ContractDetailCommon.defaultProps = {
  contractEdit: false
};

const wrappedContractDetailCommon = Form.create()(injectIntl(ContractDetailCommon));

export default wrappedContractDetailCommon;
