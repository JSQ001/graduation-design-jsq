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
      loading: false,
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
        {title: '合同编号', dataIndex: 'contractNumber'},
        {title: '公司', dataIndex: 'companyId'},
        {title: '合同类型', dataIndex: 'contractTypeId'},
        {title: '合同名称', dataIndex: 'contractTypeName'},
        {title: '签署日期', dataIndex: 'signDate'},
        {title: '合同方类型', dataIndex: 'partnerCategory'},
        {title: '合同方', dataIndex: 'partnerId'},
        {title: '币种', dataIndex: 'currency'},
        {title: '合同金额', dataIndex: 'amount'},
        {title: '创建人', dataIndex: 'createdBy'}
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
    this.getList()
  }

  getList = () => {
    const { unapprovedPage, unapprovedPageSize, approvedPage, approvedPageSize } = this.state;
    let url = `${config.contractUrl}/contract/api/contract/header/confirm/query?page=${unapprovedPage}&size=${unapprovedPageSize}`;
    httpFetch.get(url).then((res) => {

    })
  };

  unapprovedSearch = (values) => {
    console.log(values)
  };

  approvedSearch = (values) => {
    console.log(values)
  };

  render() {
    const { loading, SearchForm, columns, unapprovedData, approvedData, unapprovedPagination, approvedPagination } = this.state;
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
                   loading={loading}
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
                   loading={loading}
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


