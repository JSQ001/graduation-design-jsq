/**
 * Created by 13576 on 2017/12/4.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Button, Table, message, Badge } from 'antd'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'

import moment from 'moment'
import SearchArea from 'components/search-area'

class MyPrePayment extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      setOfBooksId: null,
      contractStatus: {
        CANCEL: {label: '取消', state: ''},
        CONFIRM: {label: '确认', state: ''},
        FINISH: {label: '完成', state: ''},
        GENERATE: {label: '新建', state: ''},
        HOLD: {label: '暂挂', state: ''},
        REJECTED: {label: '拒绝', state: ''},
        SUBMITTED: {label: '提交', state: ''},
      },
      searchForm: [
        {type: 'input', id: 'contractNumber', label: '单据编号'},
        {type: 'input', id: 'contractName', label: '单据类型'},
        {type: 'value_list', id: 'status', label: '状态', valueListCode: 2201, options: []},
        {type: 'items', id: 'signDate', items: [
          {type: 'date', id: 'signDateStart', label: '签订日期从'},
          {type: 'date', id: 'signDateEnd', label: '签订日期至'}
        ]},
        {type: 'items', id: 'price', items: [
          {type: 'input', id: 'amountBegin', label: '申请日期从'},
          {type: 'input', id: 'amountEnd', label: '申请日期至'}
        ]},
        {type: 'input', id: 'employeeId', label: '申请人'},

      ],
      columns: [
        {title: '序号', dataIndex: 'id', render: (value, record, index) => index + 1},
        {title: '单据编号', dataIndex: 'contractNumber'},
        {title:'单据类型',dataIndex:'type'},
        {title: '申请人', dataIndex: 'employeeId'},
        {title: '申请日期', dataIndex: 'signDate', render: (value) => moment(value).format('YYYY-MM-DD')},
        {title: '币种', dataIndex: 'currency'},
        {title: '金额', dataIndex: 'amount', render: this.filterMoney},
        {title:'已核销金额',dataIndex: 'pppamount', render: this.filterMoney},
        {title:'说明',dataIndex:'description'},
        {title: '状态', dataIndex: 'status', render: value => <Badge status="processing" text={this.state.contractStatus[value].label} />}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      NewPayRequisition: menuRoute.getRouteItem('new-pre-payment', 'key'), //新建预付款
      PayRequisitionDetail: menuRoute.getRouteItem('pre-payment-detail', 'key'), //预付款详情
    }
  }

  componentWillMount() {
    let url = `${config.baseUrl}/api/setOfBooks/query/dto`;
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({ setOfBooksId: res.data[0].setOfBooksId }, () => {
          this.getList();
          httpFetch.get(`${config.baseUrl}/api/company/by/condition?setOfBooksId=${this.state.setOfBooksId}`).then((res) => {  //公司
            // let currencyOptions = res.data;
            // this.setState({ currencyOptions })
          })
        })
      }
    })
  }

  getList = () => {
    const { page, pageSize } = this.state;
    let url = `${config.contractUrl}/contract/api/contract/header/update/query?page=${page}&size=${pageSize}`;
    this.setState({ loading: true });
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          data: res.data,
          pagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: page + 1,
            onChange: this.onChangePaper
          }
        })
      }
    }).catch(() => {
      this.setState({ loading: false });
      message.error('数据加载失败请重试')
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
  search = (result) => {
    console.log(result)
  };

  //新建
  handleNew = () => {
    this.context.router.push(this.state.NewPayRequisition.url.replace(':id',0))
  };

  //合同详情
  rowClick = (record) => {
    this.context.router.push(this.state.PayRequisitionDetail.url.replace(':id', record.id))
  };

  render() {
    const { loading, searchForm, columns, data, pagination } = this.state;
    return (
      <div className="my-contract">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}/>
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
               onRowClick={this.rowClick}
               bordered
               size="middle"/>
      </div>
    )
  }
}

MyPrePayment.contextTypes = {
  router: React.PropTypes.object
};

const wrappedMyPrePayment = Form.create()(injectIntl(MyPrePayment));

export default wrappedMyPrePayment
