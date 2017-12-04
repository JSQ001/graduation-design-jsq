/**
 * created by jsq on 2017/10/9
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Table, Badge, notification, Popover, Popconfirm, Tabs  } from 'antd';

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/pay/bank-definition/bank-definition.scss'
import SlideFrame from 'components/slide-frame'
import CreateOrUpdateBank from 'containers/pay/bank-definition/createOrUpdate-bank'
const TabPane = Tabs.TabPane;
let bankType = [];

class BankDefinition extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      label: "commonBank",
      tabs: [
        {key: 'commonBank', name: formatMessage({id:"bank.commonBank"})},  /*通用银行*/
        {key: 'customBank', name: formatMessage({id:"bank.customBank"})}, /*自定义银行*/
      ],
      searchParams: {
        bankCode: "",
        bankName: "",
        country: "",
        address: ""
      },
      searchForm: [
        {type: 'input', id: 'bankCode', label: formatMessage({id: 'bank.bankCode'}) }, /*银行代码*/
        {type: 'input', id: 'bankName', label: formatMessage({id: 'bank.bankName'}) }, /*银行名称*/
        {type: 'select', id: 'country',options:[], labelKey: 'country',valueKey: 'id',
          label: formatMessage({id: 'bank.country'}),  /*国家*/
          listExtraParams:{organizationId: this.props.id},
          getUrl: `${config.payUrl}/location-service/api/localization/query/county`, method: 'get', getParams: {language: this.props.language.locale}
        },
        {type: 'input', id: 'address', label: formatMessage({id: 'bank.bankName'}) }, /*开户地*/
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
        {          /*银行代码*/
          title: formatMessage({id:"bank.country"}), key: "country", dataIndex: 'country'
        },
        {          /*银行代码*/
          title: formatMessage({id:"bank.bankCode"}), key: "bankCode", dataIndex: 'bankCode'
        },
        {
          title: 'Swift Code', key: "Swift Code", dataIndex: 'swiftCode',
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
        {          /*银行名称*/
          title: formatMessage({id:"bank.bankName"}), key: "bankName", dataIndex: 'bankName'
        },
        {          /*开户地*/
          title: formatMessage({id:"bank.address"}), key: "address", dataIndex: 'address',
        }
      ],
      operate:{          /*操作*/
        title: formatMessage({id:"common.operation"}), key: "operation", dataIndex: 'operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record)}>{formatMessage({id:"common.edit"})}</a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.goBranchBank(e, record)}>{formatMessage({id:"bank.branchInfo"})}</a>  {/*分行信息*/}
          </span>)
      },
    }
  }

  componentWillMount(){
    this.getList();
  }

  //Tabs点击
  onChangeTabs = (key) => {
    let {columns, operate,pagination} = this.state;
    console.log(key)
    console.log(this.props.language)
    if(key === 'customBank'){
      columns[5] = operate;
    }else {
      if(columns.length === 6){
        columns.delete(operate)
      }
    }
    pagination.page = 0;
    pagination.pageSize = 10;
    this.setState({
      loading: true,
      pagination,
      data: [],
      label: key,
      columns: columns
    },()=>{
      this.getList()
    });
  };

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
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  render(){
    const { formatMessage } = this.props.intl;
    const { loading,data, searchForm, pagination, columns, showSlideFrame, label, slideFrameTitle } = this.state;

    return(
      <div className="budget-bank-definition">
        <Tabs onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            {label === "commonBank" ? null
              :
              <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>
            }
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
                    params={{}}/>
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
    company: state.login.company,
    language: state.main.language,
  }
}

export default connect(mapStateToProps)(injectIntl(BankDefinition));
