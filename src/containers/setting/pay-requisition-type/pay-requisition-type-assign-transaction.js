/**
 * Created by 13576 on 2017/11/30.
 */
import React from 'React'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Table, Button, Checkbox, Alert, message,Icon} from 'antd';


import menuRoute from 'share/menuRoute'
import config from 'config'
import httpFetch from 'share/httpFetch'

import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

class PayRequisitionTypeAssignTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      data: [],
      columns: [
        {title: '现金事务代码', dataIndex: 'typeCode', key: 'typeCode',},
        {title: '现金事务名称', dataIndex: 'description', key: 'description',},
        {title: '账套', dataIndex: 'setOfBookId', key: 'setOfBookId',},
        {
          title: '启用',
          key: 'isEnabled',
          render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)}
                                                   checked={record.isEnabled}/>
        }
      ],
      infoDate: {},
      infoList: [
        {
          /*账套*/
          type: 'input', label:"账套", id: 'setOfBookId',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        {
          /*预付款类型代码*/
          type: 'input',
          label:"预付款类型代码",
          id: 'typeName',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        {
          /*预付款类型名称*/
          type: 'input',
          label: "预付款类型名称",
          id: 'typeCode',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        /*预付款类型状态*/
        {type: 'switch', label:"预付款类型状态", id: 'isEnabled',disabled: true}
      ],
      pagination: {
        total: 0
      },
      loading: false,
      showImportFrame: false,
      optionData: [{value: "NEW", label: this.props.intl.formatMessage({id: "budget.new"})}, {
        value: "CURRENT",
        label: this.props.intl.formatMessage({id: "budget.current"})
      }, {value: "HISTORY", label: this.props.intl.formatMessage({id: "budget.history"})}],
      edit: false,
      formData: {},
      page: 0,
      pageSize: 10,
      budgetOrganization: menuRoute.getRouteItem('budget-organization-detail', 'key'),  //预算组织详情的页面项
      payRequisitionTypePage:menuRoute.getRouteItem('pay-requisition-type','key')  //预付款单定义
    }

  }

  //编辑启用
  onChangeEnabled = (e, record) => {
    let data = record;
    const isEnabled = record.isEnabled;
    data.isEnabled = !isEnabled;
    console.log(data);
    httpFetch.put(`${config.budgetUrl}/api/cash/setofbooks/pay/requisition/type/assign/transaction/classes`, data).then(response => {
      message.success("编辑成功")
      this.getAssignCompanyList();
    }).catch(

    )
  };


  componentWillMount() {
    console.log(this.props);
    this.getDetail();
    this.getAssignCompanyList();
    console.log(this.state.infoDate)

  }



  //获得详情数据
  getDetail = () => {
    console.log("123123123")
    console.log(this.props)
    let data = {}
    httpFetch.get(`${config.localUrl}/api/cash/setofbooks/pay/requisition/types/${this.props.params.requisitionTypeId}`,).then((response) => {
      console.log(response.data);
      data = response.data;

      let info = {
        ...data,
      }
      this.setState({
        formData: data,
        infoDate: info
      })
    }).catch(e => {
    });
  }


  //查询分配现金事务
  getAssignCompanyList = () => {
    this.setState({
      loading: true
    })
    httpFetch.get(`${config.localUrl}/api/cash/setofbooks/pay/requisition/type/assign/transaction/classes/query?sobPayReqTypeId=${this.props.params.requisitionTypeId}&setOfBookId=${this.props.company.setOfBooksId}&page=${this.state.page}&size=${this.state.pageSize}`).then((response) => {
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize,
          current: this.state.page + 1
        }
      })
    }).catch((e) => {
      this.setState({
        loading: false,

      })
    })

  }

  //分页点击
  onChangePager = (page) => {
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, () => {
        this.getAssignCompanyList();
      })
  };


  handleEdit = () => {
    this.setState({edit: true})
  };

  showImport = (value) => {
    this.setState({showImportFrame: value})
  }

  //弹窗中，按确定，立即保存现金事务
  saveTransaction = (values) => {
    console.log(values);
    httpFetch.post(`${config.localUrl}/api/cash/setofbooks/pay/requisition/type/assign/transaction/classes/batch`, values).then((res) => {
      console.log(res.data);
      message.success("成功");
      this.setState({})
      this.getAssignCompanyList();
    }).catch((e) => {
      if (e.response) {
        message.error(`${e.response.data.validationErrors[0].message}`);
      } else {
        console.log(e)
      }
    })
  }


//分配现金事务确定
  submitHandle = (value) => {
    const data = value.result;
    console.log(data);
    const isEnabled = true;
    let dataValue = [];
    for (let a = 0; a < data.length; a++) {
      let newData = {
        "sobPayReqTypeId":this.props.params.requisitionTypeId,
        "transactionClassId":data.id,
        "isEnabled": isEnabled,
      }
      //保存
      dataValue.push(newData)
    }

    this.saveTransaction(dataValue);

    console.log(dataValue)

    this.setState({})

    this.showImport(false)
  }

  CancelHandle = () => {
    this.showImport(false)
  }

  updateHandleInfo = (value) => {
  }

  render() {
    const {edit, data, columns, pagination, formData, infoDate, infoList, updateState, loading} = this.state;
    const {formatMessage} = this.props.intl;
    return (
      <div>
        <div className="budget-versions-detail">
          {console.log(infoDate)}
          <BasicInfo infoList={infoList}
                     infoData={infoDate}
                     updateHandle={this.updateHandleInfo}
                     updateState={updateState}/>

          <div className="table-header">
            <div
              className="table-header-title">{this.props.intl.formatMessage({id: 'common.total'}, {total: `${pagination.total}`})}</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={() => this.showImport(true)}>添 加</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"
                 loading={loading}
          />


          <a className="back" onClick={() => {this.context.router.push(this.state.budgetOrganization.url.replace(":id", this.props.organization.id) + '?tab=VERSIONS');}}>
            <Icon type="rollback" style={{marginRight:'5px'}}/>返回
          </a>

          <ListSelector visible={this.state.showImportFrame}
                        onOk={this.submitHandle}
                        onCancel={this.CancelHandle}
                        type='assign-transaction'
                        extraParams={{}}
          />

        </div>
      </div>
    )
  }

}

PayRequisitionTypeAssignTransaction.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(PayRequisitionTypeAssignTransaction));

