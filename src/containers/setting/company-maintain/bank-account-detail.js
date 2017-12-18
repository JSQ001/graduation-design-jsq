/**
 * Created by 13576 on 2017/11/22.
 */
//bank-account-detail.js //BankAccountDetail
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import config from 'config'


import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message, Popconfirm } from 'antd'

import 'styles/budget-setting/budget-organization/budget-structure/budget-structure-detail.scss';
import SlideFrame from "components/slide-frame"
import NewDimension from 'containers/budget-setting/budget-organization/budget-structure/new-dimension'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'
import AddAuthorization from './add-authorization'
import AddPayWay from './add-pay-way'
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;


class BankAccountDetail extends React.Component {

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
      showSlideFrame: false,    //控制授权侧拉
      visibleSlideFrame: false,  //控制付款方式侧拉
      updateParams: {},
      editParams: {},
      tabs: [
        { key: 'AUTHORIZATION', name: formatMessage({ id: "bank.account.authorization" }) }, /*账户授权*/
        { key: 'APY_TYPE', name: formatMessage({ id: "pay.way" }) }  /*付款方式*/
      ],
      typeData: {},
      data: [],
      tabsData: {
        AUTHORIZATION: {
          url: `${config.baseUrl}/api/companyBankAuth/selectCompanyBankId?id=${this.props.params.companyBankId}`,
          rowSelection: null,
          columns:
            [
              { title: formatMessage({ id: "bank.account.companyCode" }), dataIndex: 'companyCode', width: '16%' },
              { title: formatMessage({ id: "bank.account.companyName" }), dataIndex: 'companyName', width: '16%' },
              { title: formatMessage({ id: "bank.account.departmentCode" }), dataIndex: 'departmentCode', width: '16%' },
              {
                title: formatMessage({ id: "bank.account.departmentName" }), dataIndex: 'departmentName', width: '16%'
              },
              // { title: "职务编码", key: "5", dataIndex: '5', width: '16%' },
              // { title: "职务名称", key: "6", dataIndex: '6', width: '16%' },
              { title: formatMessage({ id: "bank.account.employeeName" }), dataIndex: 'employeeName', width: '16%' },
              {
                title: formatMessage({ id: "company.startDateActive" }), dataIndex: 'authorizeDateFrom', width: '16%', render(recode) {
                  return String(recode).substr(0, 10);
                }
              },
              {
                title: formatMessage({ id: "company.endDateActive" }), dataIndex: 'authorizeDateTo', width: '16%',
                render(recode) {
                  return String(recode).substr(0, 10);
                }
              },
              {
                title: formatMessage({ id: "bank.account.state" }), dataIndex: 'isEnabled', width: '16%', render(enabled) {
                  return <Badge status={enabled ? 'success' : 'error'}
                    text={enabled ? formatMessage({ id: "common.status.enable" }) : formatMessage({ id: "common.status.disable" })} />
                }
              },
              {
                title: formatMessage({ id: "common.operation" }), dataIndex: 'id', width: '16%', render: (text, record) => (
                  <span>
                    <a onClick={(e) => this.handleEdit(e, record)}>{formatMessage({ id: "common.edit" })}</a>
                  </span>)
              }
            ]
        },
        APY_TYPE: {
          rowSelection: null,
          url: `${config.baseUrl}/api/comapnyBankPayment/getByBankAccountId?id=${this.props.params.companyBankId}`,
          columns:
            [
              { title: formatMessage({ id: "pay.way.type" }), dataIndex: 'paymentMethodCategory', key: "paymentMethodCategory" },
              { title: formatMessage({ id: "pay.wayCode" }), dataIndex: 'paymentMethodCode', key: "paymentMethodCode" },
              { title: formatMessage({ id: "pay.wayName" }), dataIndex: 'description', key: "description" },
              {
                title: formatMessage({ id: "common.operation" }), dataIndex: 'id', render: (text, record) => (
                  <span>
                    <a onClick={(e) => this.handleEdit(e, record)}>{formatMessage({ id: "common.edit" })}</a>
                    <span className="ant-divider" />
                    <Popconfirm title="确认删除吗？" onConfirm={(e) => this.deleteItem(e, record)}><a>{formatMessage({ id:"common.delete"})}</a></Popconfirm>
                  </span>)
              }
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
      nowStatus: 'AUTHORIZATION',
      showListSelector: false,
      newData: [],
      addText: formatMessage({ id:"bank.account.addAuthorization"}),
      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newBankAccountPage: menuRoute.getRouteItem('new-bank-account', 'key'),                    //新建银行账户
      bankAccountPageDetail: menuRoute.getRouteItem('bank-account-detail', 'key'),              //银行账户详情
    }
  }

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let tabsData = this.state.tabsData;
    tabsData.APY_TYPE.rowSelection.selectedRowKeys = selectedRowKeys;


    this.setState({ tabsData, selectedRowKeys });
  };


  componentWillMount() {
    this.getCompanyBankByCompanyBankId(this.props.params.companyBankId);
    this.getList();
  }

  //根据companyBankId获取公司银行信息
  getCompanyBankByCompanyBankId(companyBankId) {
    httpFetch.get(`${config.baseUrl}/api/CompanyBank/selectById?companyBankId=${companyBankId}`).then((response) => {

      response.data.enabled = response.data.enabled ? this.props.intl.formatMessage({ id: "common.status.enable" }) : this.props.intl.formatMessage({ id: "common.status.disable" });
      //开户地
      response.data.openAddress = `${response.data.province}/${response.data.city}`
      this.setState({
        infoData: response.data,
      })
    }).catch((e) => {
      message.error(e);
    })
  }


  getList = () => {
    const { tabsData, page, pageSize, nowStatus } = this.state;

    let url = tabsData[nowStatus].url;
    if (url) {
      //&page=${page}&size=${pageSize}
      return httpFetch.get(`${url}`).then(response => {
        response.data.map((item, index) => {
          item.nowStatus = item.id ? item.id : index;
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
        this.getList();
      })
  };


  //删除一个付款方式
  deleteItem = (e, record) => {
    httpFetch.delete(`${config.baseUrl}/api/comapnyBankPayment/deleteById?id=${record.id}`).then(res => {
      message.success(this.props.intl.formatMessage({ id: 'common.operate.success' }));
      this.getList();
    }).catch(e => {
      message.error(e.response.data.message);
    })
  }

  //公司详情编辑
  updateHandleInfo = (params) => {
    this.setState({ editing: true });
    params.enabled = true;
    params.bankCode = this.state.infoData.bankCode;
    params.companyId = this.state.infoData.companyId;

    httpFetch.post(`${config.baseUrl}/api/CompanyBank/insertOrUpdate`, Object.assign(this.state.typeData, params)).then(response => {
      message.success(this.props.intl.formatMessage({ id: 'common.operate.success' }));
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
      addText: key == 'AUTHORIZATION' ? this.props.intl.formatMessage({ id: "bank.account.addAuthorization" }) : this.props.intl.formatMessage({ id: "common.add" }),
      data: [],
      pagination: {
        total: 0
      },
      page: 0
    }, () => {
      this.getList();
    })
  };

  //新建
  handleNew = () => {

    if (this.state.nowStatus == "AUTHORIZATION") {
      let companyBankId = this.props.params.companyBankId;
      this.setState({ updateParams: { companyBankId: companyBankId }, showSlideFrame: true, });
    }
    else {
      let companyBankId = this.props.params.companyBankId;
      this.setState({ editParams: { companyBankId: companyBankId }, visibleSlideFrame: true, });
    }

  };

  //编辑
  handleEdit = (e, record) => {

    if (this.state.nowStatus == "AUTHORIZATION") {
      let companyBankId = this.props.params.companyBankId;
      record.companyBankId = companyBankId;
      this.setState({ updateParams: record, showSlideFrame: true, });
    }
    else {
      let companyBankId = this.props.params.companyBankId;
      record.companyBankId = companyBankId;
      this.setState({ editParams: record, visibleSlideFrame: true, });
    }

  };

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
      this.getCompanyByCompanyOID(companyOIDFrom);
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

  handleCloseSlide = (params) => {
    

    if (this.state.nowStatus == "AUTHORIZATION") {
      this.setState({
        showSlideFrame: false
      },() => {
        if (params) {
          this.getList();
        }
      })
    }
    else {
      this.setState({
        visibleSlideFrame: false
      }, () => {
        if (params) {
          this.getList();
        }
      })
    }
  }

  render() {
    const { infoList, selectedRowKeys, rowSelection, infoData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState, editing, showSlideFrame, updateParams, addText, visibleSlideFrame, editParams } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Tabs onChange={this.onChangeTabs} style={{ marginTop: 20 }}>
          {this.renderTabs()}
        </Tabs>
        <div className="table-header">
          <div>
            <div className="table-header-title">共 {pagination.total} 条数据</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={this.handleNew} loading={saving}>{addText}</Button>
            </div>
          </div>
        </div>
        <Table columns={tabsData[nowStatus].columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          bordered
          size="middle"
          rowKey={(reCode) => { return reCode.id }}
          rowSelection={tabsData[nowStatus].rowSelection}
        />


        <ListSelector visible={this.state.showImportFrame}
          onOk={this.submitHandle}
          onCancel={this.CancelHandle}
          type='user_move_select_company'
          single={true}
          extraParams={{ "versionId": this.props.params.versionId }}
        />

        <SlideFrame title= {JSON.stringify(updateParams) == "{}"?formatMessage({ id: "bank.account.addAuthorization"}):formatMessage({ id: "bank.account.editAuthorization"})}
          show={showSlideFrame}
          content={AddAuthorization}
          afterClose={this.handleCloseSlide}
          onClose={() => this.setState({ showSlideFrame: false })}
          params={updateParams} />

        <SlideFrame title= {JSON.stringify(updateParams) == "{}"?formatMessage({ id: "bank.account.addPayWay"}):formatMessage({ id: "bank.account.editPayWay"})}
          show={visibleSlideFrame}
          content={AddPayWay}
          afterClose={this.handleCloseSlide}
          onClose={() => this.setState({ visibleSlideFrame: false })}
          params={editParams} />

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

