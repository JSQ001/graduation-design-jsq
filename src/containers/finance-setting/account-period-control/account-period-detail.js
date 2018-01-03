import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Badge, Row, Col, message, Pagination } from 'antd'

import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'
import config from 'config'
import moment from 'moment';

class AccountPeriodDetail extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      periodInfo: {},
      periodInfoList: [
        {label: formatMessage({id: 'account.period.control.periodSetCode'}), id: 'periodSetCode'}, //会计期代码
        {label: formatMessage({id: 'account.period.control.detail.periodSetName'}), id: 'periodSetName'}, //会计期名称
        {label: formatMessage({id: 'account.period.control.detail.totalPeriodNum'}), id: 'totalPeriodNum'}, //期间总数
        {label: formatMessage({id: 'account.period.control.sobCode'}), id: 'setOfBooksCode'}, //账套代码
        {label: formatMessage({id: 'account.period.control.sobName'}), id: 'setOfBooksName'} //账套名称
      ],
      columns: [
        {title: formatMessage({id: 'account.period.control.detail.column.year'}), key: 'periodYear', dataIndex: 'periodYear'}, //年
        {title: formatMessage({id: 'common.sequence'}), key: 'periodNum', dataIndex: 'periodNum'},  //序号
        {title: formatMessage({id: 'account.period.control.detail.column.date-from'}), key: 'startDate', dataIndex: 'startDate',
          render: date => moment(date).format('YYYY-MM-DD')},  //日期从
        {title: formatMessage({id: 'account.period.control.detail.column.date-to'}), key: 'endDate', dataIndex: 'endDate',
          render: date => moment(date).format('YYYY-MM-DD')},  //日期至
        {title: formatMessage({id: 'account.period.control.detail.column.quarter'}), key: 'quarterNum', dataIndex: 'quarterNum'},  //季度
        {title: formatMessage({id: 'account.period.control.detail.column.period'}), key: 'periodName', dataIndex: 'periodName'},  //期间
        {title: formatMessage({id: 'account.period.control.detail.column.period-status'}), key: 'periodStatusCode', dataIndex: 'periodStatusCode',
          render: code => <Badge status={code==='O' ? 'success' : 'error'} text={code==='N' ? '未打开' : (code==='O' ? '已打开' : '已关闭')}/>},  //期间状态
        {title: formatMessage({id: 'common.operation'}), key: 'id', dataIndex: 'id',
          render: (periodId, record) =>
            <a onClick={() => {this.operaPeriodStatus(periodId, record.periodSetId, record.periodStatusCode)}}>
              {record.periodStatusCode === 'O' ? '关闭期间' : '打开期间'}
            </a>},  //操作
      ],
      dataClose: [],
      dataOpen: [],
      pageClose: 0,
      pageOpen: 0,
      pageSizeClose: 5,
      pageSizeOpen: 5,
      paginationClose: {
        total: 0
      },
      paginationOpen: {
        total: 0
      },
      loadingClose: false,
      loadingOpen: false,
    };
  }

  componentWillMount() {
    this.getPeriodInfo();
    this.getClosedList();
    this.getOpenList();
  }

  getPeriodInfo = () => {
    let url = `${config.baseUrl}/api/setOfBooks/query/head/dto?periodSetId=${this.props.params.periodSetId}&setOfBooksId=${this.props.params.setOfBooksId}`;
    httpFetch.get(url).then((res) => {
      this.setState({ periodInfo: res.data })
    }).catch((e) => {
      console.log(e)
    })
  };

  getClosedList = () => {
    this.setState({ loadingClose: true });
    let url = `${config.baseUrl}/api/periods/query/close?periodSetId=${this.props.params.periodSetId}&setOfBooksId=${this.props.params.setOfBooksId}&page=${this.state.pageClose}&size=${this.state.pageSizeClose}`;
    httpFetch.get(url).then((res) => {
      this.setState({
        dataClose: res.data,
        loadingClose: false,
        paginationClose: {
          total: Number(res.headers['x-total-count']),
          onChange: this.onChangeClosePage,
          pageSize: this.state.pageSizeClose
        }
      })
    }).catch((e) => {
      console.log(e)
    })
  };

  getOpenList = () => {
    this.setState({ loadingOpen: true });
    let url = `${config.baseUrl}/api/periods/query/open?periodSetId=${this.props.params.periodSetId}&setOfBooksId=${this.props.params.setOfBooksId}&page=${this.state.pageOpen}&size=${this.state.pageSizeOpen}`;
    httpFetch.get(url).then((res) => {
      this.setState({
        dataOpen: res.data,
        loadingOpen: false,
        paginationOpen: {
          total: Number(res.headers['x-total-count']),
          onChange: this.onChangeOpenPage,
          pageSize: this.state.pageSizeOpen
        }
      })
    }).catch((e) => {
      console.log(e)
    })
  };

  //点击未打开状态的页码
  onChangeClosePage = (page) => {
    if(page - 1 !== this.state.pageClose) {
      this.setState({
        pageClose: page - 1,
        loadingClose: true
      }, () => {
        this.getClosedList();
      })
    }
  };

  //点击已打开状态的页码
  onChangeOpenPage = (page) => {
    if(page - 1 !== this.state.pageOpen) {
      this.setState({
        pageOpen: page - 1,
        loadingOpen: true
      }, () => {
        this.getOpenList();
      })
    }
  };

  //修改未打开状态每页显示的数量
  onShowCloseSizeChange = (current, pageSize) => {
    this.setState({
      pageClose: current - 1,
      pageSizeClose: pageSize
    },()=>{
      this.getClosedList()
    })
  };

  //修改已打开状态每页显示的数量
  onShowOpenSizeChange = (current, pageSize) => {
    this.setState({
      pageOpen: current - 1,
      pageSizeOpen: pageSize
    },()=>{
      this.getOpenList()
    })
  };

  //修改期间状态：打开 <=> 关闭
  operaPeriodStatus = (periodId, periodSetId, status) => {
    let url = `${config.baseUrl}/api/periods/${status === 'O' ? 'close' : 'open'}/periods?periodId=${periodId}&periodSetId=${periodSetId}&setOfBooksId=${this.props.params.setOfBooksId}`;
    httpFetch.post(url).then((res) => {
      if (res.status === 200) {
        this.getClosedList();
        this.getOpenList();
        message.success(this.props.intl.formatMessage({id: 'common.operate.success'})/* 操作成功 */)
      }
    }).catch((e) => {
      if (e.response) {
        message.error(`${this.props.intl.formatMessage({id: 'common.operate.filed'})/* 操作失败 */}，${e.response.data.message}`)
      } else {
        console.log(e)
      }
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { periodInfo, periodInfoList, columns, dataClose, dataOpen, paginationClose, paginationOpen, loadingClose, loadingOpen, pageSizeClose, pageSizeOpen } = this.state;
    let periodRow = [];
    let periodCol = [];
    periodInfoList.map((item, index) => {
      periodCol.push(
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.label}:</div>
          <div style={{wordWrap:'break-word'}}>{periodInfo[item.id]}</div>
        </Col>
      );
      if (index === 2) {
        periodRow.push(
          <Row style={{background:'#f7f7f7',padding:'20px 25px 0',borderRadius:'6px'}} key="1">
            {periodCol}
          </Row>
        );
        periodCol = [];
      }
      if (index === 4) {
        periodRow.push(
          <Row style={{background:'#f7f7f7',padding:'0 25px 5px',borderRadius:'6px'}} key="2">
            {periodCol}
          </Row>
        );
      }
    });
    return (
      <div className="account-period-detail">
        <h3 className="header-title">{formatMessage({id: 'account.period.control.detail.title'})/* 账套期间信息 */}</h3>
        {periodRow}
        <h3 className="header-title" style={{margin:'24px 0 10px'}}>{formatMessage({id: 'account.period.control.detail.title.close'})/* 会计期间-未打开 */}</h3>
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={dataClose}
               pagination={false}
               loading={loadingClose}
               bordered
               size="middle" />
        <Pagination size="small"
                    showSizeChanger
                    onShowSizeChange={this.onShowCloseSizeChange}
                    defaultPageSize={pageSizeClose}
                    pageSizeOptions={['5','10','20','30','50']}
                    style={{float:'right',margin:'10px 0'}}
                    onChange={this.onChangeClosePage}
                    total={paginationClose.total} />
        <h3 className="header-title" style={{margin:'40px 0 10px'}}>{formatMessage({id: 'account.period.control.detail.title.open'})/* 会计期间-已打开 */}</h3>
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={dataOpen}
               pagination={false}
               loading={loadingOpen}
               bordered
               size="middle" />
        <Pagination size="small"
                    showSizeChanger
                    onShowSizeChange={this.onShowOpenSizeChange}
                    defaultPageSize={pageSizeOpen}
                    pageSizeOptions={['5','10','20','30','50']}
                    style={{float:'right',margin:'10px 0 50px'}}
                    onChange={this.onChangeOpenPage}
                    total={paginationOpen.total} />
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedAccountPeriodDetail = Form.create()(AccountPeriodDetail);

export default connect(mapStateToProps)(injectIntl(WrappedAccountPeriodDetail));
