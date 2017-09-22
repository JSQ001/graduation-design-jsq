/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table } from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget-setting/budget-organization/budget-item/budget-item.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      selectedRowKeys: [],
      pagination:{
        current: 0,
        pageSize: 10,
        total: 0,
      },
      searchForm: [
        {type: 'input', id: 'itemCode', label: this.props.intl.formatMessage({id: 'budget.itemCode'}) }, /*预算项目代码*/
        {type: 'input', id: 'itemCodeFrom', label: this.props.intl.formatMessage({id: 'budget.itemCodeFrom'}) }, /*预算项目代码从*/
        {type: 'input', id: 'itemCodeTo', label: this.props.intl.formatMessage({id: 'budget.itemCodeTo'}) }, /*预算项目代码至*/
        {type: 'input', id: 'itemTypeName', label: this.props.intl.formatMessage({id: 'budget.itemType'}) }, /*预算项目类型*/
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
  //获取预算项目数据
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/items/query`).then((response)=>{
      console.log(response)
      this.setState({
        loading: false,
        data: response.data,
        pagination: {
          total: Number(response.headers['x-total-count']),
        }
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
      // pagination:pagination,
      pagination:{
        current: pagination.current,
        pageSize: pagination.pageSize
      }
    }, ()=>{
      this.getList();
    })
  }

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
      temp.push(record.expenseReportOID);
    else
      temp.delete(record.expenseReportOID);
    this.setState({selectedEntityOIDs: temp})
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.expenseReportOID)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.expenseReportOID)
      })
    }
    this.setState({selectedEntityOIDs: temp})
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.expenseReportOID === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  handleCreate = () =>{

    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.newBudgetItem.url.replace(':id', this.props.id));
  }

  render(){
    const { loading, searchForm ,data, selectedRowKeys, pagination, columns} = this.state;
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
          <div className="table-header-title">{this.props.intl.formatMessage({id:'search.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'button.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
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
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetItem));
