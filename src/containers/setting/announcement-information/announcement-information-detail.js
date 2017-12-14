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
import debounce from 'lodash.debounce';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {TextArea} = Input;
const Search = Input.Search;

class AnnouncementInformationDetail extends React.Component{
  constructor(props){
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: true,
      upload: false,
      btnLoading: false,
      data:[],
      companyListSelector: false,
      isEnabled: true,
      imageUrl:"",
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
      selectorItem:{
        title: `${formatMessage({id: "announcement-info.deliveryCompany"})}`,
        url: `${config.baseUrl}/api/company/deploy/carousel`,
        searchForm: [
          {type: 'select', id: 'companyLevelId', label: formatMessage({id:"company.companyLevelName"}),defaultValue: '',options: [], getUrl: `${config.baseUrl}/api/companyLevel/selectByTenantId`},
          {type: 'select', id: 'legalEntityId', label: formatMessage({id:"company.legalEntity"}),defaultValue: '',options: [], getUrl: `${config.budgetUrl}/api/all/legalentitys`},
          {type: 'input', id: 'companyCode', label: formatMessage({id:"company.companyCode"}),defaultValue: ''},
          {type: 'input', id: 'companyName', label: formatMessage({id:"company.name"}),defaultValue: ''},
          {type: 'input', id: 'companyCodeFrom', label: formatMessage({id:"structure.companyCodeFrom"}),defaultValue: ''},
          {type: 'input', id: 'companyCodeTo', label: formatMessage({id:"structure.companyCodeTo"}),defaultValue: ''},
        ],
        columns: [
          {title: formatMessage({id:"company.companyCode"}), dataIndex: 'companyCode'},
          {title: formatMessage({id:"company.name"}),dataIndex:"companyName"},
          {title: formatMessage({id:"structure.companyType"}),dataIndex:"companyTypeName"},
        ],
        key: 'id'
      },
      columns: [
        {          /*公司代码*/
          title: formatMessage({id:"structure.companyCode"}), key: "companyCode", dataIndex: 'companyCode',width: '10%',
        },
        {          /*公司名称*/
          title: formatMessage({id:"structure.companyName"}), key: "companyName", dataIndex: 'companyName'
        },
      ]
    };
    this.handleSearch = debounce(this.handleSearch,1000)
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
    httpFetch.get(`${config.baseUrl}/api/carousels/company/find/distribution?carouselOID=d96fcdeb-bffa-4dcf-9e49-9ca07e946b2d&page=0&size=10`).then((response)=>{
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
    this.setState({btnLoading: true});
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        values.attachmentOID ="936e0d08-ed13-4ce5-813f-84818964e3cf";
        httpFetch.post(`${config.baseUrl}/api/carousels`,values).then((response)=>{
          console.log(response)
          message.success(`${this.props.intl.formatMessage({id:"common.save.success"},{name:""})}`);
          this.setState({btnLoading: false})
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}`)
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

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ upload: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  };

  handleSearch = (e)=>{
    console.log(e)

    console.log(this.refs.search)
  };

  //点击取消，跳转到上一页面
  onCancel = ()=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('announcement-information', 'key').url);
  };

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  renderContent(){
    const { formatMessage } = this.props.intl;
    const { getFieldDecorator } = this.props.form;
    const { label, isEnabled, btnLoading, imageUrl,loading, columns, data, pagination} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.upload ? 'loading' : 'plus'} />
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
             <Upload name="avatar"
                     listType="picture-card"
                     className="avatar-uploader"
                     action="//jsonplaceholder.typicode.com/posts/"
                     showUploadList={false}
                     onChange={this.handleChange}>
               {imageUrl ? <img src={imageUrl} alt="" width={85} height={85}/> : uploadButton}
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
         <div className="form-footer-button">
           <Button type="primary" htmlType="submit"  loading={btnLoading}>{formatMessage({id:"common.save"})}</Button>
           <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
         </div>
       </Form>
          :
          <div className="announcement-information-detail-company">
            <div className="table-header">
              <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
              <div className="table-header-buttons">
                <Button type="primary" className="table-header-btn" onClick={()=>this.showListSelector(true)}>{formatMessage({id: 'announcement-info.addCompany'})}</Button>  {/*新增分配*/}
                <Search className="table-header-search"
                        ref="search"
                        placeholder={formatMessage({id:"announcement-info.searchHolder"})}
                        onChange={this.handleSearch}
                        style={{ width: 200 }}/>
              </div>
            </div>
            <Table
              loading={loading}
              dataSource={data}
              columns={columns}
              bordered
              size="middle"/>
          </div>
        }
      </div>)
  }


  render(){
    const {  selectorItem, companyListSelector} = this.state;
    return (
      <div className="announcement-information-detail">
        <div className="announcement-information-tabs">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="announcement-information-content">
          {this.renderContent()}
        </div>
        <ListSelector
          selectorItem={selectorItem}
          visible={companyListSelector}
          onOk={this.handleListOk}
          extraParams={{setOfBooksId: this.props.company.setOfBooksId,isEnabled: true}}
          onCancel={()=>this.showListSelector(false)}/>
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
