/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select, Popover, Badge, message } from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget-setting/budget-organization/budget-item/budget-item.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import ListSelector from 'components/list-selector'


const itemCode = [];
class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      companyListSelector: false,
      searchParams:{
        itemCode: "",
        itemName: "",
        itemCodeFrom: "",
        itemCodeTo: "",
        itemTypeCode: "",
      },
      selectedRowKeys: [],
      batchCompany: true,
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'input', id: 'itemCode', label: this.props.intl.formatMessage({id: 'budget.itemCode'}) }, /*预算项目代码*/
        {type: 'input', id: 'itemName', label: this.props.intl.formatMessage({id:"budget.itemName"}) },
        {type: 'select', id: 'itemTypeName',options:[], labelKey: 'itemTypeName',valueKey: 'id',
          label: formatMessage({id: 'budget.itemType'}),  /*预算项目类型*/
          listExtraParams:{organizationId: this.props.id},
          getUrl: `${config.budgetUrl}/api/budget/itemType/query/all`, method: 'get', getParams: {organizationId: this.props.id}
        },
        {type: 'select', id: 'itemCodeFrom',
          label: formatMessage({id: 'budget.itemCodeFrom'}),  /*预算项目代码从*/
          options: itemCode
        },
        {type: 'select', id: 'itemCodeTo',
          label: formatMessage({id: 'budget.itemCodeTo'}), /*预算项目代码至*/
          options: itemCode
        },
      ],

      columns: [
        {          /*预算项目代码*/
          title: formatMessage({id:"budget.itemCode"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*预算项目名称*/
          title: formatMessage({id:"budget.itemName"}), key: "itemName", dataIndex: 'itemName'
        },
        {          /*预算项目类型*/
          title: formatMessage({id:"budget.itemType"}), key: "itemTypeName", dataIndex: 'itemTypeName'
        },
        {          /*备注*/
          title: formatMessage({id:"budget.itemDescription"}), key: "description", dataIndex: 'description', width: "10%",
          render: description => (
            <span>{description ? <Popover content={description}>{description} </Popover> : '-'} </span>)
        },
        {           /*状态*/
          title: formatMessage({id:"common.column.status"}),
          key: 'status',
          width: '10%',
          dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        }
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount(){
    this.getList();
    //查出所有预算项目，以方便预算项目的查询中可以选择
    httpFetch.get(`${config.budgetUrl}/api/budget/items/find/all?organizationId=${this.props.id}`).then((response)=>{
      response.data.map((item,index)=>{
        item.key = item.id;
        let budgetItem = {
          value: item.itemCode,
          label: item.itemCode+" ( "+item.itemName+" ) "
        };
        itemCode.push(budgetItem);
      });
    })
  }

  //获取预算项目数据
  getList(){

    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/items/query?organizationId=${this.props.id}&page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      response.data.map((item,index)=>{
        item.key = item.id;
      });
      this.setState({
        loading: false,
        data: response.data,
        pagination: {
          page: this.state.pagination.page,
          current: this.state.pagination.current,
          pageSize:this.state.pagination.pageSize,
          showSizeChanger:true,
          showQuickJumper:true,
          total: Number(response.headers['x-total-count']),
        }
      },()=>{
        this.refreshRowSelection()
      })
    })
  }

  handleSearch = (values) =>{
    console.log(values)
    this.setState({
      searchParams:{
        itemCode: values.itemCode,
        itemName: values.itemName,
        itemCodeFrom: values.itemCodeFrom,
        itemCodeTo: values.itemCodeTo,
        itemTypeId: typeof values.itemTypeName === "undefined" ? "" : values.itemTypeName[0],
      },
    },()=>{
      this.getList()
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
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

  //新建
  handleCreate = () =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.newBudgetItem.url.replace(':id', this.props.id));
  };


  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  //处理公司弹框点击ok
  handleListOk = (result) => {
    let companyIds = [];
    result.result.map((item)=>{
      companyIds.push(item.id)
    });
    let param = [];

    param.push({"companyIds": companyIds, "resourceIds": this.state.selectedEntityOIDs});
    httpFetch.post(`${config.budgetUrl}/api/budget/item/companies/batch/assign/company`,param).then((response)=>{
      message.success(`${this.props.intl.formatMessage({id:"common.operate.success"})}`);
      if(response.status === 200){
        this.setState({
          loading: true,
          batchCompany: true
        },this.getList())
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})},${e.response.data.message}`)
      }
    });

    this.showListSelector(false)

  };

  //点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.
    budgetItemDetail.url.replace(':id', this.props.id).replace(':itemId', record.id));
  };

  render(){
    const { loading, searchForm ,data, selectedRowKeys, pagination, columns, batchCompany, companyListSelector} = this.state;
    const { formatMessage } = this.props.intl;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };
    return (
      <div className="budget-item">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
            <Button onClick={()=>this.showListSelector(true)} disabled={batchCompany}>{formatMessage({id:"budget.item.batchCompany"})}</Button>
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          onRowClick={this.handleRowClick}
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
        <ListSelector type="company"
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      extraParams={{setOfBooksId: this.props.company.setOfBooksId,isEnabled: true}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>
    )
  }

}
BudgetItem.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.login.organization,
    company: state.login.company,
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetItem));
