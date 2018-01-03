import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Spin, Row, Col, Tabs, Table, Icon, message } from 'antd'
const TabPane = Tabs.TabPane;
import menuRoute from 'routes/menuRoute'

import moment from 'moment'
import 'styles/budget/budget-occupancy/import-detail.scss'

class ExportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableLoading: false,
      headerData: {},
      columns: [
        {title: '序号', dataIndex: 'index', render: (value, record, index) => this.state.pageSize * this.state.page + index + 1},
        {title: '公司', dataIndex: 'companyName'},
        {title: '调整日期', dataIndex: 'periodName'},
        {title: '币种', dataIndex: 'currency'},
        {title: '预算项目', dataIndex: 'itemName'},
        {title: '金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '部门', dataIndex: 'unitName'},
        {title: '项目', dataIndex: 'costCenterItemName'},
        {title: '产品', dataIndex: 'costCenterProductName'},
        {title: '渠道', dataIndex: 'costCenterChannelName'},
        {title: '团队', dataIndex: 'costCenterTeamName'}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0,
      },
      budgetOccupancy:  menuRoute.getRouteItem('budget-occupancy','key'),    //预算占用调整
    }
  }

  componentWillMount() {
    let info = new Promise((resolve, reject) => {
      this.getInfo(resolve, reject)
    });
    let list = new Promise((resolve, reject) => {
      this.getList(resolve, reject)
    });
    Promise.all([ info, list ]).catch(() => {
      message.error('数据加载失败，请重试')
    })
  }

  getInfo = (resolve, reject) => {
    let url = `${config.budgetUrl}/api/budget/reserve/adjust/${this.props.params.id}`;
    this.setState({ loading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          headerData: res.data,
          loading: false
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ loading: false });
      reject()
    })
  };

  getList = (resolve, reject) =>{
    const { page, pageSize } = this.state;
    let url = `${config.budgetUrl}/api/budget/reserve/adjust/import/ajust/data?batchNumber=${this.props.params.batchNumber}&page=${page}&size=${pageSize}`;
    this.setState({ tableLoading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          data: res.data,
          tableLoading: false,
          pagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            onChange: this.onChangePager,
            current: page + 1
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ tableLoading: false });
      reject()
    })
  };

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({ page: page - 1 }, ()=>{
        this.getList();
      })
  };

  renderList = (title, value) => {
    return (
      <div style={{fontSize:14, color:'#333', marginBottom:8}}>
        <span>{title}：</span>
        <span style={{color:'#666'}}>{value}</span>
      </div>
    )
  };

  handleBack = () => {
    this.context.router.replace(this.state.budgetOccupancy.url);
  };

  render() {
    const { loading, tableLoading, headerData, pagination, columns, data } = this.state;
    return (
      <div className="import-detail background-transparent">
        <Spin spinning={loading}>
          <div className="top-info">
            <h3 className="header-title">导入详情</h3>
            <Row>
              <Col span={6}>
                {this.renderList('创建人', headerData.employeeName + ' - ' + headerData.createdBy)}
                {this.renderList('导入说明', headerData.remark)}
              </Col>
              <Col span={6}>
                {this.renderList('导入批次号', headerData.batchNumber)}
              </Col>
              <Col span={12}>
                {this.renderList('导入日期', moment(headerData.createdDate).format('YYYY-MM-DD'))}
              </Col>
            </Row>
          </div>
        </Spin>
        <Tabs className="detail-tabs">
          <TabPane tab="导入数据" key="export">
            <div className="tab-container">
              <h3 className="sub-header-title">导入数据</h3>
              <div style={{marginBottom:10}}>共搜索到 {pagination.total} 条数据</div>
              <Table rowKey={record => record.id}
                     columns={columns}
                     dataSource={data}
                     pagination={pagination}
                     scroll={{x:true, y:false}}
                     loading={tableLoading}
                     bordered
                     size="middle"/>
            </div>
          </TabPane>
        </Tabs>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}>
          <Icon type="rollback" style={{marginRight:'5px'}}/>返回
        </a>
      </div>
    )
  }
}

ExportDetail.contextTypes = {
  router: React.PropTypes.object
};

const wrappedExportDetail = Form.create()(injectIntl(ExportDetail));

export default wrappedExportDetail;
