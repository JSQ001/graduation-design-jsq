/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table, Badge, notification, Popover, Popconfirm  } from 'antd';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/budget/bank-definition/bank-definition.scss'
import SlideFrame from 'components/slide-frame'
import CreateOrUpdateBank from 'containers/budget/bank-definition/createOrUpdate-bank'

let bank = [
  {
    "id": 1001,
    "key": 1001,
    "bankDigitalCode": "1001",
    "bankLetterCode": "HSB",
    "bankName": "中国人民银行",
    "bankType": "现金银行",
    "isEnabled": true,
    "operation": "编辑 分行信息"
  }
]

class BankDefinition extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      showSlideFrame: false,
      nowBank:{},
      slideFrameTitle: "",
      searchParams: {
        bankCode: "",
        bankName: "",
        bankType: ""
      },
      newParams: {},
      searchForm: [
        {type: 'input', id: 'bankCode', label: formatMessage({id: 'budget.bankCode'}) }, /*银行代码*/
        {type: 'input', id: 'bankName', label: formatMessage({id: 'budget.bankName'}) }, /*银行名称*/
        {type: 'select', options: [], id: 'bankType', label: formatMessage({id: 'budget.bankType'})}  /*银行类型*/
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
        {          /*银行数字代码*/
          title: formatMessage({id:"budget.bank.digitalCode"}), key: "bankDigitalCode", dataIndex: 'bankDigitalCode'
        },
        {          /*银行字母代码*/
          title: formatMessage({id:"budget.bank.letterCode"}), key: "bankLetterCode", dataIndex: 'bankLetterCode'
        },
        {          /*银行名称*/
          title: formatMessage({id:"budget.bankName"}), key: "bankName", dataIndex: 'bankName'
        },
        {          /*银行类型*/
          title: formatMessage({id:"budget.bankType"}), key: "bankType", dataIndex: 'bankType'
        },
        {          /*状态*/
          title: formatMessage({id:"common.column.status"}), key: "isEnabled", dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)
        },
        {          /*操作*/
          title: formatMessage({id:"common.operation"}), key: "operation", dataIndex: 'operation',
          render: (text, record) => (
            <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>编辑</a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.goBranchBank(e, record)}>分行信息</a>
          </span>)
        },
      ]
    }
  }

  componentWillMount(){


  }

  editItem = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      nowBank: record,
      showSlideFrame: true,
      slideFrameTitle:"编辑银行"
    })
  };

  goBranchBank = (e, record) =>{
    console.log(record)
    this.context.router.push(menuRoute.getMenuItemByAttr('bank-definition', 'key').children.branchBankInformation.url.replace(':id', record.id));
  };

  handleCreate = ()=>{
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: "新建银行",
      nowBank: {}
    });
  };

  //获取公司下的银行数据
  getList(){
    let params = this.state.searchParams;
    let url = `http://139.224.220.217:9084/api/CompanyBank/selectByCompanyId?companyId=${this.props.company.companyOID}&page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      console.log(response)
    })
  }

  handleSearch = (values) =>{
    console.log(this.props.company)
    let searchParams = {
      bankName: values.bankName,
      bankCode: values.bankCode,
      bankType: values.bankType
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

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination, columns, showSlideFrame, nowBank, slideFrameTitle } = this.state;

    return(
      <div className="budget-bank-definition">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
            dataSource={bank}
            loading={false}
            columns={columns}/>
        <SlideFrame title={slideFrameTitle}
                    show={showSlideFrame}
                    content={CreateOrUpdateBank}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={nowBank}/>
      </div>
    )
  }
}

BankDefinition.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    company: state.login.company
  }
}

export default connect(mapStateToProps)(injectIntl(BankDefinition));
