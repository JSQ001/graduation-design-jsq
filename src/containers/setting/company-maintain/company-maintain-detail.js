import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import config from 'config'


import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message, Popover } from 'antd'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure-detail.scss';
import SlideFrame from "components/slide-frame"
import NewDimension from 'containers/budget-setting/budget-organization/budget-structure/new-dimension'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

import EditBankAccount from './edit-bank-account'

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;


class WrappedCompanyMaintainDetail extends React.Component {

  constructor(props) {
    super(props);

    const { formatMessage } = this.props.intl;
    this.state = {
      showImportFrame: false,
      updateState: false,
      saving: false,
      loading: true,
      editing: false,
      infoData: {},
      selectedRowKeys: [],
      showSlideFrame: false,
      updateParams: {},
      tabs: [
        { key: 'BANK', name: formatMessage({ id: "company.maintain.bankAccountInfo" }) }, /*银行账户信息*/
        { key: 'USER', name: formatMessage({ id: "company.maintain.userInfo" }) }  /*公司分配*/
      ],
      typeData: {},
      data: [],
      tabsData: {
        BANK: {
          url: `${config.baseUrl}/api/CompanyBank/selectByCompanyId?companyId=${this.props.params.companyId}`,
          rowSelection: null,
          columns:
            [
              { title: formatMessage({ id: "bank.account.bankName" }), dataIndex: 'bankName', width: '16%' },
              { title: formatMessage({ id: "bank.account.country" }), dataIndex: 'country', width: '16%' },
              {
                title: formatMessage({ id: "bank.account.opening" }), dataIndex: 'city', width: '16%', render: (remark, record, index) => (
                  <Popover content={record.province + '/' + record.city}>
                    {record.province}/{record.city}
                  </Popover>)
              },
              { title: formatMessage({ id: "bank.account.bankAddress" }), dataIndex: 'bankAddress', width: '16%' },
              { title: formatMessage({ id: "bank.account.bankAccountName" }), dataIndex: 'bankAccountName', width: '16%' },
              { title: formatMessage({ id: "bank.account.bankAccountNumber" }), dataIndex: 'bankAccountNumber', width: '16%' },                   /*国家*/
              { title: formatMessage({ id: "bank.account.swiftCode" }), dataIndex: 'swiftCode', width: '16%' },
              {
                title: formatMessage({ id: "bank.account.remark" }), dataIndex: 'remark', width: '16%', render: remark => (
                  <Popover content={remark}>
                    {remark}
                  </Popover>)
              },
              {
                title: formatMessage({ id: "common.operation" }), dataIndex: 'operation', width: '14%',
                render: (text, record) => (
                  <span>
                    <a style={{ marginRight: 10 }} onClick={(e) => this.rowClick(e, record)}>{formatMessage({ id: "company.maintain.detail" })}</a>
                    <a onClick={(e) => this.editItem(e, record)}>{formatMessage({ id: "common.edit" })}</a>
                  </span>)
              }
            ]
        },
        USER: {
          rowSelection: {
            type: 'checkbox',
            selectedRowKeys: [],
            onChange: this.onSelectChange,
          },
          url: `${config.baseUrl}/api/users/all/${this.props.params.companyOId}`,
          columns:
            [
              { title: formatMessage({ id: "company.maintain.fullName" }), key: "fullName", dataIndex: 'fullName', width: '16%' },                   /*姓名*/
              { title: formatMessage({ id: "company.maintain.id" }), key: "id", dataIndex: 'id', width: '8%' },                             /*工号*/
              { title: formatMessage({ id: "company.maintain.departmentName" }), key: "departmentName", dataIndex: 'departmentName', width: '10%' },    /*部门*/
              { title: formatMessage({ id: "company.maintain.mobile" }), key: "mobile", dataIndex: 'mobile', width: '10%' },                /*联系方式*/
              { title: formatMessage({ id: "company.maintain.email" }), key: "email", dataIndex: 'email', width: '10%' },                      /*邮箱*/
            ]

        },
      },
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
      },
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      nowStatus: 'BANK',
      showListSelector: false,
      newData: [],
      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newBankAccountPage: menuRoute.getRouteItem('new-bank-account', 'key'),                    //新建银行账户
      bankAccountPageDetail: menuRoute.getRouteItem('bank-account-detail', 'key'),              //银行账户详情
    }
  }

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let tabsData = this.state.tabsData;
    tabsData.USER.rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ tabsData, selectedRowKeys });
  };


  //编辑
  editItem = (e, record) => {
    this.setState({
      updateParams: { record },
      showSlideFrame: true
    })
  }

  componentWillMount() {
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

  getList = (key) => {
    const { tabsData, page, pageSize } = this.state;
    let url = tabsData[key].url;
    if (url) {
      //&page=${page}&size=${pageSize}
      return httpFetch.get(url).then(response => {
        response.data.map((item, index) => {
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
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true,
      }, () => {
        this.getList(this.state.nowStatus);
      })
  };

  //渲染Tabs
  renderTabs = () => {
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key} />
      })
    )
  }

  //点击
  onChangeTabs = (key) => {
    this.setState({
      nowStatus: key,
      loading: true,
      data: [],
      pagination: {
        total: 0
      },
      page: 0
    }, () => {
      this.getList(key);
    })
  };

  //新建
  handleNew = () => {
    let path = this.state.newBankAccountPage.url.replace(":companyId", this.props.params.companyId);
    this.context.router.push(path);
  };

  //侧拉关闭后
  handleCloseNewSlide = (params) => {
    this.setState({
      showSlideFrame: false
    }, () => {
      if (params) {
        this.getList(this.state.nowStatus);
      }
    })
  };

  //渲染按钮
  renderButton = () => {
    const { saving, pagination, selectedRowKeys } = this.state;
    const { formatMessage } = this.props.intl;
    if (this.state.nowStatus === "USER") {
      return (
        <div>
          <div className="table-header-title">共 {pagination.total} 条数据 / 已经选择了 {this.state.selectedRowKeys.length} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary">员工导入</Button>
            <Button onClick={this.removeUser} disabled={selectedRowKeys.length <= 0}>移动</Button>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="table-header-title">共 {pagination.total} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew} loading={saving}>{formatMessage({ id: "common.create" })}</Button>
          </div>
        </div>
      )
    }
  }


  //提交表单
  submitHandle = (value) => {
    const companyOIDTo = (value.result)[0].companyOID;
    const companyOIDFrom = this.props.params.companyOId;
    const selectedRowKeys = this.state.selectedRowKeys;
    let path = `${config.baseUrl}/api/users/move?companyOIDFrom=${companyOIDFrom}&companyOIDTo=${companyOIDTo}&selectMode=default?`
    selectedRowKeys.map((item) => {
      path = `${path}&userOIDs=${item}`
    })
    httpFetch.put(path).then((req) => {
      message.success(this.props.intl.formatMessage({ id: 'common.operate.success' }));
      this.setState({
        selectedRowKeys: [],
      })
    }).catch((e) => {
      message.error(e.response.data)
    })
    this.showImport(false)
  }

  //员工移动
  removeUser = () => {
    this.showImport(true)
  }

  showImport = (value) => {
    this.setState({
      showImportFrame: value
    })
  }

  CancelHandle = () => {
    this.showImport(false)
  }

  rowClick = (e, record) => {
    //跳转到详情页面
    let path = this.state.bankAccountPageDetail.url.replace(":companyBankId", record.id);
    this.context.router.push(path);
  }

  render() {
    const { infoList, selectedRowKeys, rowSelection, infoData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState, editing, showSlideFrame, updateParams } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Tabs onChange={this.onChangeTabs} style={{ marginTop: 20 }}>
          {this.renderTabs()}
        </Tabs>
        <div className="table-header">
          {this.renderButton()}
        </div>
        <Table columns={tabsData[nowStatus].columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          bordered
          size="middle"
          rowKey={(reCode) => { return reCode.userOID }}
          rowSelection={tabsData[nowStatus].rowSelection}
        />

        <ListSelector visible={this.state.showImportFrame}
          onOk={this.submitHandle}
          onCancel={this.CancelHandle}
          type='user_move_select_company'
          single={true}
          extraParams={{ "versionId": this.props.params.versionId }}
        />

        <SlideFrame title={formatMessage({ id: "company.maintain.editBankAccount" })}
          show={showSlideFrame}
          content={EditBankAccount}
          afterClose={this.handleCloseNewSlide}
          onClose={() => this.setState({ showSlideFrame: false })}
          params={updateParams} />
      </div>
    )
  }

}

WrappedCompanyMaintainDetail.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
  }
}

const CompanyMaintainDetail = Form.create()(WrappedCompanyMaintainDetail);

export default connect(mapStateToProps)(injectIntl(CompanyMaintainDetail));
