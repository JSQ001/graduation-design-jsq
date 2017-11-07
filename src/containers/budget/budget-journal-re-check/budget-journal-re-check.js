/**
 * Created by 13576 on 2017/10/20.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Tag  } from 'antd';

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SearchArea from 'components/search-area.js';

import "styles/budget/budget-journal-re-check/budget-journal-re-check.scss"


const journalTypeCode = [];

class BudgetJournalReCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params:{},
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,

      },

      searchForm: [

        {type: 'input', id: 'journalCode',
          label: this.props.intl.formatMessage({id: 'budget.journalCode'}), /*预算日记账编号*/
        },


        {type: 'select', id:'journalTypeId', label: '预算日记账类型', options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/journals/journalType/selectByInput`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'journalTypeName', valueKey: 'journalTypeId'},


        {type:'value_list',label: this.props.intl.formatMessage({id:"budget.periodStrategy"}) ,id:'periodStrategy',options: [], valueListCode: 2002},

        {type: 'select', id:'versionId', label: '预算版本', options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/versions/queryAll`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'versionName', valueKey: 'id'},
        {type: 'select', id:'structureId', label: '预算表',  options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'structureName', valueKey: 'id'},
        {type: 'select', id:'scenarioId', label: '预算场景', options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/scenarios/queryAll`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'scenarioName', valueKey: 'id'},
        {type: 'select', id:'employeeId', label: '申请人', options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/journals/selectCheckedEmp`, getParams: {},
          labelKey: 'empName', valueKey: 'empOid'},
        {type:'date',id:'createData', label: '创建时间'}

      ],

      columns: [
        {          /*预算日记账编号*/
          title: this.props.intl.formatMessage({id:"budget.journalCode"}), key: "journalCode", dataIndex: 'journalCode'
        },
        {          /*预算日记账类型*/
          title: this.props.intl.formatMessage({id:"budget.journalTypeId"}), key: "journalTypeName", dataIndex: 'journalTypeName'
        },
        {          /*编制期段*/
          title: this.props.intl.formatMessage({id:"budget.periodStrategy"}), key: "periodStrategyName", dataIndex: 'periodStrategyName',
        },
        {          /*预算表*/
          title: this.props.intl.formatMessage({id:"budget.structureName"}), key: "structureName", dataIndex: 'structureName'
        },
        {          /*预算期间*/
          title: "期间", key: "periodName", dataIndex: 'periodName',
          render(recode,text){
            switch (text.periodStrategy){
              case 'MONTH':{ return `${text.periodName?text.periodName:''}`}
              case 'QUARTER':{ return `${text.periodYear}年-${text.periodQuarterName?text.periodQuarterName:''}`}
              case 'YEAR':{ return `${text.periodYear}年`}

            }
          }
        },
        {          /*状态*/
          title: this.props.intl.formatMessage({id:"budget.status"}), key: "status", dataIndex: 'status',
          render(recode){
            switch (recode){
              case 'NEW':{ return <Tag color="#2db7f5">新建</Tag>}
              case 'SUBMIT':{ return  <Tag color="#f50">提交</Tag>}
              case 'REJECT':{ return <Tag color="#e93652">拒绝</Tag>}
              case 'CHECKED':{return <Tag color="#234234">审核</Tag>}
              case 'POSTED':{return <Tag color="#87d068">复核</Tag>}
              case 'BACKLASHSUBMIT':{return <Tag color="#871233">反冲提交</Tag>}
              case 'BACKLASHCHECKED':{return <Tag color="#823344">反冲审核</Tag>}
            }
          }
        },
      ],

      budgetJournalDetailReCheckDetailPage: menuRoute.getRouteItem('budget-journal-re-check-detail','key'),    //预算日记账复核详情
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount(){
    this.getList();
  }


//获取复核
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/headers?page=${this.state.pagination.page}&size=${this.state.pagination.pageSize}&journalTypeId=${this.state.params.journalTypeId||''}&journalCode=${this.state.params.journalCode||''}&periodStrategy=${this.state.params.periodStrategy||''}&structureId=${this.state.params.structureId||''}&versionId=${this.state.params.versionId||''}&scenarioId=${this.state.params.scenarioId||''}&createDate=${this.state.params.createData||''}&empId=${this.state.params.employeeId||''}`).then((response)=>{
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

      })
    })
  }

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

  //点击搜搜索
  handleSearch = (values) =>{
    values.createData;

    const valuesData={
      ...values,
      "createData":values['createData']?values['createData'].format('YYYY-MM-DD'):'',
    }
    console.log(valuesData);
    this.setState({
      params:valuesData,
    },()=>{
      this.getList()
    })
  };

  //新建
  handleCreate = () =>{
    let path=this.state.newBudgetJournalDetailPage.url;
    this.context.router.push(path)
  };

  //跳转到详情
  HandleRowClick=(value)=>{
    console.log(value);
    const journalCode =value.journalCode;

    let path=this.state.budgetJournalDetailReCheckDetailPage.url.replace(":journalCode",journalCode);
    this.context.router.push(path);
    //budgetJournalDetailSubmit

  }

  render(){
    const { loading, searchForm ,data, selectedRowKeys, pagination, columns, batchCompany} = this.state;
    const {organization} =this.props.organization;
    return (
      <div className="budget-journal">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered
          onRowClick={this.HandleRowClick}
          rowKey={record=>record.id}
        />
      </div>
    )
  }

}

BudgetJournalReCheck.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalReCheck));
