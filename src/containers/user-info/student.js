/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Tabs, Pagination, Popconfirm} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import Importer from 'components/importer'
import SearchArea from 'components/search-area'
import NewStudent from 'containers/user-info/new-student'
import SlideFrame from 'components/slide-frame'

class Student extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      title: '添加学生',
      showSlideFrame: false,
      showImportFrame: false,
      searchParams: {},
      studentDetail:{},
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'select', id: 'deptId', label: '系部', options: [],
          event: 'deptId',
          labelKey: 'deptName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/department/search`, method: 'get',
        },
        {type: 'select', id: 'grade', label: '年级',
          event: 'grade',
          options: [
            {label: 14+ "级",value: 14+ "级"},
            {label: 15+ "级",value: 15+ "级"},
            {label: 16+ "级",value: 16+ "级"},
            {label: 17+ "级",value: 17+ "级"}
          ]
        },
        {type: 'select', id: 'classId', label: '班级', options: [], labelKey: 'className',valueKey: 'id',
          getParams: {},
          getUrl:`${config.baseUrl}/api/class/search`, method: 'get',
         // renderOption: data => data.grade + data.className
        },
        {type: 'input', id: 'name', label: '姓名' },
        {type: 'input', id: 'userNumber', label: '学号' },
        {type: 'radio', id: 'enabled', label: '状态',
          options:[
            {label: '在校',value: true},
            {label: '休学',value: false},
          ],
          defaultValue: true
        },
      ],
      columns: [
        {
          title: '系部', key: "deptName", dataIndex: 'deptName'
        },
        {
          title: '班级', key: "className", dataIndex: 'className',
        },
        {
          title: '姓名', key: "nickName", dataIndex: 'nickName',
        },
        {
          title: '学号', key: "userNumber", dataIndex: 'userNumber'
        },
        {
          title: '电话', key: "phone", dataIndex: 'phone',
        },
        {
          title: '入学时间', key: "createdDate", dataIndex: 'createdDate'
        },
        {
          title: '状态', key: 'enabled', width: '10%', dataIndex: 'enabled',
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
                   text={enabled ? '在校' : '休学'} />
          )
        },
        {
          title: '操作', key: 'operate',
          render: (e,record) =>
              <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title="确认删除？">
                <a href="#" style={{marginLeft: 12}}>删除</a>
              </Popconfirm>
        }
      ],
    }
  }
  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/user/${record.id}`).then(response=>{
      this.getList()
    })
  };

  componentWillMount(){
    this.getList();
  }

  handleEvent = (e,value) =>{
    const {searchParams, searchForm }= this.state;
    searchForm[2].getParams = {...searchForm[2].getParams,[e]:value};
    searchParams[e] = value;
    this.setState({searchParams,searchForm})
  };

  handleSearch = (values)=>{
    this.setState({
      searchParams: values
    },()=>{
      this.getList()
    })
  };

  getList(){
    let params = Object.assign({}, this.state.searchParams);
    const {pagination} = this.state;
    for(let paramsName in params){
      !params[paramsName] && paramsName!=='enabled' && delete params[paramsName];
    }
    params.type = 'student';
    params.page = pagination.page;
    params.size = pagination.pageSize;
    httpFetch.get(`${config.baseUrl}/api/user/search`,params).then(response=>{
      pagination.total = Number(response.headers['x-total-count']);
      response.data.map(item=>item.key = item.id);
      this.setState({
        pagination,
        loading: false,
        data: response.data
      })
    })
  }

  handleCreate = () =>{
    this.setState({
      showSlideFrame: true
    })
  };

  onCancel = ()=>{
    this.props.form.resetFields()
  };

  handleCloseSlide = (success) => {
    success && this.getList();
    this.setState({showSlideFrame : false});
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

  showImport = (flag) => {
    this.setState({ showImportFrame: flag })
  };

  //导入成功回调
  handleImportOk = () => {
    this.showImport(false);
    this.getList()
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination ,data, columns, title, showSlideFrame, studentDetail, showImportFrame} = this.state;
    return (
      <div className="teacher-info">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}
          eventHandle={this.handleEvent}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
           <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
           <Button type="primary" onClick={() => this.showImport(true)}> 导入</Button>
           <Importer visible={showImportFrame}
           title="导入学生"
           templateUrl={`${config.baseUrl}/api/user/export/template`}
           uploadUrl={`${config.baseUrl}/api/user/import`}
           errorUrl={`${config.baseUrl}/api/user/export/failed/data`}
           fileName="学生导入文件"
           onOk={this.handleImportOk}
           afterClose={() => this.showImport(false)}/>
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
                    content={NewStudent}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={studentDetail}/>
      </div>)
  }
}
Student.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(Student));
