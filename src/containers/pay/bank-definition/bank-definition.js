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
import 'styles/pay/bank-definition/bank-definition.scss'
import SlideFrame from 'components/slide-frame'
import CreateOrUpdateBank from 'containers/pay/bank-definition/createOrUpdate-bank'

let bankType = [
  {value:"cashBank", label:"现金银行"},
  {value:"clearingBank", label:"清算银行"},
  {value:"innerBank", label:"内部银行"},
  {value:"commonBank", label:"一般银行"}
];

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
        {type: 'input', id: 'bankCode', label: formatMessage({id: 'bank.bankCode'}) }, /*银行代码*/
        {type: 'input', id: 'bankName', label: formatMessage({id: 'bank.bankName'}) }, /*银行名称*/
        {type: 'select', options: bankType, id: 'bankType', label: formatMessage({id: 'bank.bankType'})}  /*银行类型*/
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
          title: formatMessage({id:"bank.digitalCode"}), key: "bankCodeLong", dataIndex: 'bankCodeLong'
        },
        {          /*银行字母代码*/
          title: formatMessage({id:"bank.letterCode"}), key: "bankCodeString", dataIndex: 'bankCodeString'
        },
        {          /*银行名称*/
          title: formatMessage({id:"bank.bankName"}), key: "bankName", dataIndex: 'bankName'
        },
        {          /*银行类型*/
          title: formatMessage({id:"bank.bankType"}), key: "bankType", dataIndex: 'bankType',
          render: recode => {
            let value = recode;
            bankType.map((item)=>{
              if(item.value === recode){
                value = item.label
              }
            });
            return value
          }
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
            <a href="#" onClick={(e) => this.editItem(e, record)}>{formatMessage({id:"common.edit"})}</a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.goBranchBank(e, record)}>{formatMessage({id:"bank.branchInfo"})}</a>  {/*分行信息*/}
          </span>)
        },
      ]
    }
  }

  componentWillMount(){
    this.getList();
  }

  editItem = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: this.props.intl.formatMessage({id:"bank.editorBank"}), /*编辑银行*/
      nowBank: {bank: record},
    })
  };

  goBranchBank = (e, record) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('bank-definition', 'key').children.branchBankInformation.url.replace(':id', record.id));
  };

  handleCreate = ()=>{
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: this.props.intl.formatMessage({id:"bank.createBank"}),  //新建银行
      nowBank: {bank:{}}
    });
  };

  //获取公司下的银行数据
  getList(){
    let params = this.state.searchParams;
    let url = `${config.payUrl}/api/cash/banks/query?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
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

  //点击行，银行分行页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('bank-definition', 'key').children.branchBankInformation.url.replace(':id', record.id));
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading,data, searchForm, pagination, columns, showSlideFrame, nowBank, slideFrameTitle } = this.state;

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
