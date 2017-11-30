/**
 * created by jsq on 2017/11/25
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select, Popover, Badge, message, Form, Spin } from 'antd';
import SearchArea from 'components/search-area.js';
import Chooser from 'components/chooser'
import "styles/budget-setting/budget-organization/budget-item-map/budget-item-map.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import ListSelector from 'components/list-selector'

const FormItem = Form.Item;
const Option = Select.Option;

class BudgetItem extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      params: [],
      paramsKey:0,
      sourceTypeArray: [
        {label: "申请类型", value: "appType"},
        {label: "费用类型", value:"expenseType"}
      ],
      searchParams:{
        sourceType: "",
        itemId: "",
      },
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'input', id: 'itemCode', label: this.props.intl.formatMessage({id: 'itemMap.sourceType'}) }, /*来源类别*/
        {type: 'select', id: 'budgetItemName',options:[], labelKey: 'itemName',valueKey: 'itemTypeId',
          label: formatMessage({id: 'budget.item'}),  /*预算项目*/
          listExtraParams:{organizationId: this.props.id},
          getUrl: `${config.budgetUrl}/api/budget/items/find/all`, method: 'get', getParams: {organizationId: this.props.organization.id}
        },
      ],
      columns: [
        {          /*来源类别*/
          title: formatMessage({id:"itemMap.sourceType"}), key: "sourceType", dataIndex: 'sourceType',render: (text, record, index) => this.renderColumns(index, 'sourceType')
        },
        {          /*明细类型*/
          title: formatMessage({id:"itemMap.detailType"}), key: "detailType", dataIndex: 'detailType',render: (text, record, index) => this.renderColumns(index, 'detail')
        },
        {          /*预算项目*/
          title: formatMessage({id:"budget.item"}), key: "itemTypeName", dataIndex: 'itemTypeName',render: (text, record, index) => this.renderColumns(index, 'item')
        },
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount(){
    this.getList();
    let paramValueMap = {
      'cost_type': {
        listType: 'cost_type',
        labelKey: 'itemTypeName',
        valueKey: 'id',
        codeKey: 'itemTypeCode',
        listExtraParams: {},
        selectorItem: undefined
      },
      'BUDGET_ITEM_GROUP': {
        listType: 'budget_item_group',
        labelKey: 'itemGroupName',
        valueKey: 'id',
        codeKey: 'itemGroupCode',
        listExtraParams: {},
        selectorItem: undefined
      },
      'BUDGET_ITEM': {
        listType: 'budget_item',
        labelKey: 'itemName',
        valueKey: 'id',
        codeKey: 'itemCode',
        listExtraParams: {},
        selectorItem: {}
      },
    };
  }

  //获取预算项目数据
  getList(){
    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/itemsMapping/selectByInput?sourceType=${params.sourceType}&itemId=${params.itemId}&page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      response.data.map((item,index)=>{
        item.key = item.id;
      });

    })
  }

  handleSearch = (values) =>{
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

  //修改来源类型
  handleChangeType = (value, index) => {
    let { params } = this.state;
    console.log(value)
    params[index].sourceType = value;
    this.setState({ params });
  };

  //选择费用类型
  handleChangeExpenseType = (value, index) => {
    console.log(value)
    const {params} = this.state;
    params[index].detail = value;
    this.setState({params})
  };

  //选择项目类型
  handleChangeItem = (value, index) => {
    console.log(value)
    let { params } = this.state;
    params[index].item = value;
    params[index].budgetItemId = value[0].id;
    this.setState({ params });
  };

  renderColumns = (index, dataIndex) => {
    const { sourceTypeArray, params } = this.state;
    switch(dataIndex){
      case 'sourceType':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={(value) => this.handleChangeType(value, index)}
                  value={params[index].sourceType}
                  notFoundContent={<Spin size="small" />}>
            {sourceTypeArray.map((option)=>{
              return <Option key={option.value}>{option.label}</Option>
            })}
          </Select>
        );
      }
      case 'detail':{
        let disabled = !params[index].sourceType;
        console.log(params[index])
        console.log(params[index].sourceType)
        if(params[index].sourceType === 'expenseType'){
          return (
            <Chooser
              onChange={(value) => this.handleChangeExpenseType(value, index)}
              type='expense_type'
              labelKey='name'
              valueKey='expenseTypeOID'
              listExtraParams={{roleType: 'TENANT', setOfBooksId: this.props.company.setOfBooksId}}
              value={params[index].detail}
              single={true}/>
          );
        }else {
          if (params[index].sourceType === 'appType'){
            return (
              <Chooser
                onChange={(value) => this.handleChangeExpenseType(value, index)}
                type='cost_type'
                labelKey='itemName'
                valueKey='itemCode'
                listExtraParams={{organizationId: this.props.organization.id}}
                value={params[index].item}
                single={true}/>
            );
          }else
            return <Select disabled/>;
        }
      }
      case 'item':{
        return <Chooser
                  onChange={(value) => this.handleChangeItem(value, index)}
                  type='budget_item'
                  labelKey='itemName'
                  valueKey='itemCode'
                  listExtraParams={{organizationId: this.props.organization.id}}
                  value={params[index].item}
                  single={true}/>;
      }
    }
  };

  handleAdd = ()=>{
    let { params, paramsKey } = this.state;
    let newParams = {sourceType: '', detail: [], item: [], key: paramsKey};
    params.push(newParams);
    paramsKey++;
    this.setState({ params, paramsKey});
  };

  handleSave = () =>{
    let params = this.state.params;
    httpFetch.post(`${config.budgetUrl}/api/budget/itemsMapping/insertOrUpdate`,params).then((response)=>{
      console.log(response)
    }).catch((e)=>{
      if(e.response){
        e.error(``)
      }
    })
  };

  render(){
    const { loading, searchForm ,params, selectedRowKeys, pagination, columns, batchCompany, companyListSelector} = this.state;
    const { formatMessage } = this.props.intl;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };
    return (
      <div className="budget-item-map">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>EXCEL导入</Button>
            <Button type="primary" onClick={this.handleAdd}>{formatMessage({id: 'common.add'})}</Button>  {/*添加*/}
            <Button type="primary" onClick={this.handleSave}>{formatMessage({id: 'common.save'})}</Button>  {/*添加*/}
          </div>
        </div>
        <Form
          className="ant-advanced-search-form">
          <Table
            dataSource={params}
            columns={columns}
            pagination={pagination}
            size="middle"
            bordered/>
        </Form>

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
