/**
*  created by jsq on 2017/12/18
*/
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, notification, Popover, Popconfirm, } from 'antd';
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import SlideFrame from 'components/slide-frame'
import NewUpdateSupplier from 'containers/financial-management/supplier-management/new-update-supplier'
import 'styles/financial-management/supplier-management/supplier-management.scss'
import menuRoute from 'routes/menuRoute'
import Importer from 'components/template/importer'
import moment from 'moment'

class SupplierManagement extends React.Component{
  constructor(props){
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      //data: [{supplierCode:123,key:1,id:1}],
      data: [],
      batchCompany: true,
      selectedRowKeys:[],
      slideFrame:{
        title: '',
        visible: false,
        params: {}
      },
      pagination: {
        current: 1,
        page: 0,
        total:0,
        disuse:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'select', id: 'supplierType', label: formatMessage({id: 'supplier.management.type'})/*供应商类型*/, options:[]},
        {type: 'input', id: 'venNickCode', label: formatMessage({id: 'supplier.management.code'})/*供应商代码*/, },
        {type: 'input', id: 'venNickname', label: formatMessage({id: 'supplier.management.name'})/*供应商名称*/, },
        {type: 'input', id: 'bankAccount', label: formatMessage({id: 'supplier.bank.account'})/*银行账号*/, },
        {type: 'radio', id: 'supplierStatus', label: formatMessage({id: 'supplier.management.status'})/*供应商状态*/,
          options:[
            {label:formatMessage({id:"supplier.management.all"}),value: 'all'},
            {label:formatMessage({id:"supplier.management.using"}),value: 'using'},
            {label:formatMessage({id:"supplier.management.disuse"}),value: 'disuse'},
          ]
        },
      ],
      columns: [
        {          /*供应商代码*/
          title: formatMessage({id:"supplier.management.code"}), key: "venderCode", dataIndex: 'venderCode'
        },
        {          /*外部标识ID*/
          title: formatMessage({id:"supplier.management.outerId"}), key: "venNickOid", dataIndex: 'venNickOid'
        },
        {          /*供应商名称*/
          title: formatMessage({id:"supplier.management.name"}), key: "venNickname", dataIndex: 'venNickname',
          render: desc => <span>{desc ? <Popover placement="topLeft" content={desc}>{desc}</Popover> : '-'}</span>
        },
        {          /*供应商类型*/
          title: formatMessage({id:"supplier.management.type"}), key: "supplierType", dataIndex: 'supplierType'
        },
        {
          /*更新日志*/
          title: formatMessage({id: "supplier.management.updateLog"}), key: "updateLog", dataIndex: 'updateLog',width:'25%',
          render: (value, record, index) =>{
            let add = m =>m<10?'0'+m:m;
            let time = new Date( record.updateTime);
            return time.getFullYear()+"-"+add(time.getMonth()+1)+"-"+add(time.getDate())+" "+add(time.getHours())+":"+add(time.getMinutes())+":"+add(time.getSeconds())+" "+record.venOperatorName+"-"+record.venOperatorNumber
          }
        },
        {           /*状态*/
          title: formatMessage({id:"common.column.status"}), key: 'status', width: '10%', dataIndex: 'venType',width: '7%',
          render: venType => (
            <Badge status={venType===1001 ? 'success' : 'error'} text={venType===1001 ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '18%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.editItem(e, record,index)}>{formatMessage({id: "common.edit"})}</a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkAccount(e, record,index)}>{formatMessage({id: "supplier.bank.account"})}</a>
           <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkCompany(e, record,index)}>{formatMessage({id: "supplier.management.deliveryCompany"})}</a>
          </span>)
        },
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    }
  }

  componentWillMount() {
    this.getList();
  }

  handleLinkAccount = (e,record,index)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('supplier-bank-account', 'key').children.supplierBankAccount.url.replace('id', record.id))
  };

  handleLinkCompany = (e,record,index)=>{
    console.log(record)
    this.context.router.push(menuRoute.getMenuItemByAttr('supplier-bank-account', 'key').children.supplierCompanyDelivery.url.replace('id', record.id))
  };

  handleSearch = (values)=>{
    console.log(values)
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      loading: true,
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.id);
    else
      temp.delete(record.id);
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.id === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  getList(){
    httpFetch.post(`${config.vendorUrl}/vendor-info-service/api/ven/info/search`,{}).then((response)=>{
      response.data.body.map(item =>{
        item.key = item.id
      });
      this.setState({
        loading: false,
        data: response.data.body
      })
    })
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

  handleUpdate = (record)=>{
    record.updateTime = moment(new Date(record.effectiveDate));
    let slideFrame = {
      title: this.props.intl.formatMessage({id:"supplier.management.updateSupplier"}),
      visible: true,
      params: record
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
    console.log(params)
    let slideFrame = {
      title: "",
      visible: false,
      params: {}
    };
    this.setState({
      slideFrame,
      loading: params
    });
    if (params){
      this.getList()
    }
  };

  render(){
    const { loading, searchForm, data, columns, pagination, batchCompany, selectedRowKeys, slideFrame} = this.state;
    const { formatMessage } = this.props.intl;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };
    return(
      <div className="supplier-management">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">
              {formatMessage({id:'supplier.management.total'},{total:`${pagination.total}`})}
              {formatMessage({id:'supplier.management.total.disuse'},{total:`${pagination.disuse}`})}
          </div>  {/*共搜索到*个供应商，*个已停用*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
            <Importer title={formatMessage({id:"supplier.management.upload"})}
                      templateUrl={`${config.budgetUrl}/api/budget/items/export/template`}
                      uploadUrl={`${config.budgetUrl}/api/budget/items/import`}
                      errorUrl={`${config.budgetUrl}/api/budget/items/export/failed/data`}
                      fileName={formatMessage({id:"item.itemUploadFile"})}
                      onOk={this.handleImportOk}/>
            <Button onClick={()=>this.showListSelector(true)} disabled={batchCompany}>{formatMessage({id:"supplier.management.deliveryCompany"})}</Button>
          </div>
        </div>
        <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            onRow={record => ({
              onClick: () => this.handleUpdate(record)
            })}
            pagination={pagination}
            bordered
            size="middle"/>
        <SlideFrame
            title={slideFrame.title}
            show={slideFrame.visible}
            content={NewUpdateSupplier}
            onClose={this.handleOnClose}
            afterClose={this.handleAfterClose}
            params={slideFrame.params}/>
      </div>)
  }
}

SupplierManagement.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SupplierManagement));
