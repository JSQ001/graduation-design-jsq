import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select ,Tag,Badge} from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SearchArea from 'components/search-area.js';
import "styles/budget/budget-journal/budget-journal.scss"


class BudgetJournal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params:{},
      organization:{},
      pagination: {
        total:0,
      },
      page:0,
      pageSize:10,
      showUpdateSlideFrame:false,
      showCreateSlideFrame:false,
      searchForm: [

        {type: 'select', id:'journalTypeId', label: '预算日记账类型', options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/journals/journalType/selectByInput`, getParams: {organizationId:this.props.organization.id},
          labelKey: 'journalTypeName', valueKey: 'id'},

        {type: 'input', id: 'journalCode',
          label: this.props.intl.formatMessage({id: 'budget.journalCode'}), /*预算日记账编号*/
        },
        {type:'value_list',label: this.props.intl.formatMessage({id:"budget.periodStrategy"}) ,id:'periodStrategy', options: [], valueListCode: 2002},

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
          render(recode,text){
            switch (recode){
              case 'NEW':{ return <Badge status="processing" text={text.statusName} />}
              case 'SUBMIT':{ return   <Badge status="warning" text={text.statusName} />}
              case 'SUBMIT_RETURN':{return <Badge status="default" color="#dd12333" text={text.statusName}/> }
              case 'REJECT':{ return  <Badge status="error" text={text.statusName} />}
              case 'CHECKED':{return < Badge status="default" color="#234234" text={text.statusName}/>}
              case 'CHECKING':{return <Badge  status="default" color="#ffdd44" text={text.statusName}/>}
              case 'POSTED':{return <Badge status="default"  color="#87d068" text={text.statusName}/>}
              case 'BACKLASH_SUBMIT':{return <Badge status="default" color="#871233" text={text.statusName}/>}
              case 'BACKLASH_CHECKED':{return <Badge status="default" color="#823344" text={text.statusName}/>}
            }
          }

    },
  ],
      newBudgetJournalDetailPage: menuRoute.getRouteItem('new-budget-journal','key'),    //新建预算日记账的页面项
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail','key'),    //预算日记账详情
      budgetJournalDetailSubmit: menuRoute.getRouteItem('budget-journal-detail-submit','key'),
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount(){
    this.getList();
  }



  //获取预算日记账数据
  getList(){
    this.setState({
      loading:true,
    })

    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/headers/byInput?page=${this.state.page}&size=${this.state.pageSize}&journalTypeId=${this.state.params.journalTypeId||''}&journalCode=${this.state.params.journalCode||''}&periodStrategy=${this.state.params.periodStrategy||''}`).then((response)=>{

      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']) ? Number(response.headers['x-total-count']) : 0,
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
    })
  }

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  //点击搜搜索
  handleSearch = (values) =>{
    console.log(values);

    this.setState({
      params:values,
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
    if(value.status=="NEW" || value.status=="REJECT"){
      let path=this.state.budgetJournalDetailPage.url.replace(":journalCode",journalCode);
      this.context.router.push(path);
    }else {
      let path=this.state.budgetJournalDetailSubmit.url.replace(":journalCode",journalCode);
      this.context.router.push(path);
    }


  }

  render(){
    const { loading, searchForm ,data, selectedRowKeys, pagination, columns, batchCompany} = this.state;
    const organization =this.props.organization;
    return (
      <div className="budget-journal">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered
          onRowClick={this.HandleRowClick}
        />
      </div>
    )
  }

}

BudgetJournal.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetJournal));
