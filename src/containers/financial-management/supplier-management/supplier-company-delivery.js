/**
 *  created by jsq on 2017/12/20
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, notification, Popover, Popconfirm, Icon, Checkbox  } from 'antd';
import SearchArea from 'components/search-area.js';
import ListSelector from 'components/list-selector.js'
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/financial-management/supplier-management/supplier-company-delivery.scss'
import NewUpdateBankAccount from 'containers/financial-management/supplier-management/new-update-bank-account'
import menuRoute from 'share/menuRoute'

class SupplierCompanyDelivery extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      companyListSelector: false,  //控制公司选则弹框
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
        {                         /*公司代码*/
          title: formatMessage({id:"supplier.company.code"}), key: "companyCode", dataIndex: 'companyCode'
        },
        {                         /*公司名称*/
          title: formatMessage({id:"supplier.company.name"}), key: "companyName", dataIndex: 'companyName'
        },
        {                         /*公司类型*/
          title: formatMessage({id:"supplier.company.type"}), key: "companyType", dataIndex: 'companyType'
        },
        {                         /*账套*/
          title: formatMessage({id:"supplier.company.setOfBook"}), key: "setOfBook", dataIndex: 'setOfBook'
        },
        {                         /*付款条件*/
          title: formatMessage({id:"supplier.company.payCondition"}), key: "country", dataIndex: 'country'
        },
        {                        /*启用*/
          title:formatMessage({id:"common.status.enable"}), key: "doneRegisterLead", dataIndex: 'doneRegisterLead',width:'10%',
          render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>
        }
      ]
    }
  }

  //改变启用状态
  onChangeEnabled = (e, record) => {
    this.setState({loading: true});
    record.isEnabled = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/item/companies`, record).then(() => {
      this.getList()
    })
  };

  componentWillMount(){}

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  //处理公司弹框点击ok,分配公司
  handleListOk = (result) => {};

  //返回
  handleBack = () => {
    this.context.router.push(menuRoute.getRouteItem('supplier-management', 'key').url)
  };

  render() {
    const { loading, data, columns, pagination, searchForm, companyListSelector} = this.state;
    const {formatMessage} = this.props.intl;

    return (
      <div className="supplier-company-delivery">
        <SearchArea searchForm={searchForm} submitHandle={()=>{}}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.showListSelector(true)}>{formatMessage({id: 'budget.item.batchCompany'})}</Button>  {/*批量分配公司*/}
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

        <ListSelector type="company_item"
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      extraParams={{itemId: this.props.params.itemId}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>)
  }
}

SupplierCompanyDelivery.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SupplierCompanyDelivery));
