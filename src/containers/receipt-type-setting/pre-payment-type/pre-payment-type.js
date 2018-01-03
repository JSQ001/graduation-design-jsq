import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import { Table, Badge, Button, Popover, message } from 'antd';
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'

import NewPrePaymentType from 'containers/receipt-type-setting/pre-payment-type/new-pre-payment-type'
import SlideFrame from 'components/slide-frame'
import SearchArea from 'components/search-area'

class PrePaymentType extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '预付款单类型代码', dataIndex: 'typeCode', width: '20%'},
        {title: '预付款单类型名称', dataIndex: 'typeName', width: '20%',
          render: typeName => (
            <Popover content={typeName}>
              {typeName}
            </Popover>)
        },
        {title: '付款方式', dataIndex: 'paymentMethodCategoryName', width: '10%'},
        {title: '帐套', dataIndex: 'setOfBookName', width: '20%'},
        {title: formatMessage({id:"common.column.status"}), dataIndex: 'isEnabled', width: '15%',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )}, //状态
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <a style={{marginRight:10}} onClick={(e) => this.editItem(e, record)}>{formatMessage({id: "common.edit"})}</a>
            <a onClick={(e) => this.editItem(e, record)}>分配公司</a>
          </span>)},  //操作
      ],
      pagination: {
        total: 0
      },
      searchForm: [
        {type: 'select', id: 'setOfBookId', label: formatMessage({id:"budget.set.of.books"}), options: [],
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'id', getParams: {roleType: 'TENANT'}}, //账套
        {type: 'input', id: 'typeCode', label: '预付款单代码'},
        {type: 'input', id: 'typeName', label: '预付款单名称'}
      ],
      searchParams: {
        setOfBookId: this.props.company.setOfBooksId,
        typeCode: '',
        typeName: ''
      },
      showSlideFrame: false,
      nowType: {}
    };
  }

  componentWillMount(){
    this.getList();
  }

  editItem = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      nowType: record,
      showSlideFrame: true
    })
  };

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let params = this.state.searchParams;
    let url = `${config.prePaymentUrl}/api/cash/pay/requisition/types/query?&page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    return httpFetch.get(url).then((response)=>{
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']) ? Number(response.headers['x-total-count']) : 0,
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
    });
  }

  //分页点击
  onChangePager = (page) => {
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, () => {
        this.getList();
      })
  };

  handleRowClick = (record) => {

  };

  search = (result) => {
    this.setState({
      page: 0,
      searchParams: {
        setOfBookId: result.setOfBookId ? result.setOfBookId : this.props.company.setOfBooksId,
        typeCode: result.typeCode ? result.typeCode : '',
        typeName: result.typeName ? result.typeName : ''
      }
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        setOfBooksId: '',
        typeCode: '',
        typeName: ''
      }
    })
  };

  searchEventHandle = (event, value) => {
    console.log(event, value)
  };

  handleNew = () => {
    this.setState({ showSlideFrame: true, nowType: {} })
  };

  afterClose = (flag) => {
    flag && this.getList();
    this.setState({showSlideFrame: false})
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { columns, data, loading,  pagination, searchForm, showSlideFrame, nowType } = this.state;
    return (
      <div className="budget-organization">
        <h3 className="header-title">预付款类型定义</h3>
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>

        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total ? pagination.total : '0'})}</div> {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>{formatMessage({id:"common.create"})}</Button> {/* 新建 */}
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               rowKey="id"
               onRow={record => ({onClick: () => this.handleRowClick(record)})}
               size="middle"/>
        <SlideFrame content={NewPrePaymentType}
                    title="预付款类型"
                    show={showSlideFrame}
                    afterClose={this.afterClose}
                    onClose={() => {this.setState({ showSlideFrame: false })}}
                    params={{prePaymentType: nowType}}/>
      </div>
    )
  }

}

PrePaymentType.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}

export default connect(mapStateToProps)(injectIntl(PrePaymentType));
