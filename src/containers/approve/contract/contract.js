import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Tabs, Table, message, Badge } from 'antd'
const TabPane = Tabs.TabPane;
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'

import SearchArea from 'components/search-area'
import moment from 'moment'

class Contract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading1: false,
      loading2: false,
      contractStatus: {
        CANCEL: {label: '已取消', state: 'default'},
        FINISH: {label: '已完成', state: 'success'},
        GENERATE: {label: '编辑中', state: 'processing'},
        HOLD: {label: '暂挂', state: 'warning'},
        SUBMITTED: {label: '审批中', state: 'processing'},
        REJECTED: {label: '已驳回', state: 'error'},
        CONFIRM: {label: '已通过', state: 'success'},
        WITHDRAWAL: {label: '已撤回', state: 'warning'},
      },
      SearchForm: [
        {type: 'input', id: 'contractNumber', label: '合同编号'},
        {type: 'input', id: 'companyId', label: '申请人姓名/工号'},
        {type: 'input', id: 'contractTypeName', label: '合同类型'},
        {type: 'items', id: 'createdDate', items: [
          {type: 'date', id: 'createdDateBegin', label: '提交时间从'},
          {type: 'date', id: 'createdDateEnd', label: '提交时间至'}
        ]},
      ],
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render:(value, record, index) => index + 1},
        {title: '申请人', dataIndex: 'companyId'},
        {title: '提交时间', dataIndex: 'createdDate', render: value => moment(value).format('YYYY-MM-DD')},
        {title: '合同类型', dataIndex: 'contractTypeName'},
        {title: '合同编号', dataIndex: 'contractNumber', width: '18%'},
        {title: '币种', dataIndex: 'currency'},
        {title: '金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '状态', dataIndex: 'status', width: '7%', render: value => <Badge status="success" text={this.state.contractStatus[value].label}/>},
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
      ContractDetail: menuRoute.getRouteItem('approve-contract-detail', 'key'), //合同详情
    }
  }

  componentWillMount() {
    return new Promise((resolve, reject) => {
      this.getUnapprovedList(resolve, reject);
      this.getApprovedList(resolve, reject)
    }).catch(() => {
      message.error('数据加载失败，请重试')
    });
  }

  //获取未审批列表
  getUnapprovedList = (resolve, reject) => {
    const { unapprovedPage, unapprovedPageSize } = this.state;
    let unapprovedUrl = `${config.contractUrl}/contract/api/contract/header/confirm/query?page=${unapprovedPage}&size=${unapprovedPageSize}`;
    this.setState({ loading1: true });
    httpFetch.get(unapprovedUrl).then((res) => {
      if (res.status === 200) {
        this.setState({
          unapprovedData: res.data || [],
          loading1: false,
          unapprovedPagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: unapprovedPage + 1,
            onChange: this.onUnapprovedChangePaper
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ loading1: false });
      reject()
    })
  };

  //获取审批列表
  getApprovedList = (resolve, reject) => {
    const { approvedPage, approvedPageSize } = this.state;
    let approvedUrl = `${config.contractUrl}/contract/api/contract/header/confirmEd/query?page=${approvedPage}&size=${approvedPageSize}`;
    this.setState({ loading2: true });
    httpFetch.get(approvedUrl).then((res) => {
      if (res.status === 200) {
        this.setState({
          approvedData: res.data || [],
          loading2: false,
          approvedPagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: approvedPage + 1,
            onChange: this.onApprovedChangePaper
          }
        });
        resolve()
      }
    }).catch(() => {
      this.setState({ loading2: false });
      reject()
    })
  };

  //未审批点击页码
  onUnapprovedChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ unapprovedPage: page - 1 }, () => {
        this.getUnapprovedList()
      })
    }
  };

  //审批点击页码
  onApprovedChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ approvedPage: page - 1 }, () => {
        this.getApprovedList()
      })
    }
  };

  //未审批搜索
  unapprovedSearch = (values) => {
    console.log(values)
  };

  //审批搜索
  approvedSearch = (values) => {
    console.log(values)
  };

  //进入合同详情页
  handleRowClick = (record) => {
    this.context.router.push(this.state.ContractDetail.url.replace(':id', record.id))
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
                   onRow={record => ({
                     onClick: () => this.handleRowClick(record)
                   })}
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
                   onRow={record => ({
                     onClick: () => this.handleRowClick(record)
                   })}
                   bordered
                   size="middle"/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

Contract.contextTypes = {
  router: React.PropTypes.object
};

const wrappedContract = Form.create()(injectIntl(Contract));

export default wrappedContract


