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
      label: "customBank",
      countryCode: 'CHN000000000',
      accountAddress:[],
      slideFrame:{
        title: "",
        visible: false,
        params: {}
      },
      tabs: [
        {key: 'customBank', name: formatMessage({id:"bank.customBank"})}, /*自定义银行*/
        {key: 'commonBank', name: formatMessage({id:"bank.commonBank"})},  /*通用银行*/
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
        {type: 'select', id: 'country',options:[], labelKey: 'country',valueKey: 'code',
          label: formatMessage({id: 'bank.country'}),  /*国家*/
          event:'COUNTRY_CHANGE',
          defaultValue:'中国',
          getUrl: `http://192.168.1.77:13001/location-service/api/localization/query/county`, method: 'get', getParams: {language: this.props.language.locale ==='zh' ? "zh_cn" : "en_us"},
        },
        {type: 'cascader', id: 'address', options:[],event:'ADDRESS_CHANGE', label: formatMessage({id: 'bank.address'}) , /*开户地*/}
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
        {          /*国家*/
          title: formatMessage({id:"bank.country"}), key: "countryName", dataIndex: 'countryName'
        },
        {          /*银行代码*/
          title: formatMessage({id:"bank.bankCode"}), key: "bankCode", dataIndex: 'bankCode'
        },
        {
          title: 'Swift Code', key: "Swift Code", dataIndex: 'swiftCode'
        },
        {          /*银行名称*/
          title: formatMessage({id:"bank.bankName"}), key: "bankName", dataIndex: 'bankName',
          render: desc => <span>{desc ? <Popover placement="topLeft" content={desc}>{desc}</Popover> : '-'}</span>
        },
        {          /*开户地*/
          title: formatMessage({id:"bank.address"}), key: "accountAddress", dataIndex: 'accountAddress',
          render:(value,record,index)=>
            <span>
              <Popover placement="topLeft" content={record.provinceName+record.cityName+record.districtName }>
              {record.provinceName+record.cityName+record.districtName}
              </Popover>
            </span>
        },
        {          /*详细地址*/
          title: formatMessage({id:"bank.detailAddress"}), key: "address", dataIndex: 'address',
          render: desc => <span>{desc ? <Popover placement="topLeft" content={desc}>{desc}</Popover> : '-'}</span>
        },
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

  handleEvent =(event,value)=>{
    let { searchForm, address} = this.state;
    console.log(value)
    console.log(event)
    switch (event) {
      case 'COUNTRY_CHANGE':
        let add = {};
        let addressOptions = [];
        add.country = value;
        httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/state?code=${value}`).then((response)=>{
          response.data.map((item)=>{
            let options = {
              value: item.code,
              label: item.state,
              children: []
            };
           addressOptions.push(options)
          });
          searchForm[3].options = addressOptions;
            this.setState({
            address:add
,            searchForm
          })
        });
        break;
      case 'ADDRESS_CHANGE':
     }
  };

  componentWillMount(){
    let  searchForm = this.state.searchForm;
    //国家默认是中国，查询出中国的省市
    httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/all/address?code=${this.state.countryCode}&language=${this.props.language.locale ==='zh' ? "zh_cn" : "en_us"}`).then((response)=>{
      searchForm[3].options = response.data;
      this.setState({
        accountAddress: response.data,
        searchForm,
      },this.getList())
    });
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

  handleCreate = ()=>{
    let slideFrame = {};
    slideFrame.title = this.props.intl.formatMessage({id:"bank.createBank"});  //新建银行
    slideFrame.visible = true;
    slideFrame.params = {addressDetail: this.state.accountAddress};
    this.setState({
      slideFrame
    });
  };

  handleUpdate = (record,index) =>{
    console.log(record)
    let slideFrame = {};
    slideFrame.title = this.props.intl.formatMessage({id:"bank.editorBank"}); //编辑银行
    slideFrame.visible = true;
    record.addressDetail = this.state.accountAddress;
    slideFrame.params = record;
    this.setState({
      slideFrame
    })
  };

  //获取公司下的银行数据
  getList(){
    let {pagination, searchParams, label } = this.state;
    let bankUrl = this.state.label === 'customBank' ? '/api/cash/bank/user/defineds/query' : '/api/cash/bank/datas/query';
    let url = `${config.payUrl}${bankUrl}?page=${pagination.page}&size=${pagination.pageSize}`;
    for(let paramsName in searchParams){
      url += searchParams[paramsName] ? `&${paramsName}=${searchParams[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      if(response.status === 200){
        console.log(response);
        response.data.map((item)=>{
          item.key = item.id;
        });
        let pagination = this.state.pagination;
        pagination.total = Number(response.headers['x-total-count']);
        pagination.page = 0;
        pagination.pageSize = 10;
        this.setState({
          loading: false,
          data: response.data,
          pagination
        });
      }
    })
  }

  handleSearch = (values) =>{
    console.log(values)

    let searchParams = {
      bankCode: values.bankCode,
      bankName: values.bankName,
      country: values.country === '中国'  ? 'CHN000000000' : values.country
    };
    console.log(searchParams)
    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 1
    }, ()=>{
      this.getList();
    })
  };

  handleCloseSlide = (params) => {
    console.log(params)

    if(params) {
      this.getList();
    }
    this.setState({
      slideFrame: {
        visible: false
      }
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
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

  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  render(){
    const { formatMessage } = this.props.intl;
    const { loading,data, searchForm, pagination, columns, label, slideFrame } = this.state;

    return(
      <div className="budget-bank-definition">
        <Tabs onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <SearchArea searchForm={searchForm} eventHandle={this.handleEvent} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            {label === "commonBank" ? null
              :
              <Button type="primary" disabled={loading} onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>
            }
          </div>
        </div>
        <Table
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onChange={this.onChangePager}
            columns={columns}
            onRowClick={this.handleUpdate}
            size="middle"
            bordered/>
        <SlideFrame title={slideFrame.title}
                    show={slideFrame.visible}
                    content={CreateOrUpdateBank}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({slideFrame : {visible:false}})}
                    params={slideFrame.params}/>
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
