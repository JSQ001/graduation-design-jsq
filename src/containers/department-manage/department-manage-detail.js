/**
 *  crated by jsq on 2018/5/3
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import menuRoute from 'routes/menuRoute'
import { Form, Button, Select, Icon, Table, message, Popconfirm, Pagination  } from 'antd'
import SlideFrame from 'components/slide-frame'
import SearchArea from 'components/search-area'
import httpFetch from 'share/httpFetch'
import NewClass from 'containers/department-manage/new-class'
import config from 'config'
const FormItem = Form.Item;
const Option = Select.Option;

class DepartmentManageDetail extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      buttonLoading: false,
      data: [],
      slideFrameTitle: "新建班级",
      showSlideFrame: false,
      classDetail: {},
      searchParams:{},
      pagination: {
        current:0,
        page: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      searchForm: [
        {type: 'select', id: 'deptId', label: '系部', options: [],
          event: 'deptId',
          labelKey: 'deptName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/department/search`, method: 'get',
        },
        {type: 'input', id: 'className', label: '班级名称' },
      ],
      columns: [
        {
          title: '年级', key: "grade", dataIndex: 'grade',
        },
        {
          title: '班级', key: "className", dataIndex: 'className',
        },
        {
          title: '人数', key: "classCount", dataIndex: 'classCount',
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '8%', render: (text, record) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title="确认删除？">
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
            <a href="#" onClick={(e) => this.detail(e, record)} style={{marginLeft: 12}}>详情</a>
          </span>)},  //操作
      ]
    }
  }

  detail = (e,record) =>{
    record.hasInit = false;
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: '班级详情',
      classDetail: record
    })
  };

  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/class/delete/${record.id}`).then(response=>{
      this.getList()
    })
  };

  componentWillMount(){
    this.getList();
  }

  handleChange = (e)=>{
    this.setState({
      buttonLoading: false,
    })
  };

  showSlideCreate = (flag) => {
    this.setState({
      showSlideFrame: flag,
      classDetail: {deptId:this.props.params.id}
    })
  };

  handleCloseSlideCreate = (params) => {
    if(params) {
      this.setState({
        loading: true,
        showSlideFrame: false
      },()=>this.getList());
    }
  };

  handleSearch = (values) =>{
    this.setState({
      searchParams: values
    },()=>{
      this.getList()
    })
  };

  getList(){
    this.setState({loading:true});
    const {pagination} = this.state;
    let params = Object.assign({}, this.state.searchParams);
    for(let paramsName in params){
      !params[paramsName] && delete params[paramsName];
    }
    params.page = pagination.page;
    params.size = pagination.pageSize;
    httpFetch.get(`${config.baseUrl}/api/class/search`,params).then(response=>{
      console.log(response)
      pagination.total = Number(response.headers['x-total-count']);
      this.setState({
        pagination,
        data: response.data,
        loading: false
      })
    })
  }


  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetOrganizationDetail.url.replace(':id', this.props.params.id)+ '?tab=RULE');
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      loading: true,
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  render(){
    const { loading, searchForm, data, classDetail, pagination, columns,  showSlideFrame,slideFrameTitle} = this.state;
    return(
      <div className="budget-control-rules-detail">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button onClick={()=>this.showSlideCreate(true)} type="primary" >{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>{this.props.intl.formatMessage({id:"common.back"})}</a>

        <SlideFrame title= {slideFrameTitle}
                    show={showSlideFrame}
                    content={NewClass}
                    afterClose={this.handleCloseSlideCreate}
                    onClose={() => this.showSlideCreate(false)}
                    params={classDetail}/>
      </div>
    )
  }
}

DepartmentManageDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

const WrappedBudgetControlRulesDetail = Form.create()(DepartmentManageDetail);

export default connect(mapStateToProps)(injectIntl(DepartmentManageDetail));
