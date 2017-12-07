import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Spin, Row, Col, Tabs, Table, Icon } from 'antd'
const TabPane = Tabs.TabPane;
import menuRoute from 'share/menuRoute'

import 'styles/budget/budget-occupancy/export-detail.scss'

class ExportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      columns: [
        {title: '序号', dataIndex: 'id'},
        {title: '公司', dataIndex: '1'},
        {title: '预算期间', dataIndex: '2'},
        {title: '部门', dataIndex: '3'},
        {title: '预算项目', dataIndex: '4'},
        {title: '成本中心1', dataIndex: '5'},
        {title: '成本中心2', dataIndex: '6'},
        {title: '成本中心3', dataIndex: '7'}
      ],
      data: [],
      pagination: {
        total: 0,
      },
      budgetOccupancy:  menuRoute.getRouteItem('budget-occupancy','key'),    //预算占用调整
    }
  }

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
    const { loading, pagination, columns, data } = this.state;
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
