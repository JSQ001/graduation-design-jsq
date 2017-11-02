/**
 * created by jsq on 2017/10/16
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Tabs, Button, Table, Form, InputNumber, Checkbox, Row, Col, Dropdown, Menu, message} from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'

import SlideFrame from 'components/slide-frame'
import UpdateCallbackSetting from 'containers/setting/callback-setting/update-callback-setting'
import createApiCallbackSetting from 'containers/setting/callback-setting/create-api-callback-setting'
import callbackSetting from 'images/callback-setting.jpg'
import 'styles/setting/callback-setting/callback-setting.scss'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class CallBackSetting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      status:"启用",
      tabsKey:"api",
      data: [],
      columns: [],
      showSlideFrameAPI: false, //控制api回调设置弹出

      //全局设置
      globalSetting:{
        title: "",
        showSlideFrame: false, //控制全局设置弹出
        values: {}       //全局设置参数
      },
      //回调设置
      callbackSetting:{
        title: "",
        showSlideFrame: false, //控制新建回调设置弹出
        values: {}       //回调设置参数
      },
      tabs: [
        {key: 'api', name: "API列表"}, /*维度分配*/
        {key: 'apiSetting', name: "API回调设置"}  /*公司分配*/
      ],
      pagination: {
        page: 1,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      columnGroup:{
        api:[
          {                        /*api代码*/
            title:"ID", key: "id", dataIndex: 'id',width:'10%'
          },
          {                        /*API_CODE*/
            title:"API_CODE", key: "apiCode", dataIndex: 'apiCode'
          },
          {                        /*API版本*/
            title:"API版本", key: "apiVersion", dataIndex: 'apiVersion',width:'10%'
          },
          {                        /*API描述*/
            title:"API描述", key: "apiDesc", dataIndex: 'apiDesc'
          },
          {                        /*状态*/
            title:"状态", key: "status", dataIndex: 'status',width:'10%',
            render:recode=>{
              return recode ? <span icon="" className="call-back-setting-status">运行中</span> : <span>已禁用</span>
            }
          },
          {
            title:"操作", key: "operation", dataIndex: 'operation',width:'10%',
            render:(text,record)=>{
              return <span onClick={()=>this.handleClickItem(record)} className="call-back-setting-status">回调设置</span>
            }
          }
        ],
        apiSetting:[
          {
            title:"API_CODE", key: "apiCode", dataIndex: 'apiCode'
          },
          {
            title:"API版本", key: "apiVersion", dataIndex: 'apiVersion'
          },
          {
            title:"回调地址", key: "callbackUrl", dataIndex: 'callbackUrl'
          },
          {
            title:"系统信息", key: "layoutPriority", dataIndex: 'layoutPriority'
          },
          {                        /*默认维值*/
            title:"链接超时时间", key: "connectionRequestTimeout", dataIndex: 'connectionRequestTimeout'
          },
          {                        /*操作*/
            title:"获取超时时间", key: "connectTimeout", dataIndex: 'connectTimeout',width:'10%'
          },]
      },
    }
  }
  componentDidMount(){
    //spriteAnimation(document.getElementsByClassName("picture"),callbackSetting, 75, 75, 60)

  };

  componentWillMount(){
    //获取全局设置数据
    httpFetch.get(`${config.baseUrl}/push/api/customizedApiCallback/company`).then((response)=>{
      console.log(response)
      console.log(this.props)
      let globalSetting = this.state.globalSetting;
      globalSetting.values = response.data[0];
      this.setState({
        globalSetting,
      })
    });
    this.setState({
      columns: this.state.columnGroup.api
    }, this.getList())
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  //点击回调设置
  handleClickItem = (value)=>{
    value.callbackDatatype = this.state.globalSetting.values.callbackDatatype;
    value.companyOid = this.state.globalSetting.values.companyOid
    httpFetch.get(`${config.baseUrl}/push/api/customizedApiCallback?companyOid=${this.props.company.companyOID}&page=1&size=50`).then((response)=>{
      console.log(response)
      let flag = false;
      let apiDetail = {};
      response.data.map((item)=>{
        if(parseInt(value.id) === item.apiId) {
          flag = true;
          apiDetail = item;
          apiDetail.apiDetailId = item.id;
        }
      });
      this.setState({
        callbackSetting:{
          title: flag ? "API回调设置详情":"新建API回调设置",
          showSlideFrame: true,
          values: flag ? apiDetail : value
        }
      })
    });
  };

  //获取数据
  getList(){
    console.log(this.props.company.companyOID)
    let api = this.state.tabsKey === "api" ? "/push/api/customizedApi?" : `/push/api/customizedApiCallback?companyOid=${this.props.company.companyOID}&`;
    let url =  `${config.baseUrl}`+api+`page=${this.state.pagination.page}`+`&size=${this.state.pagination.pageSize}`;
    console.log(url)
    httpFetch.get(url).then((response)=>{
      console.log(response)
      response.data.map((item)=>{
        item.key = item.id;
      });
      let pagination = this.state.pagination;
      pagination.total = Number(response.headers['x-total-count']);
      this.setState({
        loading: false,
        data: response.data,
        pagination
      })
    })
  }

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    console.log(pagination)
    let p = this.state.pagination;
    p.page = pagination.current;
    p.pageSize = pagination.pageSize;
    console.log(p)
    this.setState({
      pagination:p
    }, ()=>{
      this.getList();
    })
  };

  //Tabs点击
  onChangeTabs = (key) => {
    console.log(key)
    this.setState({
      loading: true,
      page: 0,
      tabsKey: key,
      columns: key === 'api' ? this.state.columnGroup.api : this.state.columnGroup.apiSetting
    },()=>{
     this.getList();
    });
  };

  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  showSlideGlobal = (flag) => {
    let globalSetting = this.state.globalSetting;
    globalSetting.showSlideFrame = flag;
    globalSetting.title = "全局设置";
    this.setState({
      globalSetting
    })
  };

  handleCloseGlobal = (params) => {
    console.log(params)
    if(params) {
      this.getList();
    }
    let globalSetting = this.state.globalSetting;
    globalSetting.showSlideFrame = false;
    this.setState({
      globalSetting
    })
  };

  showSlideCallback = (flag) =>{
    let callbackSetting = {};
    callbackSetting.showSlideFrame = flag;
    this.setState({
      callbackSetting
    })
  };

  handleCloseCallback = (params) => {
    if(params) {
      this.getList();
    }
    //let callbackSetting = this.state.callbackSetting;
    let callbackSetting ={};
    callbackSetting.showSlideFrame = false;
    this.setState({
      callbackSetting
    })
  };

  handleCreate = (flag) =>{
    this.setState({
      callbackSetting:{
        title: "新建API回调设置",
        showSlideFrame: flag,
        values: {}
      }
    })
  };

  renderTableHeader(){
    return (
      this.state.tabsKey === "api" ?
        <div className="table-header-api">
          <div className="table-header-api-tips">API列表</div>
          <div className="table-header-api-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${this.state.pagination.total}`})}</div>  {/*共搜索到*条数据*/}
        </div>
        :
        <div className="table-header-apiSetting">
          <div className="table-header-apiSetting-tips">API设置</div>
          <div className="table-header-apiSetting-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${this.state.pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <Button type="primary" className="table-header-button" onClick={()=> this.handleCreate(true)}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
        </div>
    )
  }

  render(){
    const { loading, pagination, columns, data, callbackSetting, globalSetting, showSlideFrameAPI} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19},
    };

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="isEnabled"><span className="status-options">启用<span className="status-options-icon"/></span></Menu.Item>
        <Menu.Item key="disabled"><span className="status-options">停用&nbsp;&nbsp;&nbsp;&nbsp;</span><div className="status-options-icon"/></Menu.Item>
      </Menu>
    );
    return(
      <div className="call-back-setting">
        <div className="call-back-setting-head">
          <div className="picture"/>
          <span className="head-context">
            <span className="head-form-title">全局设置</span>
            <span className="head-form-tips">api未进行设置时，自动应用全局设置</span>
            <span  className="head-status">
              <Dropdown.Button  type="primary" overlay={menu}>
              状态：{this.state.status}
              </Dropdown.Button>
            </span>

            <div className="head-form">
               <Form>
                 <Row gutter={24}>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('callbackDatatype')(
                       <div className="formItem-title">
                         <label>数据格式：</label>
                         <label>{globalSetting.values.callbackDatatype}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('encodingAeskey')(
                       <div className="formItem-title">
                         <label>encodingAeskey：</label>
                         <label>{globalSetting.values.encodingAeskey}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                    <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('encodingToken')(
                       <div className="formItem-title">
                         <label>encodingToken：</label>
                         <label>{globalSetting.values.encodingToken}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>

                 </Row>
                 <Row gutter={24}>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('sysName')(
                       <div className="formItem-title">
                         <label>系统名称：</label>
                         <label>{globalSetting.values.sysName}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('sysAdmin')(
                       <div className="formItem-title">
                         <label>管理员名称：</label>
                         <label>{globalSetting.values.sysAdmin}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('sysAdminTel')(
                       <div className="formItem-title">
                         <label>管理员电话：</label>
                         <label>{globalSetting.values.sysAdminTel}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                 </Row>
                 <Row gutter={24}>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('connectionRequestTimeout')(
                       <div className="formItem-title">
                         <label>获取超链接时间：</label>
                         <label>{globalSetting.values.connectionRequestTimeout}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('connectTimeout')(
                       <div className="formItem-title">
                         <label>获取超时时间：</label>
                         <label>{globalSetting.values.connectTimeout}</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                 </Row>
                 <Row>
                   <div className="formItem-update"><a onClick={()=>this.showSlideGlobal(true)}>修改</a></div>
                 </Row>
               </Form>
            </div>
          </span>
        </div>
        <div className="call-back-setting-tabs">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="call-back-setting-table-header">
          {this.renderTableHeader()}
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          onChange={this.onChangePager}
          size="middle"
          bordered/>
        <SlideFrame title={globalSetting.title}
                    show={globalSetting.showSlideFrame}
                    content={UpdateCallbackSetting}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlideGlobal(false)}
                    params={globalSetting.values}/>
        <SlideFrame title={callbackSetting.title}
                    show={callbackSetting.showSlideFrame}
                    content={createApiCallbackSetting}
                    afterClose={this.handleCloseCallback}
                    onClose={() => this.showSlideCallback(false)}
                    params={callbackSetting.values}/>
      </div>
    )
  }
}

CallBackSetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization,
    company: state.login.company
  }
}
const WrappedCallBackSetting = Form.create()(CallBackSetting);

export default connect(mapStateToProps)(injectIntl(WrappedCallBackSetting));
