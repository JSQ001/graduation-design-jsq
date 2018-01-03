/**
 * Created by 13576 on 2017/12/5.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { Form, Tabs, Button, Row, Col, Spin,Breadcrumb, Table, Timeline, message, Popover, Popconfirm } from 'antd'
const TabPane = Tabs.TabPane;
import moment from 'moment'
import SlideFrame from 'components/slide-frame'
import  NewPrePaymentDetail from 'containers/pre-payment/my-pre-payment/new-pre-payment-detail'
import 'styles/pre-payment/my-pre-payment/pre-payment-detail.scss'
import {connect} from 'react-redux'


class PrePaymentCommon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topLoading: false,
      detailLoading: false,
      planLoading: false,
      loading:false,
      topTapValue: 'contractInfo',
      headerData: {},
      contractStatus: {
        CANCEL: '取消',
        CONFIRM: '确认',
        FINISH: '完成',
        GENERATE: '新建',
        HOLD: '暂挂',
        REJECTED: '拒绝',
        SUBMITTED: '提交',
      },
      subTabsList: [
        {label: '详情', key: 'DETAIL'},
      ],
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render: (value, record, index) => (index + 1)},
        {title: '说明', dataIndex: 'remark', render: value => {return (
          value ? <Popover placement="topLeft" content={value} overlayStyle={{maxWidth:300}}>{value}</Popover> : '-'
        )}},
        {title: '预付款类型', dataIndex: 'partnerCategory'},
        {title:'关联申请单',dataIndex:'123'},
        {title: '预付款金额', dataIndex: 'amount',
          render: this.filterMoney
        },
        {title: '本位币金额', dataIndex: 'fAmount',
          render: this.filterMoney
        },
        {title: '收款方', dataIndex: 'currency'},
        {title: '银行账号', dataIndex: 'partnerI'},
        {title: '银行户名', dataIndex: 'part'},
        {title: '计划付款日期', dataIndex: 'dueDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '银行户名', dataIndex: 'part1'},
        {title: '银行户名', dataIndex: 'partvfvf'},
        {title:'预付款方式类型',dataIndex:''},
        {title:'关联合同',dataIndex:'ggg'},
        {title:'合同付款计划行',dataIndex:'gtrgtrgt'},
        {title: '操作', dataIndex: 'id', render: (text, record) => (
          <span>
            <a onClick={(e) => this.editItem(e, record)}>编辑</a>
            <span className="ant-divider"/>
            <Popconfirm title="确认删除吗？" onConfirm={(e) => this.deleteItem(e, record)}><a>删除</a></Popconfirm>
          </span>)
        }
      ],
      data: [],
      planAmount: 0,
      pagination: {
        total: 0
      },
      pageSize: 10,
      page: 0,
      showSlideFrame: false,
      slideFrameTitle: '',
      stateName: '',
      record: {}, //资金计划行信息
      NewContract: menuRoute.getRouteItem('new-contract', 'key'), //新建合同
      EditPayRequisition: menuRoute.getRouteItem('new-pre-payment', 'key'), //新建预付款
    }
  }

  componentWillMount() {

    console.log(this.props.company);

    this.getInfo();
    this.getPayInfo()
  }

  //获取合同信息
  getInfo = () => {
    let url = `http://192.168.1.195:8072/api/cash/prepayment/requisitionHead/${this.props.id}`;
    this.setState({ detailLoading: true });
    httpFetch.get(url).then(res => {
      this.setState({
        headerData: res.data.head,
        detailLoading: false
      })
    }).catch(() => {
      message.error('数据加载失败，请重试')
    })
  };


  //获取资金计划
  getPayInfo = () => {
    // let url = `${config.contractUrl}/contract/api/contract/line/herder/${this.props.id}`;
    // this.setState({ planLoading: true });
    // httpFetch.get(url).then(res => {
    //   let planAmount = 0;
    //   res.data.map(item => {
    //     planAmount += item.amount;
    //   });
    //   this.setState({
    //     data: res.data,
    //     planAmount,
    //     planLoading: false,
    //     pagination: {
    //       total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
    //     }
    //   })
    // })
  };

  getStateNameByCode = (code) => {
    this.getSystemValueList(2028).then(res => {
      let info = res.data.values.find(o => o.value == code);
      this.setState({ stateName: info.messageKey });
    })
  }

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
        <Col className="content" span={18}>{value}</Col>
      </Row>
    )
  };

  //关闭侧滑
  handleCloseSlide = (params) => {
    this.setState({
      showSlideFrame: false
    },() => {
      params && this.getPayInfo();
    })
  };
  //编辑
  edit = () => {
    this.context.router.push(this.state.EditPayRequisition.url.replace(':id',this.props.id).replace(':prePaymentTypeId',0));
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
      this.getPayInfo()
    }).catch(e => {
      this.setState({ planLoading: false });
      message.error(`删除失败，${e.response.data.message}`)
    })
  };

  newItemTypeShowSlide= () => {

  }

  rowClick=()=>{

  }

  render() {
    const { stateName,topLoading, detailLoading,loading,planAmount,planLoading, topTapValue, subTabsList, pagination, columns, data, showSlideFrame, headerData, contractStatus, record, slideFrameTitle } = this.state;
    let contractInfo = (
      <Spin spinning={topLoading}> 
        <h3 className="header-title">{headerData.typeName} 预付款
          {this.props.contractEdit && <Button type="primary" onClick={this.edit}>编 辑</Button>}
        </h3>
        <Row>
          <Col span={6}>
            {this.renderList('创建人', headerData.createByName)}
            {this.renderList('创建日期', moment(headerData.createdDate).format('YYYY-MM-DD'))}
          </Col>
          <Col span={6}>
            {this.renderList('单据编号', headerData.requisitionNumber)}
          </Col>
          <Col span={12}>
            <div style={{float:'right'}}>
              <div className="amount-title">预付款总金额</div>
              <div className="amount-content">{headerData.currency} {this.filterMoney(headerData.amount)}</div>
            </div>
            <div style={{float:'right', marginRight:'50px'}}>
              <div className="status-title">状态</div>
              <div className="status-content">{headerData.statusName}</div>
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
      <div>
        {/*detailLoading*/}
        <Spin spinning={false}>
        <div className="tab-container" style={{marginBottom:16}}>
            <h3 className="sub-header-title">基本信息
              {this.props.contractEdit && <a className="edit" onClick={this.edit}>编辑</a>}
            </h3>
            <Row>
              <Col span={12}>{this.renderList('申请日期', moment(headerData.requisitionDate).format('YYYY-MM-DD'))}</Col>
              <Col span={12}>{this.renderList('公司', headerData.companyName)}</Col>
              <Col span={12}>{this.renderList('申请人', headerData.employeeName)}</Col>
              <Col span={12}>{this.renderList('部门', headerData.unitName)}</Col>
            </Row>
            <Row>
              <Col span={8}>{this.renderList('事由说明', headerData.description)}</Col>
            </Row>
            <h3 className="margin-20-0">附件信息</h3>
            {headerData.attachments?headerData.attachments.map(item => {
              return <div key={item.attachmentOID}>{item.fileName}</div>
            }):""}
        </div>
          <div className="tab-container">
              <h3 className="sub-header-title">付款信息</h3>
              <div className="table-header">
                <div className="table-header-buttons">
                  {this.props.contractEdit && <Button type="primary" onClick={this.addItem}>添 加</Button>}
                </div>
                <Breadcrumb style={{marginBottom:'10px'}}>
                  <Breadcrumb.Item>共 {pagination.total} 条数据</Breadcrumb.Item>
                  <Breadcrumb.Item>金额: {headerData.currency} {this.filterMoney(planAmount)}</Breadcrumb.Item>
                  <Breadcrumb.Item>本币金额: {"CNY"} {this.filterMoney(headerData.amount - planAmount)}</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <Table rowKey={record => record.id}
                     columns={columns}
                     dataSource={data}
                     bordered
                     onRow={record => ({
                       onClick: () => this.rowClick(record)
                     })}
                     loading={planLoading}
                     size="middle"/>
          </div>
        </Spin>
      </div>

    );

    return (
      <div className="pre-payment-common">
        <div className="top-info">
          <Tabs onChange={this.handleTabsChange}>
            <TabPane tab="单据信息" key="contractInfo">{contractInfo}</TabPane>
            {/* <TabPane tab="单据历史" key="contractHistory">{contractHistory}</TabPane> */}
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
                    content={NewPrePaymentDetail}
                    params={{id: this.props.id,currency: headerData.currency, record}}
                    onClose={() => this.showSlide(false)}
                    afterClose={this.handleCloseSlide}/>
      </div>
    )
  }
}

PrePaymentCommon.propTypes = {
  id: React.PropTypes.any.isRequired, //显示数据
  contractEdit: React.PropTypes.bool,  //合同信息是否可编辑
};

PrePaymentCommon.defaultProps = {
  contractEdit: false
};

PrePaymentCommon.contextTypes = {
  router: React.PropTypes.object
};


const wrappedPrePaymentCommon = Form.create()(injectIntl(PrePaymentCommon));

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company,
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(wrappedPrePaymentCommon));
