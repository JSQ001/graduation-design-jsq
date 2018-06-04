/**
 * Created by jsq on 2018/5/2.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Popconfirm, Pagination} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import menuRoute from 'routes/menuRoute'
import NewDepartmentManage from 'containers/department-manage/new-department-manage'
const FormItem = Form.Item;

class DepartmentManage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      showSlideFrame: false,
      searchParams:{},
      title: '新建系部',
      deptDetail: {},
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'input', id: 'deptCode', label: '系部代码'},
        {type: 'input', id: 'deptName', label: '系部姓名' },
      ],
      columns: [
        {
          title: '系部代码', key: "deptCode", dataIndex: 'deptCode'
        },
        {
          title: '系部名称', key: "deptName", dataIndex: 'deptName',
        },
        {
          title: '成立时间', key: "createdDate", dataIndex: 'createdDate'
        },
        {
          title: '状态', key: 'status', width: '10%', dataIndex: 'enabled',
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
                   text={enabled ? '启用' : '禁用'} />
          )
        },
        {title: "操作", key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <a href="#" onClick={(e) => this.edit(e, record)} style={{marginLeft: 12}}>编辑</a>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title="确认删除？">
              <a href="#" style={{marginLeft: 12}}>删除</a>
            </Popconfirm>
          </span>)},
      ],
    }
  }

  edit = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      deptDetail: record,
      title: '系部详情',
      showSlideFrame: true
    })
  };

  deleteItem =(e, record)=>{
    httpFetch.delete(`${config.baseUrl}/api/department/${record.id}`).then(res=>{
      message.success("删除成功");
      this.getList()
    })
  };

  componentWillMount(){
    this.getList();
  }


  handleSearch = (values)=>{
    this.setState({
      searchParams: values
    },()=>{
      this.getList()
    })
  };

  getList(){
    this.setState({loading:true});
    let params = Object.assign({}, this.state.searchParams);
    const {pagination} = this.state;
    for(let paramsName in params){
      !params[paramsName] && delete params[paramsName];
    }
    params.page = pagination.page;
    params.size = pagination.pageSize;
    httpFetch.get(`${config.baseUrl}/api/department/search`,params).then(response=>{
      pagination.total = Number(response.headers['x-total-count']);
      this.setState({
        pagination,
        loading: false,
        data: response.data
      })
    })
  }

  onCancel = ()=>{
    this.props.form.resetFields()
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

  //新建
  handleCreate = () =>{
    this.setState({
      showSlideFrame: true
    })
  };

  handleCloseSlide = (success) => {
    success && this.getList();
    this.setState({showSlideFrame : false});
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination ,data, columns, showSlideFrame, title, deptDetail} = this.state;
    return (
      <div className="teacher-info">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
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
        <SlideFrame title={title}
                    show={showSlideFrame}
                    content={NewDepartmentManage}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={deptDetail}/>
      </div>)
  }
}
DepartmentManage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(DepartmentManage));
