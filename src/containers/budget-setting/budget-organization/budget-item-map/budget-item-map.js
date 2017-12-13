/**
 * created by jsq on 2017/11/25
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select, Popover, Badge, message, Form, Spin, Popconfirm} from 'antd';
import SearchArea from 'components/search-area.js';
import Chooser from 'components/chooser'
import "styles/budget-setting/budget-organization/budget-item-map/budget-item-map.scss"
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import selectorData from 'share/selectorData'
import Importer from 'components/importer'

const FormItem = Form.Item;
const Option = Select.Option;

class BudgetItemMap extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      params: [],
      paramsKey:0,
      sourceType: [],
      searchParams:{
        sourceType: "",
        itemId: "",
      },
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
      },
      paramValueMap:{},
      searchForm: [
        {type: 'select', options: [], id: 'sourceType', label: this.props.intl.formatMessage({id: 'itemMap.sourceType'}) }, /*来源类别*/
        {type: 'select', id: 'itemId',options:[], labelKey: 'itemName',valueKey: 'id',
          label: formatMessage({id: 'budget.item'}),  /*预算项目*/
          listExtraParams:{organizationId: this.props.id},
          getUrl: `${config.budgetUrl}/api/budget/items/find/all`, method: 'get', getParams: {organizationId: this.props.id, isEnabled: true}
        },
      ],
      columns: [
        {          /*来源类别*/
          title: formatMessage({id:"itemMap.sourceType"}), key: "sourceType", dataIndex: 'sourceType',render: (text, record, index) => this.renderColumns(text, record,index, 'sourceType')
        },
        {          /*明细类型*/
          title: formatMessage({id:"itemMap.detailType"}), key: "sourceItemName", dataIndex: 'sourceItemName',render: (text, record, index) => this.renderColumns(text, record,index, 'detail')
        },
        {          /*预算项目*/
          title: formatMessage({id:"budget.item"}), key: "budgetItemName", dataIndex: 'budgetItemName',render: (text, record, index) => this.renderColumns(text, record,index, 'item')
        },                            //操作
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={record.edit ? (e)=>this.saveItem(e,record,index) :(e) => this.operateItem(e, record,index,true)}>{formatMessage({id: record.edit ? "common.save":"common.edit"})}</a>
            {record.edit ?
              <a href="#" style={{marginLeft: 12}}
                onClick={(e) => this.operateItem(e, record, index, false)} >{ formatMessage({id: "common.cancel" })}</a>
              :
              <Popconfirm onConfirm={(e) => this.deleteItem(e, record,index)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
                <a href="#" style={{marginLeft: 12}}>{ formatMessage({id: "common.delete"})}</a>
              </Popconfirm>

            }
          </span>)
        },
      ],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  //保存
  saveItem = (e, record,index)=>{
    e.preventDefault();
    e.stopPropagation();
    if(record.sourceType !=="" && typeof record.budgetItemId !== 'undefined' && typeof record.sourceItemId !== 'undefined') {
      httpFetch.post(`${config.budgetUrl}/api/budget/itemsMapping/insertOrUpdate`, [record]).then((response) => {
        message.success(`${this.props.intl.formatMessage({id: "common.save.success"}, {name: ""})}`);
        this.setState({
          loading: true
        }, this.getList())
      }).catch((e) => {
        if (e.response) {
          message.error(`${this.props.intl.formatMessage({id: "common.save.filed"})}, ${e.response.data.message}`)
        }
      })
    }else {
      if(typeof record.id === 'undefined'){
        let params = this.state.params;
        params.delete(params[index])
        this.setState({params});
        return
      }
    }
  };

  operateItem = (e,record,index,flag)=>{
    e.preventDefault();
    e.stopPropagation();
    let params = this.state.params;
    if(!flag){
      if(typeof record.id === 'undefined'){
        params.delete(params[index])
        this.setState({params});
        return
      }
    }
    params[index].edit = flag;
    this.setState({
      params
    });
  };

  //删除
  deleteItem = (e, record,index)=>{
    e.preventDefault();
    e.stopPropagation();
    let param = [record.id];
    httpFetch.delete(`${config.budgetUrl}/api/budget/itemsMapping/deleteByIds`,param).then((response)=>{
      message.success(`${this.props.intl.formatMessage({id:"common.operate.success"})}`)
      this.getList();
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})},${e.response.data.message}`)
      }
    })
  };

  componentWillMount(){
    const {formatMessage} = this.props.intl;
    this.getList();

    let itemSelectorItem = selectorData['budget_item'];
    let key = itemSelectorItem.searchForm[1].getUrl.split("?").length
    if(key < 2){
      itemSelectorItem.searchForm[1].getUrl += `?organizationId=${this.props.organization.id}&isEnabled=${true}`;
      itemSelectorItem.searchForm[2].getUrl += `?organizationId=${this.props.organization.id}&isEnabled=${true}`;
    }

    let paramValueMap = {
      EXPENSE_TYPE:{
        title: formatMessage({id:"itemMap.expenseType"}),
        url: `${config.baseUrl}/api/company/integration/expense/types/and/name`,
        searchForm: [
          {type: 'input', id: 'name', label: formatMessage({id:"itemMap.expenseTypeName"})},
        ],
        columns: [
          {title: formatMessage({id:"itemMap.icon"}), dataIndex: 'iconURL', width: '25%',
            render: (value) =>{
                return <img src={value} height="20" width="20"/>
            }
          },
          {title: formatMessage({id:"itemMap.expenseTypeName"}), dataIndex: 'name', width: '25%'},
          {title: formatMessage({id:"common.column.status"}), dataIndex: 'enabled', width: '25%',
            render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )},
        ],
        key: 'id'
      },
    };
    this.setState({paramValueMap});
    //获取来源类别值列表
    this.getSystemValueList(2027).then((response)=>{
      let sourceType = [];
      response.data.values.map((item)=>{
        let option = {
          value: item.code,
          label: item.messageKey
        };
        sourceType.push(option)
      });
      let searchForm = this.state.searchForm;
      searchForm[0].options = sourceType;
      this.setState({
        searchForm,
        sourceType
      })
    });
  }

  //获取预算项目映射数据
  getList(){
    let params = this.state.searchParams;
    let url = `${config.budgetUrl}/api/budget/itemsMapping/selectByInput?sourceType=${params.sourceType}&itemId=${params.itemId}&page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}`;
    for(let paramsName in params){
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    httpFetch.get(url).then((response)=>{
      let paramsKey = this.state.paramsKey;
      response.data.map((item,index)=>{
        item.key = paramsKey++;
        item.edit = false;
        item.item = [{id: item.budgetItemId, itemName: item.budgetItemName}];
        item.detail = [{id: item.sourceItemId, name: item.sourceItemName}]
      });
      let pagination = this.state.pagination;
      pagination.total = Number(response.headers['x-total-count']);
      this.setState({
        pagination,
        loading: false,
        params: response.data,
        paramsKey
      })
    })
  }


  handleSearch = (values) =>{
    let searchParams = this.state.searchParams;
    searchParams.sourceType = values.sourceType===undefined ? "" : values.sourceType;
    searchParams.itemId = values.itemId === undefined ? "" : values.itemId;
    this.setState({
      searchParams,
      loading: true
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

  //修改来源类型
  handleChangeType = (value, index) => {
    let { params } = this.state;
    params[index].sourceType = value;
    params[index].detail = [];
    this.setState({ params });
  };

  //选择费用类型
  handleChangeExpenseType = (value, index) => {
    const {params} = this.state;
    params[index].detail = value;
    params[index].sourceItemId = value[0].id;
    this.setState({params})
  };

  //申请类型
  handleChangeAppType = ()=>{};

  //选择项目
  handleChangeItem = (value, index) => {
    let { params } = this.state;
    params[index].item = value;
    params[index].budgetItemId = value[0].id;
    this.setState({ params });
  };

  renderColumns = (decode, record,index, dataIndex) => {
    const { paramValueMap,sourceType } = this.state;
    if( record.edit){
      switch(dataIndex){
        case 'sourceType':{
          return (
            <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                    onChange={(value) => this.handleChangeType(value, index)}
                    value={record.sourceType}
                    notFoundContent={<Spin size="small" />}>
              {sourceType.map((option)=>{
                return <Option key={option.value}>{option.label}</Option>
              })}
            </Select>
          );
        }
        case 'detail':{
          if(record.sourceType === 'EXPENSE_TYPE'){
            return (
              <Chooser
                onChange={(value) => this.handleChangeExpenseType(value, index)}
                labelKey='name'
                valueKey='id'
                itemMap={true}
                selectorItem={paramValueMap[record.sourceType]}
                listExtraParams={{}}
                value={record.detail}
                single={true}/>
            );
          }else {
            if (record.sourceType === 'APPLICATION_TYPE'){
              return (
                <Chooser
                  onChange={(value) => this.handleChangeAppType(value, index)}
                  type='cost_type'
                  labelKey='itemName'
                  valueKey='id'
                  listExtraParams={{organizationId: this.props.organization.id}}
                  value={record.item}
                  single={true}/>
              );
            }else
              return <Select disabled/>;
          }
        }
        case 'item':{

          return(
              <Chooser
                onChange={(value) => this.handleChangeItem(value, index)}
                type='budget_item'
                labelKey='itemName'
                valueKey='id'
                itemMap={true}
                listExtraParams={{organizationId: this.props.id}}
                value={record.item}
                single={true}/>)
        }
      }
    }else {
      switch (dataIndex){
        case 'sourceType':  return decode === "EXPENSE_TYPE" ? "费用类型" : "申请类型";break;
        case 'detail': return record.sourceItemName ? record.sourceItemName : '-';break;
        case 'item': return record.budgetItemName;break
      }
    }
  };

  handleAdd = ()=>{
    let { params, paramsKey } = this.state;
    let newParams = {sourceType: '', detail: [], item: [], key: paramsKey++, edit: true};
    let array=[];
    array.push(newParams);
    let newArray =  array.concat(params);
    this.setState({ params: newArray,paramsKey});
  };

  handleSave = () =>{
    let params = this.state.params;
    httpFetch.post(`${config.budgetUrl}/api/budget/itemsMapping/insertOrUpdate`,params).then((response)=>{
      message.success(`${this.props.intl.formatMessage({id: "common.save.success"},{name:""})}`);
      this.setState({
       loading: true
      },this.getList())
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.message}`)
      }
    })
  };

  render(){
    const { loading, searchForm ,params, selectedRowKeys, pagination, columns, } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div className="budget-item-map">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleAdd}>{formatMessage({id: 'common.add'})}</Button>  {/*添加*/}
            <Importer title="预算项目映射导入"
                      templateUrl={`${config.budgetUrl}/api/budget/reserve/adjust/import`}
                      uploadUrl={`${config.budgetUrl}/api/budget/reserve/adjust/import`}
                      errorUrl={`${config.budgetUrl}/api/budget/reserve/adjust/import/failed/export`}
                      fileName="预算占用调整导入文件"
                      onOk={this.handleImportOk}/>
            <Button type="primary" onClick={this.handleSave}>{formatMessage({id: 'common.save'})}</Button>  {/*添加*/}
          </div>
        </div>
        <Form
          className="ant-advanced-search-form">
          <Table
            dataSource={params}
            columns={columns}
            loading={loading}
            onChange={this.onChangePager}
            pagination={pagination}
            size="middle"/>
        </Form>
      </div>
    )
  }

}
BudgetItemMap.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.login.organization,
    company: state.login.company,
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetItemMap));
