/**
 * Created by 13576 on 2017/12/4.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import {connect} from 'react-redux'
import { Form, Button, Table, message, Badge } from 'antd'
import config from 'config'
import ListSelector from 'components/list-selector'
import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'


import moment from 'moment'
import SearchArea from 'components/search-area'

class MyPrePayment extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible:false,
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
        {type: 'input', id: 'requisitionNumber', label: '单据编号'},
        {type: 'input', id: 'paymentReqTypeId', label: '预付款单类型'},
        {type: 'value_list', id: 'status', label: '状态', valueListCode: 2201, options: []},
        {type: 'items', id: 'timestamp', items: [
          {type: 'date', id: 'timestampFrom', label: '签订日期从'},
          {type: 'date', id: 'timestampTo', label: '签订日期至'}
        ]},
        {type: 'items', id: 'price', items: [
          {type: 'input', id: 'amountFrom', label: '金额从'},
          {type: 'input', id: 'amountTo', label: '今额至'}
        ]},
        {type: 'input', id: 'employeeId', label: '申请人'},

      ],
      columns: [
        {title: '序号', dataIndex: 'id', render: (value, record, index) => index + 1},
        {title: '单据编号', dataIndex: 'requisitionNumber'},
        {title:'单据类型',dataIndex:'typeName'},
        {title: '申请人', dataIndex: 'employeeId'},
        {title: '申请日期', dataIndex: 'timestamp', render: (value) => moment(value).format('YYYY-MM-DD')},
        {title: '币种', dataIndex: 'currency'},
        {title: '金额', dataIndex: 'amount', render: this.filterMoney},
        {title:'已核销金额',dataIndex: 'pppamount', render: this.filterMoney},
        {title:'说明',dataIndex:'description'},
        {title: '状态', dataIndex: 'statusName'}
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
    // let url = `${config.baseUrl}/api/setOfBooks/query/dto`;
    // httpFetch.get(url).then((res) => {
    //   if (res.status === 200) {
    //     this.setState({ setOfBooksId: res.data[0].setOfBooksId }, () => {
    //       this.getList();
    //       httpFetch.get(`${config.baseUrl}/api/company/by/condition?setOfBooksId=${this.state.setOfBooksId}`).then((res) => {  //公司
    //         // let currencyOptions = res.data;
    //         // this.setState({ currencyOptions })
    //       })
    //     })
    //   }
    // })

    httpFetch.get("http://rjfin.haasgz.hand-china.com:30498/contract/api/contract/line/associate/query?companyId=138&partnerCategory=EMPLOYEE&partnerId=911143733222408193").then(res => {
      console.log(res.data);
    })
    this.getList();
  }

  getList = () => {
    const { page, pageSize } = this.state;
    let url = `http://192.168.1.195:8072/api/cash/prepayment/requisitionHead/query?page=${page}&size=${pageSize}`;
    this.setState({ loading: true });
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          data: res.data,
          pagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: page + 1,
            onChange: this.onChangePaper,
            pageSize: pageSize,
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

  handleListOk=(value)=>{
    console.log(value);
    const result = value.result;
    this.context.router.push(this.state.NewPayRequisition.url.replace(':id',0).replace(':prePaymentTypeId',(result[0].id)));
   // this.context.router.push(this.state.NewPayRequisition.url.replace(':id',0).replace(':prePaymentTypeId',123))
      this.showListSelector(false);
  }

  showListSelector =(value)=>{
    console.log(value);
    this.setState({
      visible:value,
    })
  }

  //搜索
  search = (result) => {
    console.log(result)
  };

  //新建
  handleNew = () => {

  };

  //合同详情
  rowClick = (record) => {
    this.context.router.push(this.state.PayRequisitionDetail.url.replace(':id', record.id));
  };

  render() {
    const { visible,loading, searchForm, columns, data, pagination } = this.state;
    return (
      <div className="my-contract">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.showListSelector(true)}>新 建</Button>
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
        <ListSelector type="pre_payment_type"
                      visible={visible}
                      single={true}
                      onOk={this.handleListOk}
                      extraParams={{"setOfBookId":this.props.company.setOfBooksId}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>
    )
  }
}

MyPrePayment.contextTypes = {
  router: React.PropTypes.object
};

const wrappedMyPrePayment = Form.create()(injectIntl(MyPrePayment));

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company,
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(wrappedMyPrePayment));
