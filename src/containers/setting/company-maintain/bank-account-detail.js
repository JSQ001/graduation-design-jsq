/**
 * Created by 13576 on 2017/11/22.
 */
//bank-account-detail.js //BankAccountDetail
import React from 'react';
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
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


class BankAccountDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showImportFrame:false,
      updateState: false,
      saving: false,
      loading: true,
      editing: false,
      infoData:{},
      selectedRowKeys:[],
      infoList: [
        {
          /*开户银行*/
          type: 'select', label:"开户银行", id: "11", options: [], method: 'get',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksCode', valueKey: 'id', isRequired: true
        },
        {
          /*银行代码*/
          type: 'select', label: "银行代码",id: "12", options: [], method: 'get',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksCode', valueKey: 'id', isRequired: true   },
        {
          /*开户行联行号*/
          type: 'value_list', label:"开户行联行号", id: "companyType", options: [], valueListCode:1011,isRequired: true
        },
        {
          /*开户支行名称*/
          type: 'select', label: "开户支行名称", id: "13", options: [], method: 'get',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksCode', valueKey: 'id', isRequired: true
        },
        {
          /*开户行所在地——国家*/
          type: 'select', label: "开户行所在地——国家", id: "14", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/all/legalentitys`,
          labelKey: 'entityName', valueKey: 'id',isRequired: true
        },
        {
          /*省/市/县*/
          type: 'select', label:"省/市/县", id: "15", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/companyLevel/selectByTenantId`,
          labelKey: 'description', valueKey: 'id', isRequired: true
        },
        {
          /*开户支行Swift Code*/
          type: 'input', label:"开户支行Swift Code", id: "1", isRequired: true
        },
        {
          /*银行账户名称*/
          type: 'input', label:"银行账户名称", id: "2", isRequired: true
        },
        {
          /*银行账户账号*/
          type: 'input', label:"银行账户账号", id: "3", isRequired: true
        },
        {
          /*账户代码*/
          type: 'input', label:"账户代码", id: "4", isRequired: true
        },
        {
          /* 币种*/
          type: 'select', label:"币种", id: "parentCompanyId", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id', isRequired: true
        },
        {
          /* 银行科目*/type: 'select', label:"银行科目", id: "54", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id'
        },

        {/*状态*/
          type:'switch', label:'状态', id:"enabled", defaultValue:true, isRequired: true
        }
        ,
        {
          /*备注*/
          type: 'input', label:"备注", id: "5555",
        },

      ],
      tabs: [
        {key: 'AUTHORIZATION', name: "账户授权"}, /*账户授权*/
        {key: 'APY_TYPE', name:"付款方式"}  /*付款方式*/
      ],
      typeData: {},
      data: [],
      tabsData: {
        AUTHORIZATION:{
          url: ``,
          rowSelection:null,
          columns:
            [
              {title: "公司代码", key: "1", dataIndex: '1', width: '16%'},
              {title: "公司名称", key: "2", dataIndex: '2', width: '16%'},
              {title: "部门代码", key: "3", dataIndex: '3', width: '16%'},
              {title: "部门名称", key: "4", dataIndex: '4', width: '16%'},
              {title: "职务编码", key: "5", dataIndex: '5', width: '16%'},
              {title: "职务名称", key: "6", dataIndex: '6', width: '16%'},
              {title: "被授权员工", key: "7", dataIndex: '7', width: '16%'},
              {title: "有效日期从", key: "8", dataIndex: '8', width: '16%'},
              {title: "有效日期至", key: "9", dataIndex: '9', width: '16%'},
              {title: "状态", key: "10", dataIndex: '10', width: '16%'},
            ]
        },
        APY_TYPE:{
          rowSelection:null,
          url: `${config.baseUrl}/api/users/all/${this.props.params.companyOId}`,
          columns:
            [
              {title: "付款方式类型", key: "1", dataIndex: '1'},
              {title: "付款方式代码", key: "2", dataIndex: '2'},
              {title: "付款方式名称", key: "3", dataIndex: '3'},   

            ]

        },
      },
      rowSelection:{
        type:'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
      },
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      nowStatus: 'AUTHORIZATION',
      showListSelector: false,
      newData: [],
      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newBankAccountPage:menuRoute.getRouteItem('new-bank-account','key'),                    //新建银行账户
      bankAccountPageDetail:menuRoute.getRouteItem('bank-account-detail','key'),              //银行账户详情
    }
  }

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys,selectedRows) => {
    console.log(selectedRowKeys);
    console.log("selectedRowKeys")
    let tabsData = this.state.tabsData;
    tabsData.APY_TYPE.rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({tabsData,selectedRowKeys});
  };



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
        loading: true,
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
  renderTabs = () =>{
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
      data:[],
      pagination: {
        total: 0
      },
      page: 0
    }, ()=>{
      this.getList(key);
    })
  };

  //新建
  handleNew = () => {
   if(this.state.nowStatus === "APY_TYPE"){

   }else {

   }
  };



  submitHandle = (value) =>{
    const companyOIDTo = (value.result)[0].companyOID;
    const companyOIDFrom =this.props.params.companyOId;
    const selectedRowKeys = this.state.selectedRowKeys;
    let path = `${config.baseUrl}/api/users/move?companyOIDFrom=${companyOIDFrom}&companyOIDTo=${companyOIDTo}&selectMode=default?`
    selectedRowKeys.map((item)=>{
      path =`${path}&userOIDs=${item}`
    })
    httpFetch.put(path).then((req)=>{
      message.success("操作成功");
      this.getCompanyByCompanyOID(companyOIDFrom);
      this.setState({
        selectedRowKeys:[],
      })
    }).catch((e)=>{
      message.error(e.response.data)
    })
    this.showImport(false)
  }

  //员工移动
  removeUser = () =>{
    this.showImport(true)
  }

  showImport = (value) =>{
    this.setState({
      showImportFrame:value
    })
  }

  CancelHandle = () => {
    this.showImport(false)
  }



  render() {
    const {infoList,selectedRowKeys, rowSelection,infoData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState, editing} = this.state;
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
          <div>
            <div className="table-header-title">共 {pagination.total} 条数据</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={this.handleNew} loading={saving}>新建</Button>
            </div>
          </div>
        </div>
        <Table columns={tabsData[nowStatus].columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"
               rowKey={(reCode)=>{return reCode.id}}
               rowSelection={tabsData[nowStatus].rowSelection}/>


        <ListSelector visible={this.state.showImportFrame}
                      onOk={this.submitHandle}
                      onCancel={this.CancelHandle}
                      type='user_move_select_company'
                      single={true}
                      extraParams={{"versionId": this.props.params.versionId}}
        />

      </div>
    )
  }

}

BankAccountDetail.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(injectIntl(BankAccountDetail));

