import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { Form, Tabs, Button, Row, Col, Spin, Table, Timeline, message, Popover, Popconfirm, Icon } from 'antd'
const TabPane = Tabs.TabPane;

import moment from 'moment'
import SlideFrame from 'components/slide-frame'
import NewPayPlan from 'containers/contract/new-pay-plan'
import 'styles/contract/contract-detail.scss'

class ContractDetailCommon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailLoading: false,
      planLoading: false,
      topTapValue: 'contractInfo',
      headerData: {},
      contractEdit: false, //合同是否可编辑
      contractStatus: {
        CANCEL: '已取消',
        FINISH: '已完成',
        GENERATE: '编辑中',
        HOLD: '暂挂',
        REJECTED: '已驳回',
        SUBMITTED: '审批中',
        CONFIRM: '已通过',
        WITHDRAWAL: '已撤回'  //字段未确认
      },
      subTabsList: [
        {label: '详情', key: 'DETAIL'},
        {label: '资金计划', key: 'PLAN'},
        {label: '预付款', key: 'ADVANCE'},
        {label: '费用申请', key: 'APPLY'},
        {label: '费用报销', key: 'PAYMENT'},
        {label: '支付明细', key: 'PayDETAIL'},
      ],
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render: (value, record, index) => this.state.pageSize * this.state.page + index + 1},
        {title: '币种', dataIndex: 'currency', width: '7%'},
        {title: '计划金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '合同方类型', dataIndex: 'partnerCategory'},
        {title: '合同方', dataIndex: 'partnerId'},
        {title: '计划付款日期', dataIndex: 'dueDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '备注', dataIndex: 'remark', render: value => {return (
          value ? <Popover placement="topLeft" content={value} overlayStyle={{maxWidth:300}}>{value}</Popover> : '-'
        )}}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      showSlideFrame: false,
      slideFrameTitle: '',
      record: {}, //资金计划行信息
      EditContract: menuRoute.getRouteItem('edit-contract', 'key'), //编辑合同
    }
  }

  componentWillMount() {
    this.getInfo();
    this.getPayList()
  }

  //获取合同信息
  getInfo = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/${this.props.id}`;
    this.setState({ detailLoading: true });
    httpFetch.get(url).then(res => {
      if (res.data.status === 'GENERATE' ||
        res.data.status === 'REJECTED' ||
        res.data.status === 'WITHDRAWAL') { //编辑中、已驳回、已撤回
        let columns = this.state.columns;
        columns[columns.length-1].title !== '操作' && columns.push(
          {title: '操作', dataIndex: 'id', width: '10%', render: (text, record) => (
            <span>
            <a onClick={(e) => this.editItem(e, record)}>编辑</a>
            <span className="ant-divider"/>
            <Popconfirm title="确认删除吗？" onConfirm={(e) => this.deleteItem(e, record)}><a>删除</a></Popconfirm>
          </span>)
          }
        );
        this.setState({ contractEdit: true, columns })
      }
      this.setState({
        headerData: res.data,
        detailLoading: false
      },() => {
        this.props.getContractStatus(this.state.headerData.status)
      })
    }).catch(() => {
      message.error('数据加载失败，请重试')
    })
  };

  //获取资金计划
  getPayList = () => {
    const { page, pageSize } = this.state;
    let url = `${config.contractUrl}/contract/api/contract/line/herder/${this.props.id}?page=${page}&size=${pageSize}`;
    this.setState({ planLoading: true });
    httpFetch.get(url).then(res => {
      this.setState({
        data: res.data,
        planLoading: false,
        pagination: {
          total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
          current: page + 1,
          onChange: this.onChangePaper
        }
      })
    })
  };

  onChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ page: page - 1 }, () => {
        this.getPayList()
      })
    }
  };

  handleTabsChange = (tab) => {
    this.setState({ topTapValue: tab })
  };

  //侧滑
  showSlide = (flag) => {
    this.setState({ showSlideFrame: flag })
  };

  renderList = (title, value) => {
    return (
      <Row className="list-info">
        <Col span={6}>{title}：</Col>
        <Col className="content" span={17}>{value}</Col>
      </Row>
    )
  };

  //关闭侧滑
  handleCloseSlide = (params) => {
    this.setState({
      showSlideFrame: false
    },() => {
      if (params) {
        this.getPayList();
        this.getInfo()
      }
    })
  };

  //编辑
  edit = () => {
    this.context.router.push(this.state.EditContract.url.replace(':id', this.props.id))
  };

  //添加资金计划行
  addItem = () => {
    this.setState({
      record: {},
      slideFrameTitle: '新增付款计划'
    },() => {
      this.showSlide(true)
    })
  };

  //编辑资金计划行
  editItem = (e, record) => {
    e.preventDefault();
    this.setState({
      record,
      showSlideFrame: true,
      slideFrameTitle: '编辑付款计划'
    })
  };

  //删除资金计划行
  deleteItem = (e, record) => {
    e.preventDefault();
    let url = `${config.contractUrl}/contract/api/contract/line/${record.id}`;
    this.setState({ planLoading: true });
    httpFetch.delete(url).then(() => {
      message.success(`删除成功`);
      this.getPayList();
      this.getInfo()
    }).catch(e => {
      this.setState({ planLoading: false });
      message.error(`删除失败，${e.response.data.message}`)
    })
  };

  //撤回
  contractRecall = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/withdrawal/${this.props.id}`;
    httpFetch.put(url).then(res => {
      if (res.status === 200) {
        message.success('撤回成功');
        this.getInfo()
      }
    }).catch(() => {
      message.error('撤回失败，请稍后再试');
    })
  };

  //暂挂
  contractHold = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/hold/${this.props.id}`;
    httpFetch.put(url).then(res => {
      if (res.status === 200) {
        message.success('暂挂成功');
        this.getInfo()
      }
    }).catch(() => {
      message.error('暂挂失败，请稍后再试');
    })
  };

  //取消暂挂
  contractCancelHold = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/unHold/${this.props.id}`;
    httpFetch.put(url).then(res => {
      if (res.status === 200) {
        message.success('取消暂挂成功');
        this.getInfo()
      }
    }).catch(() => {
      message.error('取消暂挂失败，请稍后再试');
    })
  };

  //取消
  contractCancel = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/cancel/${this.props.id}`;
    httpFetch.put(url).then(res => {
      if (res.status === 200) {
        message.success('取消成功');
        this.getInfo()
      }
    }).catch(() => {
      message.error('取消失败，请稍后再试');
    })
  };

  //完成
  contractFinish = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/finish/${this.props.id}`;
    httpFetch.put(url).then(res => {
      if (res.status === 200) {
        message.success('完成成功');
        this.getInfo()
      }
    }).catch(() => {
      message.error('完成失败，请稍后再试');
    })
  };

  render() {
    const { detailLoading, planLoading, contractEdit, topTapValue, subTabsList, pagination, columns, data, showSlideFrame, headerData, contractStatus, record, slideFrameTitle } = this.state;
    let contractInfo = (
      <Spin spinning={detailLoading}>
        <h3 className="header-title">{headerData.contractTypeName} {headerData.contractCategory}
          {contractEdit && <Button type="primary" onClick={this.edit}>编 辑</Button>}
          {!this.props.isApprovePage && headerData.status === 'SUBMITTED' && <Button type="primary" onClick={this.contractRecall}>撤 回</Button>}
          {!this.props.isApprovePage && headerData.status === 'CONFIRM' &&
            <div>
              <Button type="primary" onClick={this.contractFinish}>完 成</Button>
              <Button type="primary" onClick={this.contractCancel} style={{marginRight:10}}>取 消</Button>
              <Button type="primary" onClick={this.contractHold} style={{marginRight:10}}>暂 挂</Button>
            </div>}
          {!this.props.isApprovePage && headerData.status === 'HOLD' && <Button type="primary" onClick={this.contractCancelHold}>取消暂挂</Button>}
        </h3>
        <Row>
          <Col span={6}>
            {this.renderList('创建人', headerData.createdName + ' - ' + headerData.createdBy)}
            {this.renderList('创建日期', moment(headerData.createdDate).format('YYYY-MM-DD'))}
          </Col>
          <Col span={6}>
            {this.renderList('合同编号', headerData.contractNumber)}
          </Col>
          <Col span={12}>
            <div style={{float:'right'}}>
              <div className="amount-title">合同金额</div>
              <div className="amount-content">{headerData.currency} {this.filterMoney(headerData.amount)}</div>
            </div>
            <div style={{float:'right', marginRight:'50px'}}>
              <div className="status-title">状态</div>
              <div className="status-content">{contractStatus[headerData.status]}</div>
            </div>
          </Col>
        </Row>
      </Spin>
    );
    let contractHistory = (
      <div>
        <Timeline style={{marginTop:20}}>
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
        <Spin spinning={detailLoading}>
          <h3 className="sub-header-title">合同信息
            {contractEdit && <a className="edit" onClick={this.edit}>编辑</a>}
          </h3>
          <Row>
            <Col span={8}>{this.renderList('合同名称', headerData.contractName)}</Col>
            <Col span={8}>{this.renderList('签署日期', moment(headerData.signDate).format('YYYY-MM-DD'))}</Col>
          </Row>
          <Row>
            <Col span={8}>{this.renderList('公司', headerData.companyName)}</Col>
            <Col span={8}>{this.renderList('有效期限',
              headerData.startDate || headerData.endDate ?
                (
                  (headerData.startDate ? moment(headerData.startDate).format('YYYY-MM-DD') : '无')
                  + ' 至 ' +
                  (headerData.endDate ? moment(headerData.endDate).format('YYYY-MM-DD') : '无')
                ) : '-'
            )}</Col>
          </Row>
          <h3 className="margin-20-0">合同方信息</h3>
          <Row>
            <Col span={8}>{this.renderList('合同方类型', headerData.partnerCategoryName)}</Col>
            <Col span={8}>{this.renderList('合同方', headerData.partnerName)}</Col>
          </Row>
          <h3 className="margin-20-0">其他信息</h3>
          <Row>
            <Col span={8}>{this.renderList('责任部门', headerData.unitId ? headerData.unitId + ' - ' + headerData.unitName : '-')}</Col>
            <Col span={8}>{this.renderList('责任人', headerData.employeeId ? headerData.employeeId + ' - ' + headerData.employeeName : '-')}</Col>
          </Row>
          <Row>
            <Col span={8}>{this.renderList('备注', headerData.remark || '-')}</Col>
          </Row>
          <h3 className="margin-20-0">附件信息</h3>
          {headerData.attachmentURLs && headerData.attachmentURLs.map((url, index) => {
            return (
              <div key={index}>
                <Icon type="paper-clip" style={{marginRight:5}}/>
                <a href={`${config.contractUrl}${url}`} target="_blank">{url}</a>
              </div>
            )
          })}
        </Spin>
      </div>
    );
    subContent.PLAN = (
      <div className="tab-container">
        <Spin spinning={planLoading}>
          <h3 className="sub-header-title">付款计划</h3>
          <div className="table-header">
            <div className="table-header-buttons">
              {contractEdit && <Button type="primary" onClick={this.addItem}>添 加</Button>}
            </div>
            <div style={{marginBottom:'10px'}}>
              共 {pagination.total} 条数据<span className="ant-divider"/>
              合同总金额: {headerData.currency} {this.filterMoney(headerData.amount)}
            </div>
          </div>
          <Table rowKey={record => record.id}
                 columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"/>
        </Spin>
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
        <SlideFrame title={slideFrameTitle}
                    show={showSlideFrame}
                    content={NewPayPlan}
                    params={{id: this.props.id,currency: headerData.currency, record}}
                    onClose={() => this.showSlide(false)}
                    afterClose={this.handleCloseSlide}/>
      </div>
    )
  }
}

ContractDetailCommon.propTypes = {
  id: React.PropTypes.any.isRequired, //显示数据
  isApprovePage: React.PropTypes.bool, //是否在审批页面
  getContractStatus: React.PropTypes.func, //确认合同信息状态
};

ContractDetailCommon.defaultProps = {
  isApprovePage: false,
  getContractStatus: () => {}
};

ContractDetailCommon.contextTypes = {
  router: React.PropTypes.object
};

const wrappedContractDetailCommon = Form.create()(injectIntl(ContractDetailCommon));

export default wrappedContractDetailCommon;
