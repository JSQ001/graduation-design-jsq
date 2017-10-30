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
      loading: true,
      status:"启用",
      tabsKey:"api",
      data: [],
      columns: [],
      showSlideFrame: false, //控制全局设置弹出
      showSlideFrameAPI: false, //控制api设置弹出
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
              return recode ? <span className="call-back-setting-status">运行中</span> : <span>已禁用</span>
            }
          },
        ],
        apiSetting:[
          {                        /*维度代码*/
            title:"API_CODE", key: "dimensionCode", dataIndex: 'dimensionCode'
          },
          {                        /*描述*/
            title:"API版本", key: "description", dataIndex: 'description'
          },
          {                        /*布局位置*/
            title:"回调地址", key: "layoutPosition", dataIndex: 'layoutPosition'
          },
          {                        /*布局顺序*/
            title:"系统信息", key: "layoutPriority", dataIndex: 'layoutPriority'
          },
          {                        /*默认维值*/
            title:"链接超时时间", key: "defaultDimValueName", dataIndex: 'defaultDimValueName'
          },
          {                        /*操作*/
            title:"获取超时时间", key: "opration", dataIndex: 'opration',width:'10%'
          },]
      },
    }
  }
  componentDidMount(){
    spriteAnimation(document.getElementsByClassName("picture"),callbackSetting, 75, 75, 60)

  };

  componentWillMount(){
    this.setState({
      columns: this.state.columnGroup.api
    }, this.getList())
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  //获取数据
  getList(){
    let api = this.state.tabsKey === "api" ? "/push/api/customizedApi" : `/push/api/customizedApiCallback?companyOid=${this.props.company.companyOID}`;
    let url =  `${config.baseUrl}`+api+`?page=${this.state.pagination.page}`+`&size=${this.state.pagination.pageSize}`;
    console.log(url)
    httpFetch.get(url).then((response)=>{
      console.log(response)
      response.data.map((item)=>{
        response.data.key = response.data.id;
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

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  showSlideApi = (flag) =>{
    this.setState({
      showSlideFrameAPI: flag
    })
  };

  handleCreate = () =>{};

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
          <Button type="primary" className="table-header-button" onClick={()=> this.showSlideApi(true)}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
        </div>
    )
  }

  render(){
    const { loading, pagination, columns, data, showSlideFrame, showSlideFrameAPI} = this.state;
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
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>数据格式：</label>
                         <label>JSON</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>encodingAeskey：</label>
                         <label>-</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                    <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>encodingToken：</label>
                         <label>-</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>

                 </Row>
                 <Row gutter={24}>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>系统名称：</label>
                         <label>-</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>管理员名称：</label>
                         <label>-</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>管理员电话：</label>
                         <label>-</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                 </Row>
                 <Row gutter={24}>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>获取超链接时间：</label>
                         <label>4000ms</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                   <Col span={8}>
                     <FormItem>
                     {getFieldDecorator('passwordLength')(
                       <div className="formItem-title">
                         <label>获取超时时间：</label>
                         <label>4000ms</label>
                       </div>
                     )}
                     </FormItem>
                   </Col>
                 </Row>
                 <Row>
                   <div className="formItem-update"><a onClick={()=>this.showSlide(true)}>修改</a></div>
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
        <SlideFrame title="全局设置"
                    show={showSlideFrame}
                    content={UpdateCallbackSetting}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={{}}/>
        <SlideFrame title="新建API回调设置"
                    show={showSlideFrameAPI}
                    content={createApiCallbackSetting}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlideApi(false)}
                    params={{}}/>
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
