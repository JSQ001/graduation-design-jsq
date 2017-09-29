/**
 *  created by jsq on 2017/9/20
 */
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

const periodStrategy = [];
class BudgetStructureDetail extends React.Component{


  constructor(props){
    super(props);
    this.state = {
      loading: true,
      buttonLoading: false,
      companyListSelector: false,
      edit:false,
      structure:{},
      buttonLoading: false,
      showSlideFrame: false,
      statusCode: this.props.intl.formatMessage({id:"common.statusEnable"}) /*启用*/,
      total:0,
      data:[],
      pagination:{},
      status:"",
      columns:[],
      infoList: [
        {type: 'input', id: 'organizationName', label: this.props.intl.formatMessage({id: 'budget.organization'})+" :" /*预算组织*/},
        {type: 'input', id: 'structureCode', label: this.props.intl.formatMessage({id: 'budget.structureCode'})+" :" /*预算表代码*/},
        {type: 'input', id: 'structureName', label: this.props.intl.formatMessage({id: 'budget.structureName'}) +" :"/*预算表名称*/},
        {type: 'select',options: periodStrategy , id: 'periodStrategy', label: this.props.intl.formatMessage({id: 'budget.periodStrategy'}) +" :"/*编制期段*/},
        {type: 'input', id: 'description', label: this.props.intl.formatMessage({id: 'budget.structureDescription'}) +" :"/*预算表描述*/},
        {type: 'switch', id: 'isEnabled', label: this.props.intl.formatMessage({id: 'common.columnStatus'}) +" :"/*状态*/},
      ],
      columnGroup:{
        company:[
          {                        /*公司代码*/
            title:this.props.intl.formatMessage({id:"structure.companyCode"}), key: "companyCode", dataIndex: 'companyCode'
          },
          {                        /*公司代码*/
            title:this.props.intl.formatMessage({id:"structure.companyDescription"}), key: "description", dataIndex: 'description'
          },
          {                        /*公司类型*/
            title:this.props.intl.formatMessage({id:"structure.companyType"}), key: "companyType", dataIndex: 'companyType'
          },
          {                        /*启用*/
            title:this.props.intl.formatMessage({id:"structure.enablement"}), key: "enablement", dataIndex: 'enablement',width:'10%'
          },
        ],
        dimension:[
          {                        /*维度代码*/
          title:this.props.intl.formatMessage({id:"structure.dimensionCode"}), key: "dimensionCode", dataIndex: 'dimensionCode'
           },
          {                        /*描述*/
            title:this.props.intl.formatMessage({id:"structure.description"}), key: "description", dataIndex: 'description'
          },
          {                        /*布局位置*/
            title:this.props.intl.formatMessage({id:"structure.layoutPosition"}), key: "layoutPosition", dataIndex: 'layoutPosition'
          },
          {                        /*布局顺序*/
            title:this.props.intl.formatMessage({id:"structure.layoutPriority"}), key: "layoutPriority", dataIndex: 'layoutPriority'
          },
          {                        /*默认维值*/
            title:this.props.intl.formatMessage({id:"structure.defaultDimValueName"}), key: "defaultDimValueName", dataIndex: 'defaultDimValueName'
          },
          {                        /*操作*/
            title:this.props.intl.formatMessage({id:"structure.opetation"}), key: "opration", dataIndex: 'opration',width:'10%'
          },]
      },
      tabs: [
        {key: 'dimension', name: this.props.intl.formatMessage({id:"structure.dimensionDistribute"})}, /*维度分配*/
        {key: 'company', name: this.props.intl.formatMessage({id:"structure.companyDistribute"})}  /*公司分配*/
        ],
      form: {
        name: '',
        enabled: true
      },
    }
    this.queryDimension = debounce(this.queryDimension,1000)
  }


  componentWillMount(){
    //获取某预算表某行的数据
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/${this.props.params.id[1]}`).then((response)=>{
      if(response.status === 200){
        this.setState({
          structure: response.data
        })
      }});
    this.setState({
      buttonLoading: false,
      columns : this.state.columnGroup.dimension
    });
    pr
  }

  //控制是否编辑
  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //保存所做的修改
  handleUpdate = (e) => {
    e.preventDefault();
    this.setState({
      buttonLoading: true
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.id = this.state.structure.id;
        values.versionNumber = this.state.structure.versionNumber;
        values.organizationId = this.state.structure.organizationId;
        console.log(values)
        httpFetch.put(`${config.budgetUrl}/api/budget/structures`,values).then((response)=>{
          if(response) {
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            this.setState({
              buttonLoading: false
            })
            this.handleEdit(false)
          }
        })
      }
    });
  };

  handleUpdateState = () =>{
    return
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
      status: key,
      columns: key === 'company' ? this.state.columnGroup.company : this.state.columnGroup.dimension
    },()=>{
      key === "company" ? this.queryCompany : this.queryDimension ;
    });
  };

  handleSearchChange = (e) =>{
    this.state.status === "company" ? this.queryCompany(e.target.value) : this.queryDimension(e.target.value);
  };

  handleCreate = (e) =>{
    this.state.status ==="company" ? this.showListSelector(true) : this.showSlide(true)
  };

  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
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

  render(){
    const { getFieldDecorator } = this.props.form;
    const { infoList, structure, loading, edit, form, total, data, columns, pagination, status, showSlideFrame, companyListSelector} = this.state;
    return(
      <div className="budget-structure-detail">
        <BasicInfo
            infoList={infoList}
            infoData={structure}
            updateHandle={this.handleUpdate}
            updateState={true}/>
        <div className="structure-detail-distribution">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{status === 'company'? this.props.intl.formatMessage({id:'structure.addCompany'}) :
              this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
            {status === "company" ? <Button >{this.props.intl.formatMessage({id:'common.save'})}</Button> : null}
            <Search className="table-header-search"
                    onChange={this.handleSearchChange}                                      /* 请输入公司名称/代码*/
                    placeholder={ status === "company" ? this.props.intl.formatMessage({id:'structure.searchCompany'}) :
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

        <ListSelector type="company"
                        visible={companyListSelector}/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetStructureDetail = Form.create()(BudgetStructureDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetStructureDetail));
