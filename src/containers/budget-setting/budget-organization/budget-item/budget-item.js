/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select, Popover } from 'antd';
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
          label: formatMessage({id: 'budget.itemCodeFrom'}),  /*预算项目代码从*/
          options: itemCode
        },
        {type: 'select', id: 'itemCodeTo',
          label: formatMessage({id: 'budget.itemCodeTo'}), /*预算项目代码至*/
          options: itemCode
        },
        {type: 'list', id: 'itemTypeName',
          listType: 'item_type',
          labelKey: 'itemTypeName',
          valueKey: 'id',
          label: formatMessage({id: 'budget.itemType'}),  /*预算项目类型*/
          listExtraParams:{organizationId: this.props.id}
        },
      ],

      columns: [
        {          /*预算组织*/
          title: formatMessage({id:"budget.organization"}), key: "organizationName", dataIndex: 'organizationName'
        },
        {          /*预算项目代码*/
          title: formatMessage({id:"budget.itemCode"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*预算项目名称*/
          title: formatMessage({id:"budget.itemName"}), key: "itemName", dataIndex: 'itemName'
        },
        {          /*预算项目类型*/
          title: formatMessage({id:"budget.itemType"}), key: "itemTypeName", dataIndex: 'itemTypeName'
        },
        {          /*变动属性*/
          title: formatMessage({id:"budget.item.variationAttribute"}), key: "variationAttribute", dataIndex: 'variationAttribute',
          render: (recode)=>{
            if(recode === "immobilization")
              return formatMessage({id:"variationAttribute.immobilization"}) /*固定*/
            if(recode === "mix")
              return formatMessage({id:"variationAttribute.mix"}) /*混合*/
            if(recode === "alteration")
              return formatMessage({id:"variationAttribute.alteration"}) /*变动*/
          }
        },
        {          /*备注*/
          title: formatMessage({id:"budget.itemDescription"}), key: "description", dataIndex: 'description',
          render: description => (
            <span>
              {description ? description : '-'}
              <Popover content={description}>
                {description}
              </Popover>
            </span>)
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
    httpFetch.get(`${config.budgetUrl}/api/budget/items/query?organizationId=${this.props.id}&page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`).then((response)=>{
      console.log(response)
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
    this.setState({
      companyListSelector: true,
    });
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
            <Button onClick={this.handleBatchCompany} disabled={batchCompany}>{formatMessage({id:"budget.item.batchCompany"})}</Button>
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
                      visible={companyListSelector}/>
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
