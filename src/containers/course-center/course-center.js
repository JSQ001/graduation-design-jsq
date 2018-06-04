/**
 * Created by jsq on 2018/5/2.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Popconfirm} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import NewCourse from 'containers/course-center/new-course'
import menuRoute from 'routes/menuRoute'
const FormItem = Form.Item;

class CourseCenter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      courseDetail: {},
      showSlideFrame: false,
      title: '添加课程',
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'input', id: 'courseNumber', label: '课程号'},
        {type: 'input', id: 'courseName', label: '课程名称' },
        {type: 'input', id: 'teacherId', label: '讲师' },
      ],
      columns: [
        {
          title: '课程号', key: "courseNumber", dataIndex: 'courseNumber'
        },
        {
          title: '课程类型', key: "courseType", dataIndex: 'courseType',
          render: desc => {
            switch (desc){
              case 'common': return '公共课'; break;
              case 'pre': return '专业课'; break;
              case 'select': return '选修课'; break;
            }
          }
        },
        {
          title: '课程名称', key: "courseName", dataIndex: 'courseName'
        },
        {
          title: '讲师', key: "teacherName", dataIndex: 'teacherName'
        },
        {
          title: '操作', key: 'operate',
          render: (e,record) =>(
            <div>
              { record.courseType === 'common' ?
                <a href="#" style={{marginLeft: 12}} onClick={()=>this.goDetail(e,record)}>添加班级</a>  : null
              }
              <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title="确认删除？">
                <a href="#" style={{marginLeft: 12}}>删除</a>
              </Popconfirm>
            </div>
          )
        }
      ],
    }
  }

  goDetail = (e, record) => {
    console.log(record)
    this.context.router.push(menuRoute.getMenuItemByAttr('course-center', 'key').children.courseDetail.url.replace(':id', record.id));
  };

  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/course/${record.id}`).then(response=>{
      this.getList()
    })
  };

  componentWillMount(){
    this.getList();
  }

  getList(){
    let params = Object.assign({}, this.state.searchParams);
    const {pagination} = this.state;
    for(let paramsName in params){
      !params[paramsName] && paramsName!=='enabled' && delete params[paramsName];
    }
    params.page = pagination.page;
    params.size = pagination.pageSize;
    httpFetch.get(`${config.baseUrl}/api/course/search`,params).then(response=>{
      pagination.total = Number(response.headers['x-total-count']);
      response.data.map(item=>item.key = item.id);
      this.setState({
        pagination,
        loading: false,
        data: response.data
      })
    })
  }

  handleSearch = (values)=>{
    this.setState({
      searchParams: values
    },()=>{
      this.getList()
    })
  };;

  onCancel = ()=>{
    this.props.form.resetFields()
  };

  handleCreate = () =>{
    this.setState({
      showSlideFrame: true
    })
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

  handleCloseSlide = (success) => {
    success && this.getList();
    this.setState({showSlideFrame : false});
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination ,data, columns, showSlideFrame, title, courseDetail} = this.state;
    return (
      <div className="teacher-info">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
            {/*
             <Button type="primary" onClick={() => this.showImport(true)}>{formatMessage({id: 'importer.import'})}</Button>  导入
             */}
            {/* <Importer visible={showImportFrame}
             title={formatMessage({id:"item.itemUpload"})}
             templateUrl={`${config.budgetUrl}/api/budget/items/export/template`}
             uploadUrl={`${config.budgetUrl}/api/budget/items/import?orgId=${this.props.id}`}
             errorUrl={`${config.budgetUrl}/api/budget/items/export/failed/data`}
             fileName={formatMessage({id:"item.itemUploadFile"})}
             onOk={this.handleImportOk}
             afterClose={() => this.showImport(false)}/>*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          onRow={record => ({
            onClick: () => this.handleRowClick(record)
          })}
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
        <SlideFrame title={title}
                    show={showSlideFrame}
                    content={NewCourse}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={courseDetail}/>
      </div>)
  }
}
CourseCenter.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(CourseCenter));
