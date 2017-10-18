/**
 * created by jsq on 2017/10/16
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Tabs, Button, Table, Form, InputNumber, Checkbox, Row, Col, Dropdown, Menu, message} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import SlideFrame from 'components/slide-frame'
import UpdateCallbackSetting from 'containers/setting/callback-setting/update-callback-setting'
import 'styles/setting/callback-setting/callback-setting.scss'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class CallBackSetting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      status:"启用",
      tabsKey:"api",
      data: [],
      columns: [],
      showSlideFrame: false,
      tabs: [
        {key: 'api', name: "API列表"}, /*维度分配*/
        {key: 'apiSetting', name: "API回调设置"}  /*公司分配*/
      ],
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      columnGroup:{
        api:[
          {                        /*公司代码*/
            title:"ID", key: "id", dataIndex: 'id'
          },
          {                        /*公司代码*/
            title:"API_CODE", key: "description", dataIndex: 'description'
          },
          {                        /*公司类型*/
            title:"API版本", key: "companyType", dataIndex: 'companyType'
          },
          {                        /*启用*/
            title:"API描述", key: "enablement", dataIndex: 'enablement',width:'10%'
          },
          {                        /*启用*/
            title:"状态", key: "enablement", dataIndex: 'enablement',width:'10%'
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

  componentWillMount(){
    this.setState({
      columns: this.state.columnGroup.api
    })
  }

  handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  //Tabs点击
  onChangeTabs = (key) => {
    console.log(key)
    this.setState({
      loading: true,
      page: 0,
      tabsKey: key,
      columns: key === 'api' ? this.state.columnGroup.api : this.state.columnGroup.apiSetting
    },()=>{
      key === "company" ? this.queryCompany : this.queryDimension ;
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
          <Button type="primary" className="table-header-button" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
        </div>
    )
  }

  render(){
    const { pagination, columns, data, showSlideFrame} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19},
    };
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="isEnabled">启用   <span/> </Menu.Item>
        <Menu.Item key="disabled">停用     <span/></Menu.Item>
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

           {/* <Form>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('passwordLength')(
                  <div className="security-setting-formItem">
                    <span className="formItem-label-info">信息通知渠道：</span>
                    <span className="formItem-value-info">
                  <Checkbox defaultChecked disabled /> 邮箱（邮箱将用于含附件消息如报销单电子件的推送）<br/>
                  <Checkbox />&nbsp;&nbsp;&nbsp;手机（海外手机不支持短消息推送）
                </span>
                  </div>
                )}
              </FormItem>

            </Form>*/}
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
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>
        <SlideFrame title="全局设置"
                    show={showSlideFrame}
                    content={UpdateCallbackSetting}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={{}}/>
      </div>
    )
  }
}

CallBackSetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}
const WrappedCallBackSetting = Form.create()(CallBackSetting);

export default connect(mapStateToProps)(injectIntl(WrappedCallBackSetting));
