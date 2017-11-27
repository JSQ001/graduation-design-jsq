/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table, Badge, notification, Popover, Popconfirm, Tabs } from 'antd';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/pay/bank-definition/bank-definition.scss'
import SlideFrame from 'components/slide-frame'
import CreateOrUpdateBank from 'containers/pay/bank-definition/createOrUpdate-bank'
const TabPane = Tabs.TabPane;

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
      params: {
        bankCode: "",
        bankName: "",
        bankType: ""
      },
      newParams: {},
      searchForm: [
        {type: 'input', id: 'bankCode', label: formatMessage({id: 'bank.bankCode'}) }, /*银行代码*/
        {type: 'input', id: 'bankName', label: formatMessage({id: 'bank.bankNames'}) }, /*银行名称/支行名称*/
        {type: 'select', options:[] , id: 'country', label: formatMessage({id: 'bank.country'})},  /*国家*/
        {type: 'input', id: 'address', label: formatMessage({id: 'bank.address'}) }, /*开户地*/
      ],
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      label: "universalBank",
      tabs: [
        {key: 'universalBank', name: '通用银行'},
        {key: 'customBank', name: '自定义银行'}
      ],
      columns: [
        {          /*国家*/
          title: formatMessage({id:"bank.country"}), key: "country", dataIndex: 'country'
        },
        {          /*银行代码*/
          title: formatMessage({id:"bank.bankCode"}), key: "bankCode", dataIndex: 'bankCode'
        },
        {          /*银行字母代码*/
          title: 'Swift Code', key: "bankCodeString", dataIndex: 'bankCodeString'
        },
        {          /*银行名称*/
          title: formatMessage({id:"bank.bankName"}), key: "bankName", dataIndex: 'bankName'
        },
        {          /*开户地*/
          title: formatMessage({id:"bank.address"}), key: "bankCodeLong", dataIndex: 'bankCodeLong'
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
    const {params, key, pagination  }  = this.state;
    let path = ''

    let url = `${config.payUrl}/api/cash/banks/query?page=${pagination.page}&size=${pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      if(response.status === 200){
        console.log(response);
        response.data.map((item)=>{
          item.key = item.id;
        });
        let pagination = this.state.pagination;
        pagination.total = Number(response.headers['x-total-count'])
        this.setState({
          loading: false,
          data: response.data,
          pagination
        });
      }
    })
  }

  handleSearch = (values) =>{
    let params = {
      bankName: values.bankName,
      bankCode: values.bankCode,
      bankType: values.bankType
    };
    this.setState({
      params:params,
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
    if(this.state.label === 'customBank')
    this.context.router.push(menuRoute.getMenuItemByAttr('bank-definition', 'key').children.branchBankInformation.url.replace(':id', record.id));
  };

  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  //Tabs点击
  onChangeTabs = (key) => {
    let pagination = this.state.pagination;
    this.setState({
      loading: true,
      page: 0,
      data: [],
      label: key,
    },()=>{
      this.getList()
    });
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading,data, searchForm, pagination, columns, showSlideFrame, nowBank, slideFrameTitle } = this.state;

    return(
      <div className="budget-bank-definition">
        <Tabs onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          {this.state.label === 'customBank'?
            <div className="table-header-buttons">
              <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
            </div>
            : null
          }
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
