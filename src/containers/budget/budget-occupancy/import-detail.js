import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Spin, Row, Col, Tabs, Table, Icon } from 'antd'
const TabPane = Tabs.TabPane;
import menuRoute from 'share/menuRoute'

import 'styles/budget/budget-occupancy/export-detail.scss'

class ExportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableLoading: false,
      columns: [
        {title: '序号', dataIndex: 'index', render: (value, record, index) => this.state.pageSize * this.state.page + index + 1},
        {title: '公司', dataIndex: 'companyCodeName'},
        {title: '调整日期', dataIndex: 'periodName'},
        {title: '币种', dataIndex: 'currency'},
        {title: '预算项目', dataIndex: 'itemCodeName'},
        {title: '金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '部门', dataIndex: 'unitCodeName'},
        {title: '项目', dataIndex: 'costCenterItemCodeName'},
        {title: '产品', dataIndex: 'costCenterProductCodeName'},
        {title: '渠道', dataIndex: 'costCenterChannelCodeName'},
        {title: '团队', dataIndex: 'costCenterTeamCodeName'}
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

  }

  getInfo = () => {

  };

  getList = () =>{
    const { page, pageSize } = this.state;
    let url = `${config.budgetUrl}/api/budget/reserve/adjust/import/data?page=${page}&size=${pageSize}`;
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
        })
      }
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
    const { loading, tableLoading, pagination, columns, data } = this.state;
    return (
      <div className="export-detail background-transparent">
        <Spin spinning={loading}>
          <div className="top-info">
            <h3 className="header-title">导入详情</h3>
            <Row>
              <Col span={6}>
                {this.renderList('创建人', '曲丽丽-11123')}
                {this.renderList('导入说明', '111233444444')}
              </Col>
              <Col span={6}>
                {this.renderList('导入批次号', '111233444444')}
              </Col>
              <Col span={12}>
                {this.renderList('导入日期', '2017-01-10')}
              </Col>
            </Row>
          </div>
        </Spin>
        <Tabs className="detail-tabs">
          <TabPane tab="导入数据" key="export">
            <div className="tab-container">
              <h3 className="sub-header-title">导入数据</h3>
              <div style={{marginBottom:10}}>共搜索到 {pagination.total} 条数据</div>
              <Table roeKey={record => record.id}
                     columns={columns}
                     dataSource={data}
                     pagination={pagination}
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
