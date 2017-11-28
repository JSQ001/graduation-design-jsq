/**
 *  created by jsq on 2017/11/10
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import config from 'config'
import { Form, Button, Select, Popover, Input, Switch, Icon, Popconfirm , Tabs, Table, message  } from 'antd'

import ListSelector from 'components/list-selector.js'
import BasicInfo from 'components/basic-info'
import 'styles/setting/company-group/company-group-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class CompanyGroupDetail extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      buttonLoading: false,
      batchCompany: true,
      companyListSelector: false,  //控制公司选则弹框
      companyGroup:{},
      data: [],
      edit: false,
      lov: {
        type: "company",
        visible: false,
        listSelectedData:{}
      },
      selectedRowKeys: [],
      selectedEntityOIDs: [],   //已选择的列表项的OIDs
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      infoList: [
        {type: 'input', id: 'companyGroupCode', isRequired: true, disabled: true, label: "公司组代码"+" :"},
        {type: 'input', id: 'companyGroupName', isRequired: true, label: "公司组名称"+" :" },
        {type: 'select', id: 'setOfBook', label: formatMessage({id:"budget.set.of.books"}) + " :", options: [],
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', labelKey: 'setOfBooksName', valueKey: 'id', getParams: {roleType: 'TENANT'}},
        {type: 'switch', id: 'enabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],
      columns: [
        {title: formatMessage({id:'structure.companyCode'}), key: 'companyCode', dataIndex: 'companyCode'},/*公司代码*/
        {title: formatMessage({id:'structure.companyName'}), key: 'companyName', dataIndex: 'companyName',/*公司明称*/
          render: record => (
            <span>{record ? <Popover content={record}>{record} </Popover> : '-'} </span>)
        },
        {title: formatMessage({id:'structure.companyType'}), key: 'companyType', dataIndex: 'companyType', /*公司类型*/
          render: record => (
            <span>{record ? <Popover content={record}>{record} </Popover> : '-'} </span>)},
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)},  //操作
      ],
    }
  }

  deleteItem = (e,record) =>{
    this.setState({loading: true});
    let param = [];
    typeof record === 'undefined' ? param = this.state.selectedEntityOIDs : param.push(record.id);
    httpFetch.delete(`${config.baseUrl}/api/company/group/assign/batch`,param).then(response => {
      message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name:typeof record === 'undefined' ? "" : record.companyName})); // name删除成功
      this.setState({
        selectedRowKeys:[],
        selectedEntityOIDs:[],
        batchCompany: true
      },this.getList());
    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})},${e.response.data.message}`)
      }
    })
  };

  componentWillMount(){
    //根据路径上的id,查出该条完整数据
    httpFetch.get(`${config.baseUrl}/api/company/group/${this.props.params.id}`).then((response)=>{
      if(response.status === 200){
        response.data.setOfBook = {label: "假账套", value: response.data.setOfBooksId}};
        this.setState({
          companyGroup: response.data
        },
         this.getList())
        });
  }


  //保存所做的详情修改
  handleUpdate = (value) => {
    value.id = this.props.params.id;
    httpFetch.put(`${config.baseUrl}/api/company/group`,value).then((response)=>{
      if(response) {
        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        response.data.setOfBook = {label: "假账套", value: response.data.setOfBooksId};
        this.setState({
          companyGroup: response.data,
          edit: true
        })
      }
    })
  };

  //查询公司组子公司
  getList(){
    httpFetch.get(`${config.baseUrl}/api/company/group/assign/query/dto?companyGroupId=${this.props.params.id}`).then((response)=>{
      response.data.map((item)=>{
        item.key = item.id
      });
      if(response.status === 200){
        this.setState({
          loading: false,
          data: response.data
        })
      }
    })
  }


  //控制是否编辑
  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    let lov = this.state.lov;
    lov.visible = flag;
    this.setState({
      lov
    })
  };


  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('company-group', 'key').url);
  };

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.id);
    else
      temp.delete(record.id);
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.id === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    let lov = this.state.lov;
    lov.visible = flag;
    this.setState({lov})
  };

  //处理公司弹框点击ok,添加公司
  handleListOk = (result) => {
    let lov = this.state.lov;
    let param = [];
    result.result.map((item)=>{
      param.push({companyGroupId: this.props.params.id, companyId: item.id})
    });
    httpFetch.post(`${config.baseUrl}/api/company/group/assign/batch`,param).then((response)=>{
      if(response.status === 200){
        lov.visible = false;
        message.success(`${this.props.intl.formatMessage({id: "common.operate.success"})}`);
        this.setState({
          loading: true,
          lov
        },this.getList())
      }
    });
  };

  render(){
    const { edit, lov, pagination, companyGroup, columns, data, infoList, selectedRowKeys, batchCompany} = this.state;
    const {formatMessage} = this.props.intl;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };

    return(
      <div className="budget-item-detail">
        <BasicInfo
          infoList={infoList}
          infoData={companyGroup}
          updateHandle={this.handleUpdate}
          updateState={edit}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.showListSelector(true)}>{formatMessage({id: 'common.add'})}</Button>  {/*添加公司*/}
            <Popconfirm onConfirm={this.deleteItem} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: ""})}>{/* 你确定要删除organizationName吗 */}
              <Button disabled={batchCompany}>{this.props.intl.formatMessage({id: 'common.delete'})}</Button>
            </Popconfirm>
          </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          pagination={pagination}
          size="middle"
          bordered/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>
        <ListSelector
          visible={lov.visible}
          type={lov.type}
          onCancel={()=>this.showListSelector(false)}
          onOk={this.handleListOk}
          extraParams={{ "companyGroupId": companyGroup.id,"setOfBooksId": companyGroup.setOfBooksId}}/>
      </div>)
  }
}
CompanyGroupDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedCompanyGroupDetail = Form.create()(CompanyGroupDetail);

export default connect(mapStateToProps)(injectIntl(WrappedCompanyGroupDetail));

