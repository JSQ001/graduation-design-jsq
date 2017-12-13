/**
 * created by jsq on 2017/12/12
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Tabs, Input, Modal, Button, Table, Form, Checkbox , Popconfirm, message,Switch, Icon, Upload  } from 'antd'
import ListSelector from 'components/list-selector'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/setting/announcement-information/announcement-information-detail.scss'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;

class AnnouncementInformationDetail extends React.Component{
  constructor(props){
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: true,
      data:[],
      companyListSelector: false,
      isEnabled: true,
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      label: 'detail',
      tabs: [
        {key: 'detail', name: formatMessage({id:"announcement-info.infoDetail"})}, /*公告详情*/
        {key: 'company', name: formatMessage({id: "announcement-info.deliveryCompany"})} /*分配公司*/
      ],
      selectedEntityOIDs: [],    //已选择的列表项的OIDs

      selectorItem:{
        title: `${formatMessage({id: "announcement-info.deliveryCompany"})}`,
        url: `${config.baseUrl}/api/company/deploy/carousel`,
        searchForm: [
          {type: 'select', id: 'companyLevelId', label: '公司级别',defaultValue: '',options: [], getUrl: `${config.baseUrl}/api/companyLevel/selectByTenantId`},
          {type: 'select', id: 'legalEntityId', label: '法人实体',defaultValue: '',options: [], getUrl: `${config.budgetUrl}/api/all/legalentitys`},
          {type: 'input', id: 'companyCode', label: "公司代码",defaultValue: ''},
          {type: 'input', id: 'companyName', label: "公司名称",defaultValue: ''},
          {type: 'input', id: 'companyCodeFrom', label: "公司代码从",defaultValue: ''},
          {type: 'input', id: 'companyCodeTo', label: "公司代码至",defaultValue: ''},
        ],
        columns: [
          {title: "公司代码", dataIndex: 'companyCode'},
          {title: "公司名称",dataIndex:"companyName"},
          {title: "公司类型",dataIndex:"companyTypeName"},
        ],
        key: 'id'
      }
    }
  }

  deleteItem = (e, record) => {
    console.log(record)
    httpFetch.delete(`${config.baseUrl}/api/carousels/${record.carouselOID}`).then(response => {
      message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name: record.title})); // name删除成功
      this.getList();
    })
  };

  componentWillMount(){
    this.getList();
  }

  getList(){
    httpFetch.get(`${config.baseUrl}/api/carousels/enable/company?roleType=TENANT&companyOID=${this.props.company.companyOID}`).then((response)=>{
      console.log(response)
      let i = 1;
      response.data.map((item)=>{
        item.key = item.id;
        item.number = i++;
      });
      this.setState({
        loading: false,
        data: response.data
      })
    })
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        values.attachmentOID ="936e0d08-ed13-4ce5-813f-84818964e3cf";
        httpFetch.post(`${config.baseUrl}/api/carousels`,values).then((response)=>{
          console.log(response)
          message.success("保存成功")
        }).catch((e)=>{
          if(e.response){
            message.error("保存失败")
          }
        })
      }
    })
  };


  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  //Tabs点击
  onChangeTabs = (key) => {
    this.setState({
      loading: true,
      label: key,
    },()=>{
      this.getList()
    });
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handleChange = ({ fileList }) =>{
    console.log(fileList)
    let array = [];
    array.push(fileList[fileList.length-1]);
    this.setState({ fileList: array })
  };

  //点击取消，跳转到上一页面
  onCancel = ()=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('announcement-information', 'key').url);
  };

  renderContent(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { label, isEnabled, loading, previewVisible, previewImage, fileList} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    const uploadButton = (
      <div className="announcement-information-detail-upload">
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return(
      <div>
        {label === 'detail' ?
          <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange} >
         <FormItem {...formItemLayout}
                   label={formatMessage({id:"common.column.status"})} colon={true} >
           {getFieldDecorator('enable', {
             valuePropName:"defaultChecked",
             initialValue:isEnabled
           })(
             <div>
               <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
               <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.disabled"}) }</span>
             </div>)}
         </FormItem>                                                         {/*标题*/}
         <FormItem {...formItemLayout} label={formatMessage({id:"announcement-info.title"})} wrapperCol={{span: 8, offset: 1}}>
           {getFieldDecorator('title', {
             rules: [
               {
                 required: true,
                 message: formatMessage({id:"common.please.enter"})
               }
             ],
           })(
             <Input placeholder={formatMessage({id:"common.please.enter"})} /> /*请输入*/
           )}
         </FormItem>                   {/*轮播图片*/}
         <FormItem {...formItemLayout} label= {formatMessage({id: "announcement-info.picture"})}>
           {getFieldDecorator('attachmentOID')(
             <Upload  action="//jsonplaceholder.typicode.com/posts/"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}>
               {uploadButton}
               <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                 <img alt="example" style={{ width: '100%' }} src={previewImage} />
               </Modal>
             </Upload>
           )}
         </FormItem>                      {/*跳转外部链接*/}
         <FormItem {...formItemLayout} label={formatMessage({id:"announcement-info.link"})}  wrapperCol={{span: 8, offset: 1}}>
           {getFieldDecorator('outLink')(
             <Checkbox onChange={this.checked}>选中后点击轮播图将直接跳转外部页面</Checkbox>
           )}
         </FormItem>
         <FormItem {...formItemLayout} label={formatMessage({id:"announcement-info.content"})} wrapperCol={{span: 8, offset: 1}}>
           {getFieldDecorator('content')(
             <TextArea placeholder={ formatMessage({id:"common.please.enter"})}/>
           )}
         </FormItem>
         <div className="slide-footer">
           <Button type="primary" htmlType="submit"  loading={loading}>{formatMessage({id:"common.save"})}</Button>
           <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
         </div>
       </Form>
          :
          <Table/>
        }
      </div>)
  }


  render(){
    return (
      <div className="announcement-information">
        <div className="announcement-information-tabs">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="announcement-information-content">
          {this.renderContent()}
        </div>

      </div>)
  }
}


AnnouncementInformationDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}
const WrappedAnnouncementInformationDetail = Form.create()(AnnouncementInformationDetail);

export default connect(mapStateToProps)(injectIntl(WrappedAnnouncementInformationDetail));
