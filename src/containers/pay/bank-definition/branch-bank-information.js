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
    console.log(1234)
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      slideFrameTitle: "",
      belongsBank: {},
      searchParams: {
        bankCode: "",
        bankName: "",
        bankType: ""
      },
      newParams: {},
      searchForm: [
        {type: 'input', id: 'branchBankCode', label: formatMessage({id: 'budget.branchBankCode'}) }, /*分行代码*/
        {type: 'input', id: 'bankName', label: formatMessage({id: 'budget.bankName'}) }, /*分行名称*/
        {type: 'select', options: [], id: 'country', label: "国家"},  /*银行类型*/
        {type: 'select', options: [], id: 'city', label: "市名称"}  /*银行类型*/
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
          title: "市", key: "city", dataIndex: 'city'
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

  handleSearch = (values) => {
    console.log(this.props.company)
    console.log(values)
  };

  handleCreate = ()=>{
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: "新建分行",
      nowBank: {}
    });
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
    const { loading, searchForm, pagination, columns, slideFrameTitle, showSlideFrame, belongsBank } = this.state;

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
          loading={loading}
          columns={columns}/>
        <SlideFrame title={slideFrameTitle}
                    show={showSlideFrame}
                    content={CreateOrUpdateBranchBank}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={belongsBank}/>
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
