/**
 *  created by jsq on 2017/11/10
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import config from 'config'
import { Form, Button, Select, Checkbox, Input, Switch, Icon, Alert , Tabs, Table, message, Popconfirm  } from 'antd'

import ListSelector from 'components/list-selector.js'
import BasicInfo from 'components/basic-info'
import selectorData from 'share/selectorData'
import 'styles/setting/department-group/department-group-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DepartmentGroupDetail extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      batchDelete: true,
      buttonLoading: false,
      deptListSelector: false,  //控制部门选则弹框
      deptGroup:{},
      data: [],
      edit: false,
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
        {type: 'input', id: 'deptGroupCode', isRequired: true, disabled: true, label: "部门组代码"+" :"},
        {type: 'input', id: 'description', isRequired: true, disabled: true, label: "部门组名称"+" :" },
        {type: 'switch', id: 'enabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],
        deptSelectorItem:{
        title: "部门",
        url:  `${config.baseUrl}/api/DepartmentGroup/selectDepartmentByGroupCodeAndDescription`,
        searchForm: [
          {type: 'input', id: 'deptGroupCode', label: '部门号', defaultValue: ''},
          {type: 'input', id: 'description', label: '部门名称', defaultValue: ''},
        ],
        columns: [
          {title: '部门号', dataIndex: 'custDeptNumber'},
          {title: '部门名称', dataIndex: 'name'}
        ],
        key: 'departmentId'
      },
      columns: [
        {title: formatMessage({id:'setting.deptCode'}), key: 'custDeptNumber', dataIndex: 'custDeptNumber'},/*部门代码代码*/
        {title: formatMessage({id:'setting.deptName'}), key: 'name', dataIndex: 'name'}, /*部门明称*/
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e,record)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)},  //操作
      ],
    }
  }

  deleteItem = (e,record) => {
    this.setState({loading: true});
    let param = [];
    typeof record === 'undefined' ? param = this.state.selectedEntityOIDs : param.push(record.departmentDetailId);
    httpFetch.delete(`${config.baseUrl}/api/DepartmentGroupDetail/BatchDeleteByIds`,param).then(response => {

      if(typeof record !== 'undefined'){
        message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name: record.name})); // name删除成功
      }
      this.setState({
        selectedRowKeys:[],
        selectedEntityOIDs:[]
      },this.getList());

    }).catch((e)=>{
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.operate.filed"})},${e.response.data.message}`)
      }
    })
  };

  componentWillMount(){
    console.log(this.props)
    httpFetch.get(`${config.baseUrl}/api/DepartmentGroup/selectById?id=${this.props.params.id}`).then((response)=>{
      if(response.status === 200){
         this.setState({
          deptGroup: response.data
        })
      }
    });
    this.getList();
  }


  //保存所做的详情修改
  handleUpdate = (value) => {
    value.id = this.props.params.id;
    httpFetch.post(`${config.baseUrl}/api/DepartmentGroup/insertOrUpdate`,value).then((response)=>{
      if(response) {
        console.log(response)
        message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
        this.setState({
          deptGroup: response.data,
          edit: true
        })
      }
    }).catch((e)=>{
      if(e.response){
        message.error(this.props.intl.formatMessage({id:"common.operate.filed"}),`${e.response.data.message}`)
      }
    })
  };

  //查询部门组详情
  getList(){
    httpFetch.get(`${config.baseUrl}/api/DepartmentGroup/selectDepartmentByGroupId?departmentGroupId=${this.props.params.id}`).then((response)=>{
      console.log(response)
      if(response.status === 200){
        response.data.map((item)=>{
          item.key = item.departmentDetailId
        });
        let pagination = this.state.pagination;
        pagination.total = Number(response.headers['x-total-count']);
        this.setState({
          loading: false,
          data: response.data,
          pagination
        },()=>{
          this.refreshRowSelection()
        })
      }
    })
  }


  //控制是否编辑
  handleEdit = (flag) => {
    this.setState({edit: flag})
  };

  //控制是否弹出部门列表
  showListSelector = (flag) =>{
    this.setState({
      deptListSelector: flag
    })
  };

  //点击弹框ok，保存部门
  handleListOk = (result) => {
    let param = [];
    result.result.map((item)=>{
      param.push({departmentGroupId: this.props.params.id, departmentId: item.departmentId})
    });
    httpFetch.post(`${config.baseUrl}/api/DepartmentGroupDetail/BatchAddDepartmentGroupDetail`,param).then((response)=>{
      if(response.status === 200){
        this.setState({
          loading: true,
          deptListSelector: false
        },this.getList())
      }
    });
  };

  //返回部门组
  handleBack = () => {
    this.context.router.push(menuRoute.getMenuItemByAttr('department-group', 'key').url);
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
      temp.push(record.departmentDetailId);
    else
      temp.delete(record.departmentDetailId);
    this.setState({
      selectedEntityOIDs: temp,
      batchDelete: temp.length>0 ? false : true
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.departmentDetailId)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.departmentDetailId)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
      batchDelete: temp.length>0 ? false : true
    })
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.departmentDetailId === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  render(){
    const { edit, batchDelete, pagination, columns, data, infoList, deptGroup, deptSelectorItem, deptListSelector, selectedRowKeys} = this.state;

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
          infoData={deptGroup}
          updateHandle={this.handleUpdate}
          updateState={edit}/>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.showListSelector(true)}>{this.props.intl.formatMessage({id: 'common.add'})}</Button>  {/*添加公司*/}
            <Button disabled={batchDelete} onClick={this.deleteItem}>{this.props.intl.formatMessage({id: 'common.delete'})}</Button>
            </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          onChange={this.onChangePager}
          rowSelection={rowSelection}
          pagination={pagination}
          size="middle"
          bordered/>
        <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}><Icon type="rollback" style={{marginRight:'5px'}}/>返回</a>

        <ListSelector type="company_item"
                      visible={deptListSelector}
                      onOk={this.handleListOk}
                      selectorItem={deptSelectorItem}
                      extraParams={{departmentGroupId: this.props.params.id}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>)
  }
}
DepartmentGroupDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedDepartmentGroupDetail = Form.create()(DepartmentGroupDetail);

export default connect(mapStateToProps)(injectIntl(WrappedDepartmentGroupDetail));

