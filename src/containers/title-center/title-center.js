
/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Table, Badge, Popconfirm} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'routes/menuRoute'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import NewTitle from 'containers/title-center/new-title'

const FormItem = Form.Item;

class TitleCenter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      title: '新建试题',
      showSlideFrame: false,
      titleDetail: {},
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [
        {type: 'select', id: 'department', label: '试题号', options: [] },
        {type: 'input', id: 'name', label: '试题名称' },
        {type: 'radio', id: 'userNumber', label: '类型',
          options:[
            {label: '考试题',value:'test'},
            {label: '练习题',value: 'exercise'},
          ] },
      ],
      columns: [
        {
          title: '试题号', key: "titleNumber", dataIndex: 'titleNumber'
        },
        {
          title: '课程名称', key: "courseName", dataIndex: 'courseName',
        },
        {
          title: '试题名称', key: "titleName", dataIndex: 'titleName',
        },
        {
          title: '试题类型', key: "titleType", dataIndex: 'titleType',
        },
        {
          title: '发布人', key: "userNumber", dataIndex: 'userNumber'
        },
        {
          title: '状态', key: 'status', width: '10%', dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? '启用' : '禁用'} />
          )
        },
        {
          title: '操作', key: 'operate',
          render: (e,record) =>
          <div>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title="确认删除？">
              <a href="#" style={{marginLeft: 12}}>删除</a>
            </Popconfirm>
            <a href="#" onClick={()=>this.titleLine(e,record)} style={{marginLeft: 12}}>详情</a>
          </div>
        }
      ],
    }
  }

  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/title/head/delete/${record.id}`).then(response=>{
      this.getList()
    })
  };

  titleLine = (e,record)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('title-center', 'key').children.titleDetail.url.replace(':id', record.id));
  };

  componentWillMount(){
    //获取用户信息
    console.log(this.props.user)
    this.getList()
  }

  getList(){
    let params = Object.assign({}, this.state.searchParams);
    const {pagination} = this.state;
    for(let paramsName in params){
      !params[paramsName] && paramsName!=='enabled' && delete params[paramsName];
    }
    params.page = pagination.page;
    params.size = pagination.pageSize;
    httpFetch.get(`${config.baseUrl}/api/title/head/search`,params).then(response=>{
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
  };

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

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, searchForm, pagination ,data, columns,title, showSlideFrame, titleDetail} = this.state;
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
         /* onRow={record => ({
            onClick: () => this.handleRowClick(record)
          })}*/
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
        <SlideFrame title={title}
                    show={showSlideFrame}
                    content={NewTitle}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.setState({showSlideFrame : false})}
                    params={titleDetail}/>
      </div>)
  }
}
TitleCenter.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
  }
}


export default connect(mapStateToProps)(injectIntl(TitleCenter));
