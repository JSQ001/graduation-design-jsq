import React from 'react';
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'


import {Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message} from 'antd'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure-detail.scss';
import SlideFrame from "components/slide-frame"
import NewDimension from 'containers/budget-setting/budget-organization/budget-structure/new-dimension'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;


class WrappedCompanyMaintainDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      saving: false,
      loading: true,
      editing: false,
      infoData:{},
      infoList: [
        {type: 'input', label: this.props.intl.formatMessage({id: "company.companyCode"}), id: "companyCode",labelKey:'companyCode'},   /*公司代码*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.name"}), id: "name", labelKey: 'name' }, /*公司名称*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.companyType"}), id: "companyType", labelKey: 'companyType'},    /*公司类型*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.setOfBooksName"}), id: "setOfBooksName", labelKey: 'setOfBooksName' },  /*账套*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.legalEntityName"}), id: "legalEntityName", labelKey: 'legalEntityName'  },  /*法人*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.companyLevelName"}), id: "companyLevelName", labelKey: 'companyLevelName' },    /*公司级别*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.parentCompanyName"}), id: "parentCompanyName", labelKey: 'parentCompanyName' },    /*上级机构*/
        {type: 'date', label: this.props.intl.formatMessage({id: "company.startDateActive"}), id: "startDateActive",  labelKey: 'startDateActive'},  /*有效日期从*/
        {type: 'date', label: this.props.intl.formatMessage({id: "company.endDateActive"}), id: "endDateActive",labelKey:'endDateActive'},  /*有效日期至*/
        {type: 'input', label: this.props.intl.formatMessage({id: "company.address"}), id: "address", labelKey: 'address' }   /*地址*/

      ],
      tabs: [
        {key: 'BANK', name: "银行账户信息"}, /*银行账户信息*/
        {key: 'USER', name: "员工信息"}  /*公司分配*/
      ],
      typeData: {},
      data: [],
      tabsData: {
        BANK:{
          url: ``,
          rowSelection:{},
          columns:
            [
              {title: "账户代码", key: "1", dataIndex: '1', width: '16%'},               /*账户代码*/
              {title: "银行代码", key: "2", dataIndex: '2', width: '16%'},               /*银行代码*/
              {title: "银行名称", key: "3", dataIndex: '3', width: '16%'},               /*银行名称*/
              {title: "账户名称", key: "4", dataIndex: '4', width: '16%'},               /*账户名称*/
              {title: "账号", key: "5", dataIndex: '5', width: '16%'},                   /*账号*/
              {title: "国家", key: "6", dataIndex: '6', width: '16%'},                   /*国家*/
              {title: "开户地", key: "7", dataIndex: '7', width: '16%'},                 /*开户地*/
            ]
        },
        rowSelectionData:[],
        USER:{
          url: `${config.baseUrl}/api/users/all/${this.props.params.companyOId}`,
          rowSelection:{
            type:'checkbox',
            selectedRowKeys: [],
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAll
          },
          columns:
            [
              {title: "姓名", key: "fullName", dataIndex: 'fullName', width: '16%'},                   /*姓名*/
              {title: "工号", key: "id", dataIndex: 'id', width: '8%'},                             /*工号*/
              {title: "部门", key: "departmentName", dataIndex: 'departmentName', width: '10%'},    /*部门*/
              {title: "联系方式", key: "mobile", dataIndex: 'mobile', width: '10%'},                /*联系方式*/
              {title: "邮箱", key: "email", dataIndex: 'email', width: '10%'},                      /*邮箱*/
            ]

        },
      },
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      nowStatus: 'BANK',
      showListSelector: false,
      newData: []
    }
  }

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys) => {
    let rowSelection = this.state.tabsData.USER.rowSelection;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({});
  };


  onSelectItem = () =>{

  }

  onSelectAll = () =>{

  }



  componentWillMount() {
    this.getCompanyByCompanyOID(this.props.params.companyOId);
    this.getList(this.state.nowStatus);
  }

  //根据companyCode获取公司
  getCompanyByCode = (companyCode) => {
    httpFetch.get(`${config.baseUrl}/api/company/by/term?companyCode=${companyCode}`).then((response) => {
      console.log(response.data);
      this.setState({
        infoData: response.data
      })
    })
  }

  //根据companyDId获取公司
  getCompanyByCompanyOID (companyOID){
    httpFetch.get(`${config.baseUrl}/api/companies/${companyOID}`).then((response) => {
      console.log(response.data);
      this.setState({
        infoData: response.data
      })
    }).catch((e)=>{
      message.error(e.response.data.message);
    })
  }


  getList = (key) => {
    const { tabsData, page, pageSize } = this.state;
    let url = tabsData[key].url;
    if(url){
      //&page=${page}&size=${pageSize}
      return httpFetch.get(`${url}`).then(response => {
        response.data.map((item, index)=>{
          item.key = item.id ? item.id : index;
        });
        this.setState({
          data: response.data,
          loading: false,
          pagination: {
            total: Number(response.headers['x-total-count']),
            onChange: this.onChangePager,
            current: this.state.page + 1
          }
        })
      })
    }
  };

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList(this.state.nowStatus);
      })
  };


  //公司详情编辑
  updateHandleInfo = (params) => {
    this.setState({ editing: true });
    httpFetch.put(`${config.budgetUrl}`, Object.assign(this.state.typeData, params)).then(response => {
      message.success('修改成功');
      let data = response.data;
      this.setState({
        typeData: data,
        updateState: true,
        editing: false
      });
    }).catch(e => {
      this.setState({ editing: false })
    });
  };

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  //点击
  onChangeTabs = (key) =>{
    this.setState({
      nowStatus: key,
      loading: true,
      page: 0
    }, ()=>{
      this.getList(key);
    })
  };

  renderTable(){
    const {infoList, infoData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState, editing} = this.state;

    if(this.state.nowStatus === "USER"){
      return    <Table columns={tabsData[nowStatus].columns}
                       dataSource={data}
                       pagination={pagination}
                       loading={loading}
                       bordered
                       size="middle"
                       rowSelection={tabsData[nowStatus].rowSelection}/>
    }
    else {
      return     <Table columns={tabsData[nowStatus].columns}
                        dataSource={data}
                        pagination={pagination}
                        loading={loading}
                        bordered
                        size="middle"
                    />
    }
  }

  //渲染按钮
  renderButton(){
    const {infoList, infoData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState, editing} = this.state;
    if(this.state.nowStatus === "USER"){
        return (
          <div>
          <Button type="primary" onClick={this.handleNew}>员工导入</Button>
          <Button>移动</Button>
          </div>
        )
    }else {
      return(
        <div>
          <Button type="primary" onClick={this.handleNew} loading={saving}>新建</Button>
        </div>
      )
    }
  }

  render() {
    const {infoList, infoData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState, editing} = this.state;
    return (
      <div>
        <BasicInfo infoList={infoList}
                   infoData={infoData}
                   updateHandle={this.updateHandleInfo}
                   updateState={updateState}
                   loading={editing}/>
        <Tabs onChange={this.onChangeTabs} style={{ marginTop: 20 }}>
          {this.renderTabs()}
        </Tabs>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
          <div className="table-header-buttons">

          </div>
        </div>
        {this.renderTable()}

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
