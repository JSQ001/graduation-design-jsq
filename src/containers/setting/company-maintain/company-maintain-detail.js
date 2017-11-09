
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import debounce from 'lodash.debounce';

import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure-detail.scss';
import SlideFrame from "components/slide-frame";
import NewDimension from 'containers/budget-setting/budget-organization/budget-structure/new-dimension'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;

let periodStrategy = [
  {label:"月度",value: "month"},  /*月度*/
  {label:"季度",value: "quarter"}, /*季度*/
  {label:"年度",value: "year"} /*年度*/
];
class WrappedCompanyMaintainDetail extends React.Component{

  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      companyListSelector: false,  //控制公司选则弹框
      updateState: false,
      structure:{},
      showSlideFrame: false,
      showSlideFrameUpdate: false,
      statusCode: formatMessage({id:"common.status.enable"}) /*启用*/,
      total:0,
      data:[],
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      status:"",
      columns:[],
      infoData:[],
      infoList: [
        {          /*公司代码*/
          type: 'input',label: this.props.intl.formatMessage({id:"company.companyCode"}), id: "companyCode"
        },

        {          /*公司名称*/
          type: 'input', label: this.props.intl.formatMessage({id:"company.name"}), id: "name", labelKey: 'name',
        },
        {          /*公司类型*/
          type: 'input',label: this.props.intl.formatMessage({id:"company.companyType"}), id: "companyType", labelKey: 'companyType'
        },
        {          /*账套*/
          type: 'input', label: this.props.intl.formatMessage({id:"company.setOfBooksName"}), id: "setOfBooksName", labelKey: 'setOfBooksName'
        },
        {          /*法人*/
          type: 'input', label: this.props.intl.formatMessage({id:"company.legalEntityName"}), id: "legalEntityName", labelKey: 'legalEntityName',
        },
        {          /*公司级别*/
          type: 'input',label: this.props.intl.formatMessage({id:"company.companyLevelName"}), id: "companyLevelName", labelKey: 'companyLevelName',
        },
        {          /*上级机构*/
          type: 'input', label: this.props.intl.formatMessage({id:"company.parentCompanyName"}), id: "parentCompanyName", labelKey: 'parentCompanyName',
        },
        {          /*有效日期从*/
          type: 'date', label: this.props.intl.formatMessage({id:"company.startDateActive"}), id: "startDateActive",
        },
        {          /*有效日期至*/
          type: 'date', label: this.props.intl.formatMessage({id:"company.endDateActive"}), id: "endDateActive",
        },
        {         /*地址*/
          type: 'input', label: this.props.intl.formatMessage({id:"company.address"}), id: "address", labelKey: 'address',
        }

      ],
      columnGroup:{

        dimension:[
          {                        /*维度代码*/
            title:formatMessage({id:"structure.dimensionCode"}), key: "dimensionCode", dataIndex: 'dimensionCode'
          },
          {                        /*描述*/
            title:formatMessage({id:"structure.description"}), key: "description", dataIndex: 'description'
          },
          {                        /*布局位置*/
            title:formatMessage({id:"structure.layoutPosition"}), key: "layoutPosition", dataIndex: 'layoutPosition'
          },
          {                        /*布局顺序*/
            title:formatMessage({id:"structure.layoutPriority"}), key: "layoutPriority", dataIndex: 'layoutPriority'
          },
          {                        /*默认维值*/
            title:formatMessage({id:"structure.defaultDimValueName"}), key: "defaultDimValueName", dataIndex: 'defaultDimValueName'
          },
          {                        /*操作*/
            title:formatMessage({id:"structure.opetation"}), key: "opration", dataIndex: 'opration',width:'10%'
          },],
        user:[
          /* {
           title:"序号", key: "companyCode", dataIndex: 'companyCode',width:'8%'
           },*/
          {                        /*姓名*/
            title:"姓名", key: "fullName", dataIndex: 'name',width:'16%'
          },
          {                        /*工号*/
            title:"工号", key: "id", dataIndex: 'id',width:'8%',
          },
          {                        /*部门*/
            title:"部门", key: "departmentName", dataIndex: 'departmentName',width:'10%',
          },
          {                        /*联系方式*/
            title:"联系方式", key: "mobile", dataIndex: 'mobile',width:'10%',
          },
          {                        /*邮箱*/
            title:"邮箱", key: "email", dataIndex: 'email',width:'10%',
          },
        ]
      },
      tabs: [
        {key: 'dimension', name:"银行账户信息"}, /*维度分配*/
        {key: 'user', name: "员工信息"}  /*公司分配*/
      ],
      form: {
        name: '',
        enabled: true
      },
    };
    this.queryDimension = debounce(this.queryDimension,1000)
  }
  componentWillMount(){
    //获取某预算表某行的数据

   this.getCompanyByCode(this.props.params.companyCode);
  }

  //根据companyCode获取公司
  getCompanyByCode(companyCode){
    console.log("12321312321321321");
    httpFetch.get(`${config.baseUrl}/api/company/by/term?companyCode=${companyCode}`).then((response)=>{
      console.log(response.data);
      this.setState({
        infoData:response.data
      })
    })
  }




  //保存所做的修改
  handleUpdate = (value) => {
    //修改时，如果该预算表已被日志记账类型引用，不允许修改编制期段
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/headers?structureId=${this.state.structure.id}`).then((response)=>{
      if(response.status === 200){
        if(response.data.length>0 && this.state.structure.periodStrategy !== value.periodStrategy){
          message.error(this.props.intl.formatMessage({id:"structure.validatePeriodStrategy"})) //该预算表已被预算日记账引用，不允许修改编制期段！
        }
      }
    });
    value.id = this.state.structure.id;
    value.versionNumber = this.state.structure.versionNumber;
    value.organizationId = this.state.structure.organizationId;
    httpFetch.put(`${config.budgetUrl}/api/budget/structures`,value).then((response)=>{
      if(response) {
        if(response.status === 200) {
          message.success(this.props.intl.formatMessage({id: "structure.saveSuccess"}));
          /*保存成功！*/
          this.setState({
              structure: response.data,
              updateState: true
            },
            //调用维度查询接口
          );
        }
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`修改失败, ${e.response.data.validationErrors[0].message}`);
        this.setState({loading: false});
      }
      else {
        console.log(e)
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
      page: 0,
      data:[],
      status: key,
      columns: key === 'user' ? this.state.columnGroup.user : this.state.columnGroup.dimension
    },()=>{
      key === "user" ? this.queryCompany : this.queryDimension ;
    });
  };

  handleSearchChange = (e) =>{
    this.state.status === "user" ? this.queryCompany(e.target.value) : this.queryDimension(e.target.value);
  };

  handleCreate = (e) =>{
    this.state.status ==="user" ? this.showListSelector(true) : this.showSlide(true)
  };


  //分配公司
  distributeCompany(){

  }

  //维度分配
  distributeDimension(){}

  //调用维度查询接口
  queryDimension(value){
    console.log(value)
  }

  queryCompany(value){
    console.log(value)
  }

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  //处理公司弹框点击ok
  handleListOk = (result) => {
    console.log(result)
    this.setState({
        data: result.result
      },
      this.showListSelector(false)
    );
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { infoList, updateState, infoData, loading, showSlideFrameUpdate, total, data, columns, pagination, status, showSlideFrame, companyListSelector} = this.state;
    return(
      <div className="budget-structure-detail">
        <BasicInfo
          infoList={infoList}
          infoData={infoData}
          updateHandle={this.handleUpdate}
          updateState={updateState}/>
        <div className="structure-detail-distribution">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{status === 'user'? this.props.intl.formatMessage({id:'structure.addCompany'}) :
              this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
            {status === "user" ? <Button >{this.props.intl.formatMessage({id:'common.save'})}</Button> : null}
            <Search className="table-header-search"
                    onChange={this.handleSearchChange}                                      /* 请输入公司名称/代码*/
                    placeholder={ status === "user" ? this.props.intl.formatMessage({id:'structure.searchCompany'}) :
                      this.props.intl.formatMessage({id: 'structure.searchDimension' /*请输入维度名称/代码*/ })}/>
          </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>

        <SlideFrame title="新建维度"
                    show={showSlideFrame}
                    content={NewDimension}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}/>
        <SlideFrame title="编辑维度"
                    show={showSlideFrameUpdate}
                    content={NewDimension}
                    afterClose={this.handleCloseSlideUpdae}
                    onClose={() => this.showSlideUpdate(false)}/>

        <ListSelector type="company"
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const CompanyMaintainDetail = Form.create()(WrappedCompanyMaintainDetail);

export default connect(mapStateToProps)(injectIntl(CompanyMaintainDetail));
