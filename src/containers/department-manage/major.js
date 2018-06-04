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
import NewMajor from 'containers/department-manage/new-major'
import config from 'config'
const FormItem = Form.Item;
const Option = Select.Option;

class Major extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      buttonLoading: false,
      data: [],
      slideFrameTitle: "新建专业",
      showSlideFrame: false,
      majorDetail: {},
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
        {type: 'select', id: 'deptId', label: '系部', options: [], labelKey: 'deptName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/department/search`, method: 'get',
        },
        {type: 'input', id: 'className', label: '专业名称' },
      ],
      columns: [
        {
          title: '系部', key: "deptName", dataIndex: 'deptName',
        },
        {
          title: '专业名称', key: "majorName", dataIndex: 'majorName',
        },
        {
          title: '成立时间', key: "createdDate", dataIndex: 'createdDate',
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

  detail = (e,record) =>{
    record.hasInit = false;
    this.setState({
      showSlideFrame: true,
      slideFrameTitle: '班级详情',
      majorDetail: record
    })
  };

  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/major/${record.id}`).then(response=>{
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
    httpFetch.get(`${config.baseUrl}/api/major/search`,params).then(response=>{
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
    const { loading, searchForm, data, majorDetail, pagination, columns,  showSlideFrame,slideFrameTitle} = this.state;
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
                    content={NewMajor}
                    afterClose={this.handleCloseSlideCreate}
                    onClose={() => this.showSlideCreate(false)}
                    params={majorDetail}/>
      </div>
    )
  }
}

Major.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

const WrappedMajor = Form.create()(Major);

export default connect(mapStateToProps)(injectIntl(WrappedMajor));
