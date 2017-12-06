/**
 * created by zk on 2017/11/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table, Badge, notification, Popover, Popconfirm ,message } from 'antd';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/pay-setting/cash-transaction-class/cash-transaction-class.scss'

class CashTransactionClass extends React.Component{
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: formatMessage({id:"cash.transaction.class.type"}), dataIndex: 'typeName'},  //现金事务类型
        {title: formatMessage({id:"cash.transaction.class.code"}), dataIndex: 'classCode'}, //现金事务代码
        {title: formatMessage({id:"cash.transaction.class.description"}), dataIndex: 'description'},  //现金事务名称
        {title: formatMessage({id:"common.column.status"}), dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )}, //状态
      ],
      pagination: {
        total: 0
      },
      cashTransactionClassDetailPage: menuRoute.getRouteItem('cash-transaction-class-detail','key'),    //组织定义详情的页面项
      newCashTransactionClass:  menuRoute.getRouteItem('new-cash-transaction-class','key'),    //新建现金事务的页面项
      searchParams: {
        setOfBookId: "",
        typeCode: "",
        classCode: "",
        description: "",
      },
      searchForm: [
        // {type: 'select', id: 'setOfBookId', label: `* ${this.props.intl.formatMessage({id:"budget.set.of.books"})}`, options: [],
        //   getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksName', valueKey: 'id', getParams: {roleType: 'TENANT'}}, //账套
        {type: 'input',disabled: true, id: 'setOfBookId', defaultValue:this.props.company.setOfBooksName, label: `${this.props.intl.formatMessage({id:"budget.set.of.books"})}`,},
        {type: 'input', id: 'typeCode', label: formatMessage({id: 'cash.transaction.class.type'}) }, /*现金事务类型代码*/
        {type: 'input', id: 'classCode', label: formatMessage({id: 'cash.transaction.class.code'}) }, /*现金事务分类代码*/
        {type: 'input', id: 'description', label: formatMessage({id: 'cash.transaction.class.description'}) } /*现金事务分类名称*/
      ],
      nowClass: {},
      showSlideFrame: false
    };
  }

  componentWillMount(){
    this.getList();
  }

  editItem = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      nowClass: record,
      showSlideFrame: true
    })
  };

  //得到列表数据
  getList(){
    this.setState({ loading: true });
    let params = this.state.searchParams;
    let url = `${config.payUrl}/api/cash/transaction/classes/query?&page=${this.state.page}&size=${this.state.pageSize}`;
    for(let paramsName in params){
      if(paramsName == "setOfBookId"){
        url += `&${paramsName}=${this.props.company.setOfBooksId}`;
      }else{
        url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
      }
    }
    return httpFetch.get(url).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id;
      });
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
    this.context.router.push(this.state.cashTransactionClassDetailPage.url.replace(':classId', record.id));
  };

  search = (result) => {
    this.setState({
      page: 0,
      searchParams: {
        setOfBookId: result.setOfBookId ? result.setOfBookId : '',
        typeCode: result.typeCode ? result.typeCode : '',
        classCode: result.classCode ? result.classCode : '',
        description: result.description ? result.description : ''
      }
    }, ()=>{
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        setOfBookId: "",
        typeCode: "",
        classCode: "",
        description: "",
      }
    })
  };

  searchEventHandle = (event, value) => {
    console.log(event, value)
  };

  handleNew = () => {
    this.context.router.push(this.state.newCashTransactionClass.url);
  };

  handleCloseSlide = (success) => {
    success && this.getList();
    this.setState({showSlideFrame : false});
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading,data, searchForm, pagination, columns, showSlideFrame, nowClass } = this.state;

    return(
      <div className="cash-transaction-class">
        <h3 className="header-title">{formatMessage({id:"menu.cash-transaction-class"})}</h3> {/* 现金事务分类定义 */}
        <SearchArea searchForm={searchForm} submitHandle={this.search}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>{formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.onChangePager}
          columns={columns}
          onRow={record => ({
            onClick: () => this.handleRowClick(record)
          })}
          size="middle"
          bordered/>
        {/*<SlideFrame title={slideFrameTitle}*/}
                    {/*show={showSlideFrame}*/}
                    {/*content={CreateOrUpdateItem}*/}
                    {/*afterClose={this.handleCloseSlide}*/}
                    {/*onClose={() => this.setState({showSlideFrame : false})}*/}
                    {/*params={nowItem}/>*/}
      </div>
    )
  }

}

CashTransactionClass.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

export default connect(mapStateToProps)(injectIntl(CashTransactionClass));
