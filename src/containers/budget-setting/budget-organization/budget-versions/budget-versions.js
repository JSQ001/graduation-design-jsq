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
import {Button,Table,Badge,Popconfirm,Form,DatePicker,Col,Row,Switch,notification,Icon} from 'antd'
import SearchArea from 'components/search-area'
import 'styles/budget/budget-versions/budget-versions.scss'
const FormItem = Form.Item;

class BudgetVersions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      Loading: true,
      Data: [],
      columns: [
        {title:'预算组织',dataIndex:'organizationId',key:'organizationId',render:(recode)=>{return <div> {this.props.organization.organizationName}</div> } },
        {title: '预算版本代码', dataIndex: 'versionCode', key: 'versionCode',},
        {title: '预算版本名称', dataIndex: 'versionName', key: 'versionName',},
        {title: '版本日期', dataIndex: 'versionDate', key: 'versionDate',},
        {title: '预算版本描述', dataIndex: 'description', key: 'description',render:(recode)=>{return <div>{recode?recode:'-'}</div>}},
        {title: '版本状态', dataIndex: 'status', key: 'status', render: (recode) => { return <div>{ recode=="NEW"?"新建":(recode="CURRENT"?"当前":"历史")}</div>}},
        {title: '状态',dataIndex: 'isEnabled', key: 'isEnabled',
          render: (recode,text) => {
            return (
              <div >
                <Popconfirm placement="top" title={recode?"确定禁用":"确定禁用"} onConfirm={(recode,text)=>(this.editEnabledHandle)} okText="确定" cancelText="取消">
                  <Badge status={ recode?"success":"error"}/>
                  {recode?"启用":"禁用"}
                </Popconfirm>
              </div>
            );}
        },

      ],
      form: {
        name: '',
        enabled: true
      },
      searchForm: [
        {type: 'input', id: 'versionCode', label: '预算版本代码'},
        {type: 'input', id: 'versionName', label: '预算版本名字'},
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
      newData:{versionCode:''},
      NewBudgetVersionsPage:menuRoute.getRouteItem('new-budget-versions','key')


    };

  }


  //编辑是否启用
  editEnabledHandle=(recode,text)=>{

    text.isEnabled=!recode;
    this.putData(text);
    this.getList();
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

  //修改数据
  putData=(value)=>{
    return httpFetch.put(`${config.budgetUrl}/api/budget/versions`,value).then((response)=>{
      this.setState({
        putFlag:true
      })
    });
  }


  //获得数据
  getList(){
    return httpFetch.get(`${config.budgetUrl}/api/budget/versions/query?organizationId=${this.props.id}&page=${this.state.page}&size=${this.state.pageSize}`, ).then((response)=>{
      response.data.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager
        }
      })
    });
  }

  //获得搜索数据
  searchGetList(){
    return httpFetch.
    get(`${config.budgetUrl}/api/budget/versions/query?
    organizationId=${this.props.id}page=${this.state.page}&size=${this.state.pageSize}&versionCode=${this.state.searchParams.versionCode||''}&versionName=${this.state.searchParams.versionName||''}`, ).
    then((response)=>{
      response.data.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager
        }
      })
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
      page: 0
    }, ()=>{
      this.searchGetList();
    })

  }

  //清空搜索区域
  clear=()=>{
    this.setState({searchParams: {
      versionCode:'',
      versionName:'',
    }})
  }

  searchEventHandle=()=> {

  }


//跳转到新建页面
  createHandle=()=>{
    let path=this.state.NewBudgetVersionsPage.url.replace(':id',this.props.id);
    this.context.router.push(path)
  }



  render(){
    const {columns,data ,pagination,searchForm,Loading,redirect,BudgetVersionsPage} =this.state
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
          <div className="table-header-title">{`共 ${this.state.pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary"  onClick={this.createHandle}>新建</Button>
          </div>
        </div>

        <div className="Table-div">
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            Loading={Loading}
            bordered
            size="middle"
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
