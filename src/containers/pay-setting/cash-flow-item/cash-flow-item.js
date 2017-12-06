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
import 'styles/pay/cash-flow-item/cash-flow-item.scss'
import SlideFrame from 'components/slide-frame'
import CreateOrUpdateItem from 'containers/pay/cash-flow-item/createOrUpdate-item'

class CashFlowItem extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      showSlideFrame: false,
      nowItem:{},
      slideFrameTitle: "",
      searchParams: {
        setOfBookId: "",
        flowCode: "",
        description: ""
      },
      newParams: {},
      searchForm: [
        // {type: 'select', id: 'setOfBookId', label: `* ${this.props.intl.formatMessage({id:"budget.set.of.books"})}`, options: [],
        //   getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksName', valueKey: 'id', getParams: {roleType: 'TENANT'}}, //账套
        {type: 'input',disabled: true, id: 'setOfBookId', defaultValue:this.props.company.setOfBooksName, label: `${this.props.intl.formatMessage({id:"budget.set.of.books"})}`,},
        {type: 'input', id: 'flowCode', label: formatMessage({id: 'cash.flow.item.flowCode'}) }, /*现金流量项代码*/
        {type: 'input', id: 'description', label: formatMessage({id: 'cash.flow.item.description'}) } /*现金流量项名称*/
      ],
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      columns: [
        {          /*现金流量项代码*/
          title: formatMessage({id:"cash.flow.item.flowCode"}), key: "flowCode", dataIndex: 'flowCode'
        },
        {          /*现金流量项名称*/
          title: formatMessage({id:"cash.flow.item.description"}), key: "description", dataIndex: 'description'
        },
        {title: formatMessage({id:"common.column.status"}), dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )}, //状态
      ]
    }
  }

  componentWillMount(){
    this.getList();
  }

  handleCreate = ()=>{
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: this.props.intl.formatMessage({id:"cash.flow.item.createItem"}),  //新建现金流量项
      nowItem: {item:{}}
    });
  };

  //获取账套下的数据
  getList(){
    this.setState({ loading: true });
    let params = this.state.searchParams;
    let url = `${config.payUrl}/api/cash/flow/items/query?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      if(paramsName == "setOfBookId"){
        url += `&${paramsName}=${this.props.company.setOfBooksId}`;
      }else{
        url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
      }
    }
    httpFetch.get(url).then((response)=>{
      if(response.status === 200){
        console.log(response);
        response.data.map((item)=>{
          item.key = item.id;
        });
        this.setState({
          loading: false,
          data: response.data,
          pagination: {
            total: Number(response.headers['x-total-count']),
            current: this.state.pagination.current,
            page: this.state.pagination.page,
            pageSize:this.state.pagination.pageSize,
            showSizeChanger:true,
            showQuickJumper:true,
          },
        });
      }
    })
  }

  handleSearch = (values) =>{
    console.log(values);
    let searchParams = {
      setOfBookId: values.setOfBookId,
      flowCode: values.flowCode,
      description: values.description
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 1
    }, ()=>{
      this.getList();
    })
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    console.log(pagination)
    this.setState({
      pagination:{
        current: pagination.current,
        page: pagination.current-1,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    }, ()=>{

      this.getList();
    })
  };

  handleRowClick = (record) => {
    this.setState({
      nowItem: {item: record},
      showSlideFrame: true,
      slideFrameTitle: this.props.intl.formatMessage({id:"cash.flow.item.editorItem"}), /*编辑现金流量项*/
    });
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading,data, searchForm, pagination, columns, showSlideFrame, nowItem, slideFrameTitle } = this.state;

    return(
      <div className="cash-flow-item">
        <h3 className="header-title">{formatMessage({id:"menu.cash-flow-item"})}</h3> {/* 现金流量项 */}
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
            dataSource={data}
            loading={false}
            pagination={pagination}
            onChange={this.onChangePager}
            columns={columns}
            onRowClick={this.handleRowClick}
            size="middle"
            bordered/>
        <SlideFrame title={slideFrameTitle}
                    show={showSlideFrame}
                    content={CreateOrUpdateItem}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={nowItem}/>
      </div>
    )
  }
}

CashFlowItem.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

export default connect(mapStateToProps)(injectIntl(CashFlowItem));
