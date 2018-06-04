
/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Tabs, Pagination, Popconfirm,Tooltip} from 'antd';
import httpFetch from 'share/httpFetch'
import config from 'config'
import { injectIntl } from 'react-intl'
import SearchArea from 'components/search-area'
import NewTeacher from 'containers/user-info/new-teacher'
import SlideFrame from 'components/slide-frame'

class Teacher extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      title: '新增教师',
      showSlideFrame: false,
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchParams:{},
      searchForm: [
        {type: 'select', id: 'deptId', label: '系部', options: [], labelKey: 'deptName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/department/search`, method: 'get',
        },
        {type: 'input', id: 'nickName', label: '姓名' },
        {type: 'input', id: 'userNumber', label: '编号' },
        {type: 'radio', id: 'enabled', label: '状态',
          options:[
            {label: '在校',value: true},
            {label: '离岗',value: false},
          ],
          defaultValue: true
        },
      ],
      columns: [
        {
          title: '系部', key: "deptName", dataIndex: 'deptName'
        },
        {
          title: '姓名', key: "nickName", dataIndex: 'nickName',
        },
        {
          title: '编号', key: "userNumber", dataIndex: 'userNumber'
        },
        {
          title: '电话', key: "phone", dataIndex: 'phone',
        },
        {
          title: '入校时间', key: "createdDate", dataIndex: 'createdDate'
        },
        {
          title: '状态', key: 'enabled', width: '10%', dataIndex: 'enabled',
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
                   text={enabled ? '在校' : '离岗'} />
          )
        },
        {
          title: '操作', key: 'operate',
          render: (e,record) =>
            record.deptName==='admin'?
              <Tooltip title="该用户是管理员，不可删除">
                <a href="#" style={{marginLeft: 12}}>删除</a>
              </Tooltip>
              :
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
    //获取用户信息
    this.getList();
  }

  handleSubmit = (e)=> {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
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
    params.type = 'teacher';
    params.page = pagination.page;
    params.size = pagination.pageSize;
    httpFetch.get(`${config.baseUrl}/api/user/search`,params).then(response=>{
      pagination.total = Number(response.headers['x-total-count']);
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


  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination ,data, columns, title, showSlideFrame, tabs, nowStatus} = this.state;
    return (
      <div className="teacher-info">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>
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
                    content={NewTeacher}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={{}}/>
      </div>)
  }
}
Teacher.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(Teacher));
