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

let periodStrategy = [
  {label:"月度",value: "month"},  /*月度*/
  {label:"季度",value: "quarter"}, /*季度*/
  {label:"年度",value: "year"} /*年度*/
];
class BudgetStructureDetail extends React.Component{

  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      companyListSelector: false,
      updateState: false,
      structure:{},
      showSlideFrame: false,
      showSlideFrameUpdate: false,
      statusCode: formatMessage({id:"common.status.enable"}) /*启用*/,
      total:0,
      data:[],
      pagination:{},
      status:"",
      columns:[],
      infoList: [
        {type: 'input', id: 'organizationName',isRequired: true, disabled: true, label: formatMessage({id: 'budget.organization'})+" :" /*预算组织*/},
        {type: 'input', id: 'structureCode',isRequired: true, disabled: true, label: formatMessage({id: 'budget.structureCode'})+" :" /*预算表代码*/},
        {type: 'input', id: 'structureName' ,isRequired: true, label: formatMessage({id: 'budget.structureName'}) +" :"/*预算表名称*/},
        {type: 'select',options: periodStrategy ,isRequired: true, id: 'periodStrategy', label: formatMessage({id: 'budget.periodStrategy'}) +" :"/*编制期段*/},
        {type: 'input', id: 'description', label: formatMessage({id: 'budget.structureDescription'}) +" :"/*预算表描述*/},
        {type: 'switch', id: 'isEnabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],
      columnGroup:{
        company:[
          {                        /*公司代码*/
            title:formatMessage({id:"structure.companyCode"}), key: "companyCode", dataIndex: 'companyCode'
          },
          {                        /*公司代码*/
            title:formatMessage({id:"structure.companyDescription"}), key: "description", dataIndex: 'description'
          },
          {                        /*公司类型*/
            title:formatMessage({id:"structure.companyType"}), key: "companyType", dataIndex: 'companyType'
          },
          {                        /*启用*/
            title:formatMessage({id:"structure.enablement"}), key: "enablement", dataIndex: 'enablement',width:'10%'
          },
        ],
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
          },]
      },
      tabs: [
        {key: 'dimension', name: formatMessage({id:"structure.dimensionDistribute"})}, /*维度分配*/
        {key: 'company', name: formatMessage({id:"structure.companyDistribute"})}  /*公司分配*/
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
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/${this.props.params.structureId}`).then((response)=> {
      this.setState({
        columns: this.state.columnGroup.dimension,
        structure: response.status === 200 ? response.data : null
      });
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
        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        this.setState({
          structure: response.data,
          updateState: true
        });
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
    const { infoList, updateState, structure, loading, showSlideFrameUpdate, total, data, columns, pagination, status, showSlideFrame, companyListSelector} = this.state;
    return(
      <div className="budget-structure-detail">
        <BasicInfo
            infoList={infoList}
            infoData={structure}
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
        <SlideFrame title="编辑维度"
                    show={showSlideFrameUpdate}
                    content={NewDimension}
                    afterClose={this.handleCloseSlideUpdae}
                    onClose={() => this.showSlideUpdate(false)}/>

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
