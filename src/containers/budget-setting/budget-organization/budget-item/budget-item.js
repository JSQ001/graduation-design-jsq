/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select } from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget-setting/budget-organization/budget-item/budget-item.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SelectorData from 'share/selectorData.js'

const itemCode = [];
class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params:{},
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
        {type: 'select', id: 'itemCodeFrom',
          label: this.props.intl.formatMessage({id: 'budget.itemCodeFrom'}),  /*预算项目代码从*/
          options: itemCode
        },
        {type: 'select', id: 'itemCodeTo',
          label: this.props.intl.formatMessage({id: 'budget.itemCodeTo'}), /*预算项目代码至*/
          options: itemCode
        },
        {type: 'select', id: 'itemTypeName',
          label: this.props.intl.formatMessage({id: 'budget.itemType'}),  /*预算项目类型*/
          options: [],
          onClick: this.handleSelectItemType,
        },
      ],
      columns: [
        {          /*预算组织*/
          title: this.props.intl.formatMessage({id:"budget.organization"}), key: "organizationCode", dataIndex: 'organizationCode'
        },
        {          /*预算项目代码*/
          title: this.props.intl.formatMessage({id:"budget.itemCode"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*预算项目名称*/
          title: this.props.intl.formatMessage({id:"budget.itemName"}), key: "itemName", dataIndex: 'itemName'
        },
        {          /*预算项目类型*/
          title: this.props.intl.formatMessage({id:"budget.itemType"}), key: "itemType", dataIndex: 'itemType'
        },
        {          /*变动属性*/
          title: this.props.intl.formatMessage({id:"budget.item.variationAttribute"}), key: "variationAttribute", dataIndex: 'variationAttribute'
        },
        {          /*预算项目描述*/
          title: this.props.intl.formatMessage({id:"budget.itemDescription"}), key: "description", dataIndex: 'description'
        },
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount(){
    this.getList();
  }

  handleSelectItemType = (e)=>{
    e.preventDefault();
    console.log(124)
  }

  //获取预算项目数据
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/items/query?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`).then((response)=>{
      response.data.map((item,index)=>{
        item.key = item.id;
        let budgetItem = {
          value: item.itemCode,
          label: item.itemCode+" ( "+item.itemName+" ) "
        }
        itemCode.push(budgetItem);
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
    this.setState({
      params:values,
    },()=>{
      this.getList()
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    this.setState({
      pagination:{
        page: pagination.current-1,
        current: pagination.current,
        pageSize: pagination.pageSize
      }
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

  //批量分配公司
  handleBatchCompany = () =>{

  };

  //点击行，进入该行详情页面
  handleRowClick = (record, index, event) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.
    budgetItemDetail.url.replace(':id', this.props.id).replace(':id', record.id));
  };

  render(){
    const { loading, searchForm ,data, selectedRowKeys, pagination, columns, batchCompany} = this.state;

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
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
            <Button onClick={this.handleBatchCompany} disabled={batchCompany}>{this.props.intl.formatMessage({id:"budget.item.batchCompany"})}</Button>
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
      </div>
    )
  }

}
BudgetItem.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {

  }
}

export default connect(mapStateToProps)(injectIntl(BudgetItem));
