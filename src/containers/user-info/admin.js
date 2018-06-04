
/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Tabs} from 'antd';
import { injectIntl } from 'react-intl'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'

class Admin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      title: '新建用户',
      showSlideFrame: false,
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'select', id: 'department', label: '系部', options: [] },
        {type: 'select', id: 'class', label: '班级', options: [] },
        {type: 'input', id: 'name', label: '姓名' },
        {type: 'input', id: 'userNumber', label: '学号' },
        {type: 'radio', id: 'status', label: '状态',
          options:[
            {label: '在校',value: true},
            {label: '休学/离岗',value: '1001'},
          ],
          defaultValue: true
        },
      ],
      columns: [
        {
          title: '系部', key: "department", dataIndex: 'department'
        },
        {
          title: '班级', key: "class", dataIndex: 'class',
        },
        {
          title: '姓名', key: "name", dataIndex: 'name',
        },
        {
          title: '学号', key: "userNumber", dataIndex: 'userNumber'
        },
        {
          title: '入学时间', key: "createTime", dataIndex: 'createTime'
        },
        {
          title: '状态', key: 'status', width: '10%', dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? '在校' : '离岗/休学'} />
          )
        },
        {
          title: '操作', key: 'operate',
          render: desc => <a>删除</a>
        }
      ],
      nowStatus: 'admin'
    }
  }

  componentWillMount(){
    //获取用户信息
    console.log(this.props.params)
  }

  handleSubmit = (e)=> {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  };

  handleSearch = (values)=>{
    console.log(values)
  };

  handleCreate = () =>{
    this.setState({
      showSlideFrame: true
    })
  };

  onCancel = ()=>{
    this.props.form.resetFields()
  };
  onChangeTabs = (key) =>{
    this.setState({
      nowStatus: key
    })
  };


  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination ,data, columns, title, showSlideFrame} = this.state;
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
                    content={NewUser}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={{}}/>
      </div>)
  }
}
Admin.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(Admin));
