import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Button, Table, message, Badge } from 'antd'
import config from 'config'
import menuRoute from 'share/menuRoute'
import contractService from 'service/contractService'

import moment from 'moment'
import SearchArea from 'components/search-area'

class MyContract extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
      searchForm: [
        {type: 'input', id: 'contractNumber', label: '合同编号'},
        {type: 'input', id: 'contractName', label: '合同名称'},
        {type: 'items', id: 'amountRange', items: [
          {type: 'input', id: 'amountFrom', label: '合同金额从'},
          {type: 'input', id: 'amountTo', label: '合同金额至'}
        ]},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'signDateFrom', label: '签署日期从'},
          {type: 'date', id: 'signDateTo', label: '签署日期至'}
        ]},
        {type: 'select', id: 'companyId', label: '公司', getUrl: `${config.baseUrl}/api/company/by/condition?setOfBooksId=${this.props.company.setOfBooksId}`,
          method: 'get', valueKey: 'id', labelKey: 'name', options: [], event: 'id'},
        {type: 'list', id: 'contractTypeId', label: '合同类型', single: true, labelKey: 'contractTypeName', valueKey: 'id', listType: 'contract_type', disabled: true},
        {type: 'value_list', id: 'partnerCategory', label: '合同方类型', valueListCode: 2107, options: [], event: 'code'},
        {type: 'select', id: 'partnerId', label: '合同方', options: [], method: 'get', disabled: true},
        {type: 'value_list', id: 'status', label: '合同状态', valueListCode: 2201, options: []},
      ],
      searchParams: {},
      columns: [
        {title: '合同编号', dataIndex: 'contractNumber'},
        {title: '公司', dataIndex: 'companyName'},
        {title: '合同类型', dataIndex: 'contractTypeName'},
        {title: '合同名称', dataIndex: 'contractName'},
        {title: '签署日期', dataIndex: 'signDate', render: (value) => moment(value).format('YYYY-MM-DD')},
        {title: '合同方类型', dataIndex: 'partnerCategoryName'},
        {title: '合同方', dataIndex: 'partnerName'},
        {title: '币种', dataIndex: 'currency'},
        {title: '合同金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '状态', dataIndex: 'status',
          render: value => <Badge status={this.state.contractStatus[value].state} text={this.state.contractStatus[value].label} />}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      NewContract: menuRoute.getRouteItem('new-contract', 'key'), //新建合同
      ContractDetail: menuRoute.getRouteItem('contract-detail', 'key'), //合同详情
    }
  }

  componentWillMount() {
    this.getList()
  }

  getList = () => {
    const { page, pageSize, searchParams } = this.state;
    this.setState({ loading: true });
    contractService.getContractList(page, pageSize, searchParams).then((res) => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          data: res.data || [],
          pagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: page + 1,
            onChange: this.onChangePaper
          }
        })
      }
    }).catch(() => {
      this.setState({ loading: false });
      message.error('数据加载失败，请重试')
    })
  };

  onChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ page: page - 1 }, () => {
        this.getList()
      })
    }
  };

  //搜索
  search = (values) => {
    values.signDateFrom && (values.signDateFrom = moment(values.signDateFrom).format('YYYY-MM-DD'));
    values.signDateTo && (values.signDateTo = moment(values.signDateTo).format('YYYY-MM-DD'));
    this.setState({ searchParams: values },() => {
      this.getList()
    })
  };

  clear = () => {
    this.eventHandle('id', null);
    this.eventHandle('code', null)
  };

  //新建
  handleNew = () => {
    this.context.router.push(this.state.NewContract.url)
  };

  //合同详情
  rowClick = (record) => {
    this.context.router.push(this.state.ContractDetail.url.replace(':id', record.id))
  };

  eventHandle = (type, value) => {
    let searchForm = this.state.searchForm;
    if (type === 'id') {  //合同类型
      this.formRef._reactInternalInstance._renderedComponent._instance.setValues({
        contractTypeId: undefined
      });
      searchForm.map(item => {
        if (item.id === 'contractTypeId') {
          if (value) {
            item.listExtraParams = {companyId: value};
            item.disabled = false
          } else {
            item.disabled = true
          }
        }
      })
    } else if (type === 'code') { //合作方
      this.formRef._reactInternalInstance._renderedComponent._instance.setValues({
        partnerId: ''
      });
      searchForm.map(item => {
        if (item.id === 'partnerId') {
          if (value === 'EMPLOYEE') {
            item.getUrl = `${config.baseUrl}/api/users/v2/search`;
            item.valueKey = 'id';
            item.options = [];
            item.renderOption = (option) => `${option.fullName} - ${option.employeeID}`;
            item.disabled = false
          } else if (value === 'VENDER') {
            //TODO: 合同方类型为供应商时，查询合同方列表的接口
            item.getUrl = ``;
            item.valueKey = '';
            item.options = [];
            item.disabled = false
          } else {
            item.disabled = true
          }
        }
      })
    }
    this.setState({ searchForm })
  };

  render() {
    const { loading, searchForm, columns, data, pagination } = this.state;
    return (
      <div className="my-contract">
        <SearchArea searchForm={searchForm}
                    eventHandle={this.eventHandle}
                    submitHandle={this.search}
                    clearHandle={this.clear}
                    wrappedComponentRef={(inst) => this.formRef = inst}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
        </div>
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={data}
               padination={pagination}
               loading={loading}
               scroll={{x: true, y: false}}
               onRow={record => ({
                 onClick: () => this.rowClick(record)
               })}
               bordered
               size="middle"/>
      </div>
    )
  }
}

MyContract.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}

const wrappedMyContract = Form.create()(injectIntl(MyContract));

export default connect(mapStateToProps)(wrappedMyContract)
