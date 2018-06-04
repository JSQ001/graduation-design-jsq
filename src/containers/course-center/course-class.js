/**
 * Created by jsq on 2018/5/2.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Popconfirm} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import ListSelector from 'components/list-selector'

const FormItem = Form.Item;

class CourseClass extends React.Component{
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [],
      courseDetail: {},
      companyListSelector: false,
      title: '添加课程',
      user: {},
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      'classInfo': {
        title: '添加班级',
        url: `${config.baseUrl}/api/class/search`,
        searchForm: [
          {type: 'select', id: 'deptId', label: '系部', options: [], labelKey: 'deptName',valueKey: 'id',
            getUrl:`${config.baseUrl}/api/department/search`, method: 'get',
          },
          { type: 'input', id: 'sectionName', label: "班级" }
        ],
        columns: [
          { title: "年级", dataIndex: 'grade' },
          { title: "班级", dataIndex: 'className' },
          { title: "人数", dataIndex: 'classCount' },
        ],
        key: 'id'
      },
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
          </span>)},  //操作
      ]
    }
  }

  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/course/class/${record.id}`).then(response=>{
      this.getList()
    })
  };

  componentWillMount(){
    const classInfo = this.state.classInfo;
    httpFetch.get(`${config.baseUrl}/api/account`,{}).then((response)=>{
      classInfo.searchForm[0].defaultValue = response.data.deptId;
      this.setState({
        user: response.data,
        classInfo
      })
    });
    httpFetch.get(`${config.baseUrl}/api/course/${this.props.params.id}`).then(response=>{
      this.setState({
        courseDetail: response.data
      })
    });
    this.getList();
  }

  getList(){
    let params = {};
    const {pagination} = this.state;
    params.page = pagination.page;
    params.size = pagination.pageSize;
    params.courseId = this.props.params.id;
    console.log(this.props.user);
    httpFetch.get(`${config.baseUrl}/api/course/class/search`,params).then(response=>{
      pagination.total = Number(response.headers['x-total-count']);
      response.data.map(item=>item.key = item.id);
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

  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  handleListOk = (result) => {
    let params = {
      courseId: this.props.params.id,
      classId: result.result[0].id
    };

    httpFetch.post(`${config.baseUrl}/api/course/class/insert`,params).then(response=>{
      message.success("添加成功");
      this.setState({companyListSelector:false})
    });
    this.getList();
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, classInfo, pagination ,data, columns, user, title, courseDetail, companyListSelector} = this.state;
    return (
      <div className="teacher-info">
        <div>
          课程名称：{courseDetail.courseName}
        </div>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.showListSelector(true)}>{formatMessage({id: 'common.add'})}</Button>  {/*新 建*/}
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
        <ListSelector
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      selectorItem={classInfo}
                      single={true}
                      //extraParams={{deptId: user.deptId}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>)
  }
}
CourseClass.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(CourseClass));
