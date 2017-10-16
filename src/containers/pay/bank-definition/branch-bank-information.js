/**
 * created by jsq on 2017/10/10
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table, Badge, notification, Popover  } from 'antd';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SlideFrame from 'components/slide-frame'
import CreateOrUpdateBranchBank from 'containers/pay/bank-definition/createOrUpdate-branch-bank'
import 'styles/pay/bank-definition/branch-bank-information.scss'

class BranchBankInformation extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      showSlideFrame: false,
      slideFrameTitle: "",
      slideFrameParams: {},
      belongsBank: {},
      branchBank: {},
      searchParams: {
        bankBranchCode: "",
        bankBranchName: "",
        country: "",
        address:""
      },
      newParams: {},
      searchForm: [
        {type: 'input', id: 'bankBranchCode', label: formatMessage({id: 'budget.branchBankCode'}) }, /*分行代码*/
        {type: 'input', id: 'bankBranchName', label: formatMessage({id: 'budget.branchBankName'}) }, /*分行名称*/
        {type: 'select', options: [], id: 'country', label: "国家"},  /*银行类型*/
        {type: 'select', options: [], id: 'address', label: "地址"}  /*银行类型*/
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
        {          /*所属银行*/
          title: formatMessage({id:"budget.belongsToBank"}), key: "bankDigitalCode", dataIndex: 'bankDigitalCode'
        },
        {          /*分行行号*/
          title: formatMessage({id:"budget.branchBankNumber"}), key: "branchBankNumber", dataIndex: 'branchBankNumber'
        },
        {          /*国家*/
          title: "国家", key: "country", dataIndex: 'country'
        },
        {          /*城市*/
          title: "地址", key: "city", dataIndex: 'address'
        },
        {          /*分行名称*/
          title: formatMessage({id:"budget.branchBankName"}), key: "branchBankName", dataIndex: 'branchBankName'
        },
        {          /*状态*/
          title: formatMessage({id:"common.column.status"}), key: "status", dataIndex: 'status'
        }
      ]
    }
  }

  componentWillMount(){
    //根据路径上的id查出完整的银行数据
    httpFetch.get(`${config.payUrl}/api/cash/banks/${this.props.params.id}`).then((response)=>{
      if(response.status === 200){
        console.log(response)
        this.setState({
          belongsBank: response.data
        }, ()=>{
          this.getList();
        })
      }
    });
  }

  handleSearch = (values) => {
    let searchParams = {
      bankBranchCode: values.bankBranchCode,
      bankBranchName: values.bankBranchName,
      country: values.country,
      address: values.address
    };
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 1
    }, ()=>{
      this.getList();
    })
  };

  //获取分行信息
  getList(){
    console.log(this.state.belongsBank)

    let params = this.state.searchParams;
    let url = `${config.payUrl}/api/cash/bank/branches/query?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}&bankCode=${this.state.belongsBank.bankCode}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      if(response.status === 200){
        console.log(response)
        response.data.map((item)=>{
          item.key = item.id;
        });
        this.setState({
          loading: false,
          data: [1],
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

  handleCreate = ()=>{
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: "新建分行",
      slideFrameParams: {
        key: "create",
        value: this.state.belongsBank
      }
    });
  };

  //点击行，银行分行编辑页面
  handleRowClick = (record, index, event) =>{
    this.setState({
      slideFrameTitle: "编辑分行",
      showSlideFrame: true,
      slideFrameParams: {
        key: "update",
        value: record
      }
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

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };



  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination, columns, slideFrameTitle, showSlideFrame, slideFrameParams, belongsBank, data, branchBank } = this.state;

    return(
      <div className="branch-bank-information">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.onChangePager}
          columns={columns}
          onRowClick={this.handleRowClick}
          size="middle"
          bordered/>
        <SlideFrame title={slideFrameTitle}
                    show={showSlideFrame}
                    content={CreateOrUpdateBranchBank}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={slideFrameParams}/>
      </div>
    )
  }
}

BranchBankInformation.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    company: state.login.company
  }
}

export default connect(mapStateToProps)(injectIntl(BranchBankInformation));
