import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Tabs, Table } from 'antd'
const TabPane = Tabs.TabPane;
import config from 'config'
import httpFetch from 'share/httpFetch'

import SearchArea from 'components/search-area'

class Contract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading1: false,
      loading2: false,
      SearchForm: [
        {type: 'input', id: 'contractNumber', label: '合同编号'},
        {type: 'input', id: 'contractName', label: '合同名称'},
        {type: 'items', id: 'price', items: [
          {type: 'input', id: 'amountBegin', label: '合同金额从'},
          {type: 'input', id: 'amountEnd', label: '合同金额至'}
        ]},
        {type: 'items', id: 'signDate', items: [
          {type: 'date', id: 'signDateStart', label: '签订日期从'},
          {type: 'date', id: 'signDateEnd', label: '签订日期至'}
        ]},
        {type: 'input', id: 'companyId', label: '公司'},
        {type: 'input', id: 'contractTypeId', label: '合同类型'},
        {type: 'value_list', id: 'partnerCategory', label: '合同方类型', valueListCode: 2107, options: []},
        {type: 'input', id: 'partnerId', label: '合同方'},
        {type: 'input', id: 'employeeId', label: '创建人'},
      ],
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render:(value, record, index) => index + 1},
        {title: '申请人', dataIndex: 'companyId'},
        {title: '提交时间', dataIndex: 'contractTypeId'},
        {title: '类型', dataIndex: 'contractTypeName'},
        {title: '报销单号', dataIndex: 'signDate'},
        {title: '币种', dataIndex: 'currency'},
        {title: '金额', dataIndex: 'amount'},
        {title: '状态', dataIndex: 'status'},
      ],
      unapprovedData: [],
      approvedData: [],
      unapprovedPagination: {
        total: 0
      },
      approvedPagination: {
        total: 0
      },
      unapprovedPage: 0,
      unapprovedPageSize: 10,
      approvedPage: 0,
      approvedPageSize: 10,
    }
  }

  componentWillMount() {
    this.getUnapprovedList();
    this.getApprovedList()
  }

  getUnapprovedList = () => {
    const { unapprovedPage, unapprovedPageSize } = this.state;
    let unapprovedUrl = `${config.contractUrl}/contract/api/contract/header/confirm/query?page=${unapprovedPage}&size=${unapprovedPageSize}`;
    this.setState({ loading1: true });
    httpFetch.get(unapprovedUrl).then((res) => {
      if (res.status === 200) {
        this.setState({
          unapprovedData: res.data,
          loading1: false,
          unapprovedPagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: unapprovedPage + 1,
            onChange: this.onUnapprovedChangePaper
          }
        })
      }
    })
  };

  getApprovedList = () => {
    const { approvedPage, approvedPageSize } = this.state;
    let approvedUrl = `${config.contractUrl}/contract/api/contract/header/confirmEd/query?page=${approvedPage}&size=${approvedPageSize}`;
    this.setState({ loading2: true });
    httpFetch.get(approvedUrl).then((res) => {
      if (res.status === 200) {
        this.setState({
          approvedData: res.data,
          loading2: false,
          approvedPagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: approvedPage + 1,
            onChange: this.onApprovedChangePaper
          }
        })
      }
    })
  };

  onUnapprovedChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ unapprovedPage: page - 1 }, () => {
        this.getUnapprovedList()
      })
    }
  };

  onApprovedChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ approvedPage: page - 1 }, () => {
        this.getApprovedList()
      })
    }
  };

  unapprovedSearch = (values) => {
    console.log(values)
  };

  approvedSearch = (values) => {
    console.log(values)
  };

  render() {
    const { loading1, loading2, SearchForm, columns, unapprovedData, approvedData, unapprovedPagination, approvedPagination } = this.state;
    return (
      <div className="approve-contract">
        <Tabs onChange={this.handleTabsChange}>
          <TabPane tab="未审批" key="unapproved">
            <SearchArea searchForm={SearchForm}
                        submitHandle={this.unapprovedSearch}/>
            <div className="table-header">
              <div className="table-header-title">{`共搜索到 ${unapprovedPagination.total} 条数据`}</div>
            </div>
            <Table rowKey={record => record.id}
                   columns={columns}
                   dataSource={unapprovedData}
                   padination={unapprovedPagination}
                   loading={loading1}
                   bordered
                   size="middle"/>
          </TabPane>
          <TabPane tab="已审批" key="approved">
            <SearchArea searchForm={SearchForm}
                        submitHandle={this.approvedSearch}/>
            <div className="table-header">
              <div className="table-header-title">{`共搜索到 ${approvedPagination.total} 条数据`}</div>
            </div>
            <Table rowKey={record => record.id}
                   columns={columns}
                   dataSource={approvedData}
                   padination={approvedPagination}
                   loading={loading2}
                   bordered
                   size="middle"/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const wrappedContract = Form.create()(injectIntl(Contract));

export default wrappedContract


