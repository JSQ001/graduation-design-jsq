/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import {Link,Redirect,browserHistory,History} from 'react-router'
import {Button,Table,Badge,Popconfirm,Form,message,DatePicker,Col,Row,Switch,notification,Icon} from 'antd'
import SearchArea from 'components/search-area'
import 'styles/budget-setting/budget-organization/budget-versions/budget-versions.scss'
const FormItem = Form.Item;

class BudgetVersions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      columns: [
        {title: this.props.intl.formatMessage({id:"budget.organization"}),dataIndex:'organizationId',key:'organizationId',render:(recode)=>{return <span> {this.props.organization.organizationName}</span> } },
        {title: this.props.intl.formatMessage({id:"budget.versionCode"}), dataIndex: 'versionCode', key: 'versionCode',},
        {title:  this.props.intl.formatMessage({id:"budget.versionName"}), dataIndex: 'versionName', key: 'versionName',},
        {title:  this.props.intl.formatMessage({id:"budget.versionDate"}), dataIndex: 'versionDate', key: 'versionDate',},
        {title: this.props.intl.formatMessage({id:"budget.description"}), dataIndex: 'description', key: 'description',render:(recode)=>{return <span>{recode?recode:'-'}</span>}},
        {title:  this.props.intl.formatMessage({id:"budget.status"}), dataIndex: 'status', key: 'status', render: (recode) => { return <div>{ recode=="NEW"?this.props.intl.formatMessage({id:"budget.new"}):(recode="CURRENT"?this.props.intl.formatMessage({id:"budget.current"}):this.props.intl.formatMessage({id:"budget.history"}))}</div>}},
        {title:  this.props.intl.formatMessage({id:"budget.isEnabled"}),dataIndex: 'isEnabled', key: 'isEnabled',
          render: (recode,text) => {
            return (
              <div >
                  <Badge status={ recode?"success":"error"}/>
                  {recode? this.props.intl.formatMessage({id:"common.status.enable"}): this.props.intl.formatMessage({id:"common.status.disable"})}
              </div>
            );}
        },

      ],
      form: {
        name: '',
        enabled: true
      },
      searchForm: [
        {type: 'input', id: 'versionCode', label: this.props.intl.formatMessage({id:"budget.versionCode"})},
        {type: 'input', id: 'versionName', label: this.props.intl.formatMessage({id:"budget.versionName"})},
      ],
      pageSize: 10,
      page:0,
      pagination: {
        total: 0
      },
      searchParams:{
        versionCode:'',
        versionName:'',
      },
      redirect:true,
      loading:true,
      newData:{versionCode:''},
      newBudgetVersionsPage:menuRoute.getRouteItem('new-budget-versions','key'),
      budgetVersionsDetailDetailPage: menuRoute.getRouteItem('budget-versions-detail','key'),    //预算版本详情的页面项


    };

  }



  //显示新建
  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  //一开始就显示数据
  componentWillMount(){
    this.getList();
  }

  //获得数据
  getList(){
    httpFetch.get(`${config.budgetUrl}/api/budget/versions/query?organizationId=${this.props.organization.id}&page=${this.state.page}&size=${this.state.pageSize}&versionCode=${this.state.searchParams.versionCode||''}&versionName=${this.state.searchParams.versionName||''}`, ).then((response)=>{
      response.data.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize,
          current: this.state.page + 1
        }
      })
    }).catch(e=>{
      message.error(e.response.data.validationErrors[0].message)
    });
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

  //搜索
  search=(result)=>{
    let searchParams={
      versionCode:result.versionCode,
      versionName:result.versionName,
    }

    this.setState({
      searchParams:searchParams,
      loading: true,
      page: 0,
      current:1
    }, ()=>{
      this.getList();
    })

  }

  //清空搜索区域
  clear=()=>{
    this.setState({searchParams: {
      versionCode:'',
      versionName:'',
    }})
  }

//跳转到新建页面
  createHandle=()=>{
    let path=this.state.newBudgetVersionsPage.url.replace(':id',this.props.id);
    this.context.router.push(path)
  }

  //跳转到详情
  ToDetailHandle=(recode)=>{
    let path = this.state.budgetVersionsDetailDetailPage.url.replace(":id", this.props.organization.id).replace(":versionId", recode.id)
    this.context.router.replace(path)
  }



  render(){
    const {columns,data ,pagination,searchForm,loading} =this.state
    return (
      <div className="budget-versions">
        <div className="search-from">
          <SearchArea
            searchForm={searchForm}
            submitHandle={this.search}
            clearHandle={this.clear}
            eventHandle={this.searchEventHandle}/>
        </div>

        <div className="table-header">
          <div className="table-header-title"> {this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>
          <div className="table-header-buttons">
            <Button type="primary"  onClick={this.createHandle}>{this.props.intl.formatMessage({id:"common.create"})}</Button>
          </div>
        </div>

        <div className="Table-div">
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={this.state.loading}
            bordered
            size="middle"
            onRowClick={this.ToDetailHandle}
          />
        </div>

      </div>
    )
  }

}

BudgetVersions.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetVersions));
