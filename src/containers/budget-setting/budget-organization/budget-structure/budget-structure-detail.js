/**
 *  created by jsq on 2017/9/20
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import debounce from 'lodash.debounce';

import { Form, Button, Select, Input, Switch, Icon, Badge, Tabs, Checkbox, Table, message, Popover  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure-detail.scss';
import SlideFrame from "components/slide-frame";
import NewDimension from 'containers/budget-setting/budget-organization/budget-structure/new-dimension'
import UpdateDimension from 'containers/budget-setting/budget-organization/budget-structure/update-dimension'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;

let periodStrategy = [];

class BudgetStructureDetail extends React.Component{

  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      //添加公司弹框
      lov: {
        type: 'company_structure', //lov类型
        visible: false,  //控制是否弹出

      },
      updateState: false,
      structure:{},
      dimension: {},
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
      label:"",
      columns:[],
      infoList: [
        {type: 'input', id: 'organizationName',isRequired: true, disabled: true, label: formatMessage({id: 'budget.organization'})+" :" /*预算组织*/},
        {type: 'input', id: 'structureCode',isRequired: true, disabled: true, label: formatMessage({id: 'budget.structureCode'})+" :" /*预算表代码*/},
        {type: 'input', id: 'structureName' ,isRequired: true, label: formatMessage({id: 'budget.structureName'}) +" :"/*预算表名称*/},
        {type: 'select',options: periodStrategy , isRequired: true, id: 'periodStrategy', label: formatMessage({id: 'budget.periodStrategy'}) +" :"/*编制期段*/},
        {type: 'input', id: 'description', label: formatMessage({id: 'budget.structureDescription'}) +" :"/*预算表描述*/},
        {type: 'switch', id: 'isEnabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],
      columnGroup:{
        company: [
            {                        /*公司代码*/
              title:formatMessage({id:"structure.companyCode"}), key: "companyCode", dataIndex: 'companyCode'
            },
            {                        /*公司名称*/
              title:formatMessage({id:"structure.companyName"}), key: "companyName", dataIndex: 'companyName'
            },
            {                        /*公司类型*/
              title:formatMessage({id:"structure.companyType"}), key: "companyTypeName", dataIndex: 'companyTypeName',
              render:recode=> <span>{recode ? recode : '-'}</span>
            },
            {                        /*启用*/
              title:formatMessage({id:"structure.enablement"}), key: "doneRegisterLead", dataIndex: 'doneRegisterLead',width:'10%',
              render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>
            },
          ],
        dimension: [
            {                        /*维度代码*/
              title:formatMessage({id:"structure.dimensionCode"}), key: "dimensionCode", dataIndex: 'dimensionCode'
            },
            {                        /*维度名称*/
              title:formatMessage({id:"structure.dimensionName"}), key: "dimensionName", dataIndex: 'dimensionName',
              render: record => (
                <span>{record ? <Popover content={record}>{record} </Popover> : '-'} </span>)
            },
            {                        /*布局位置*/
              title:formatMessage({id:"structure.layoutPosition"}), key: "layoutPositionName", dataIndex: 'layoutPositionName'
            },
            {                        /*布局顺序*/
              title:formatMessage({id:"structure.layoutPriority"}), key: "layoutPriority", dataIndex: 'layoutPriority'
            },
            {                        /*默认维值代码*/
              title:formatMessage({id:"structure.defaultDimValueCode"}), key: "defaultDimValueCode", dataIndex: 'defaultDimValueCode',
              render:recode=> <span>{recode ? recode : '-'}</span>
            },
            {                        /*默认维值名称*/
              title:formatMessage({id:"structure.defaultDimValueName"}), key: "defaultDimValueName", dataIndex: 'defaultDimValueName',
              render: record => (
                <span>{record ? <Popover content={record}>{record} </Popover> : '-'} </span>)
            },
            {title: formatMessage({id:"common.column.status"}), dataIndex: 'isEnabled', width: '15%',
              render: isEnabled => (
                <Badge status={isEnabled ? 'success' : 'error'}
                       text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
              )}, //状态
        ]
      },
      tabs: [
        {key: 'dimension', name: formatMessage({id:"structure.dimensionDistribute"})}, /*维度分配*/
        {key: 'company', name: formatMessage({id:"structure.companyDistribute"})}  /*公司分配*/
        ],
    };
    this.search = debounce(this.search,1000)
  }
  //改变启用状态
  onChangeEnabled = (e, record) => {
    this.setState({loading: true});
    record.isEnabled = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/structure/assign/companies`, record).then(() => {
      this.getList()
    })
  };

  componentWillMount(){

    //获取编制期段
    this.getSystemValueList(2002).then((response)=>{
      response.data.values.map((item)=>{
        let options = {
          label:item.messageKey, value:item.code
        };
        periodStrategy.addIfNotExist(options)
      });
    });

    //获取某预算表某行的数据
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/${this.props.params.structureId}`).then((response)=> {
      let periodStrategy = {label:response.data.periodStrategyName,value:response.data.periodStrategy};
      response.data.periodStrategy = periodStrategy;
      if(response.status === 200){
        this.setState({
          columns: this.state.columnGroup.dimension,
          structure: response.data
        });
        let infoList = this.state.infoList;
        infoList[3].disabled = response.data.usedFlag;
      }
    });
    this.getList();
  }

  //保存所做的修改
  handleUpdate = (value) => {
    value.id = this.state.structure.id;
    value.versionNumber = this.state.structure.versionNumber;
    value.organizationId = this.state.structure.organizationId;
    httpFetch.put(`${config.budgetUrl}/api/budget/structures`,value).then((response)=>{
      if(response.status === 200) {
        let structure = response.data;
        structure.organizationName = this.state.structure.organizationName;
        message.success(this.props.intl.formatMessage({id: "structure.saveSuccess"})); /*保存成功！*/
        structure.periodStrategy = {label:response.data.periodStrategyName, value:response.data.periodStrategy}
        this.setState({
          structure: structure,
          updateState: true
        },
          this.getList()
        );
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})}, ${e.response.data.message}`);
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
    let columnGroup = this.state.columnGroup;
    this.setState({
      loading: true,
      page: 0,
      data: [],
      label: key,
      columns: key === 'company' ? columnGroup.company : columnGroup.dimension
    },()=>{
      this.getList()
    });
  };

  //输入条件时的查询
  handleSearch = (e) =>{
    this.search(e.target.value)
  };

  search = (value)=>{
    this.setState({
      params:value
    })
  };

  handleCreate = (e) =>{
    this.state.label ==="company" ? this.showListSelector(true) : this.showSlide(true)
  };

  getList = ()=>{
    let params = this.state.params;
    this.state.label === "company" ?
      httpFetch.get(`${config.budgetUrl}/api/budget/structure/assign/companies/query?structureId=${this.props.params.structureId}`).then((response)=>{
        if(response.status === 200) {
          response.data.map((item)=>{
            item.key = item.id
          });
          let pagination = this.state.pagination;
          pagination.total = Number(response.headers['x-total-count']);
          this.setState({
            loading: false,
            data: response.data,
            pagination
          })
        }
      })
      :
      httpFetch.get(`${config.budgetUrl}/api/budget/structure/assign/layouts/query?structureId=${this.props.params.structureId}`).then((response)=>{
        if(response.status === 200){
          response.data.map((item)=>{
            item.key = item.id
          });
          let pagination = this.state.pagination;
          pagination.total = Number(response.headers['x-total-count']);
          this.setState({
            loading: false,
            data: response.data,
            pagination
          })
        }
      })
  };


  //控制新建维度侧滑
  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  //处理关闭新建侧滑维度页面
  handleCloseSlide = (params) => {
    this.setState({
      showSlideFrame: false,
      loading: typeof params === 'undefined' ? false : true
    });
    if(params) {
      this.getList();
    }
  };

  //点击行，进入维度编辑页面
  handleRowClick = (record, index, event) =>{
    if(this.state.label !== 'company'){
      let defaultDimensionCode = [];
      let defaultDimensionValue = [];
      defaultDimensionCode.push({ id: record.dimensionId, code: record.dimensionCode,key: record.dimensionId});
      defaultDimensionValue.push({ id: record.defaultDimValueId, code: record.defaultDimValueCode,key: record.defaultDimValueId});
      record.defaultDimensionCode = defaultDimensionCode;
      record.defaultDimensionValue = defaultDimensionValue;
      this.setState({
        showSlideFrameUpdate: true,
        dimension:record
      })
    }
  };

  showSlideUpdate = (flag)=>{
    this.setState({
      showSlideFrameUpdate: flag
    })
  };

  //关闭新建侧滑维度页面
  handleCloseSlideUpdate = (params) => {
    this.setState({
      showSlideFrameUpdate: false,
      loading: typeof params === 'undefined' ? false : true
    });
    if(params) {
      this.getList();
    }
  };

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    let lov = this.state.lov;
    lov.visible = flag;
    this.setState({lov})
  };

  //处理公司弹框点击ok,分配公司
  handleListOk = (result) => {
    let company = [];
    result.result.map((item)=>{
      company.push({companyId:item.id,structureId:this.props.params.structureId,isEnabled:item.isEnabled})
    });
    httpFetch.post(`${config.budgetUrl}/api/budget/structure/assign/companies/batch`,company).then((response)=>{
      if(response.status === 200) {
        this.showListSelector(false);
        this.setState({
            data: response.data,
          },
          this.getList()
        );
      }
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})}, ${e.response.data.message}`);
      }
      this.setState({loading: false});
    });
  };

  //返回预算表页面
  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetOrganizationDetail.url.replace(':id', this.props.params.id)+ '?tab=STRUCTURE');
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { infoList, dimension, updateState, structure, loading, showSlideFrameUpdate, data, columns, pagination, label, showSlideFrame, lov} = this.state;

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
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{label === 'company'? this.props.intl.formatMessage({id:'structure.addCompany'}) :
              this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新建*/}
          </div>
        </div>
        <Table
            dataSource={data}
            columns={columns}
            loading={loading}
            onRowClick={this.handleRowClick}
            pagination={pagination}
            size="middle"
            bordered/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>

        <SlideFrame title="新建维度"
                    show={showSlideFrame}
                    content={NewDimension}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={structure}/>
        <SlideFrame title="编辑维度"
                    show={showSlideFrameUpdate}
                    content={UpdateDimension}
                    afterClose={this.handleCloseSlideUpdate}
                    onClose={() => this.showSlideUpdate(false)}
                    params={dimension}/>

        <ListSelector type={lov.type}
                      visible={lov.visible}
                      extraParams={{"structureId": structure.id}}
                      onOk={this.handleListOk}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>
    )
  }

}
BudgetStructureDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetStructureDetail = Form.create()(BudgetStructureDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetStructureDetail));
