/**
*  created by jsq on 2017/12/18
*/
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, notification, Popover, Popconfirm, Icon  } from 'antd';
import SearchArea from 'components/search-area.js';
import SlideFrame from "components/slide-frame";
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/financial-management/supplier-management/supplier-bank-account.scss'
import NewUpdateBankAccount from 'containers/financial-management/supplier-management/new-update-bank-account'
import menuRoute from 'share/menuRoute'

class SupplierBankAccount extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      slideFrame:{
        title: '',
        visible: false,
        params: {}
      },
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'input', id: 'type', disabled: true, defaultValue:12, label: formatMessage({id: 'supplier.management.type'}) }, /*供应商类型*/
        {type: 'input', id: 'code', disabled: true, defaultValue:132, label: formatMessage({id: 'supplier.management.code'}) }, /*供应商代码*/
        {type: 'input', id: 'name', disabled: true, defaultValue:123, label: formatMessage({id: 'supplier.management.name'}) }, /*供应商名称*/
        {type: 'switch', id: 'isEnabled', defaultValue: true, label: formatMessage({id: 'common.column.status'}) }, /*状态*/
      ],
      columns: [
        {                         /*序号*/
          title: formatMessage({id:"supplier.management.ordinalNumber"}), key: "ordinalNumber", dataIndex: 'ordinalNumber'
        },
        {                         /*银行代码*/
          title: formatMessage({id:"bank.bankCode"}), key: "bankCode", dataIndex: 'bankCode'
        },
        {                         /*银行名称*/
          title: formatMessage({id:"bank.bankName"}), key: "bankName", dataIndex: 'bankName'
        },
        {                         /*银行账号*/
          title: formatMessage({id:"supplier.bank.account"}), key: "account", dataIndex: 'account'
        },
        {                         /*国家*/
          title: formatMessage({id:"bank.country"}), key: "country", dataIndex: 'country'
        },
        {                         /*最近更新时间*/
          title: formatMessage({id:"supplier.management.lastUpdate"}), key: "lastUpdate", dataIndex: 'lastUpdate'
        },
        {                         /*状态*/
          title: formatMessage({id:"common.column.status"}), key: "isEnabled", dataIndex: 'isEnabled'
        },
        {                         /*主账户*/
          title: formatMessage({id:"supplier.main.account"}), key: "mainAccount", dataIndex: 'mainAccount'
        },
      ]
    };
  }

  componentWillMount() {
  }

  //新建侧滑
  handleCreate = ()=>{
    let slideFrame = {
      title: this.props.intl.formatMessage({id:"supplier.management.newSupplier"}),
      visible: true,
      params: {}
    };
    this.setState({
      slideFrame
    })
  };

  handleOnClose = () =>{
    let slideFrame = {
      title: "",
      visible: false,
      params: {}
    };
    this.setState({
      slideFrame
    })
  };

  handleAfterClose = (params) =>{
    let slideFrame = {
      title: "",
      visible: false,
      params: {}
    };
    this.setState({
      slideFrame
    })
  };

  //返回
  handleBack = () => {
    this.context.router.push(menuRoute.getRouteItem('supplier-management', 'key').url)
  };

  render(){
    const {loading, searchForm, data, pagination, columns, slideFrame} = this.state;
    const { formatMessage } = this.props.intl;
    return(
      <div className="supplier-bank-account">
        <SearchArea searchForm={searchForm} submitHandle={()=>{}}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
           loading={loading}
           dataSource={data}
           pagination={pagination}
           columns={columns}
           bordered
           size="middle"/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>{formatMessage({id:"common.back"})}</a>
        <SlideFrame
          title={slideFrame.title}
          show={slideFrame.visible}
          content={NewUpdateBankAccount}
          onClose={this.handleOnClose}
          afterClose={this.handleAfterClose}
          params={slideFrame.params}/>
      </div>
    )
  }
}

SupplierBankAccount.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SupplierBankAccount));
