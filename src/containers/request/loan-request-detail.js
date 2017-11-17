/**
 * Created by zaranengap on 2017/11/14
 */
import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/request/loan-request-detail.scss'

import { Tabs, Icon, Spin, message, Row, Col, Timeline } from 'antd'
const TabPane = Tabs.TabPane;

class LoanRequestDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tabs: [
        {key: 'info', name: '申请单信息'},
        {key: 'status', name: '审批进度'}
      ],
      form: {},
      applicant: {},
      tab: 'info',
      detailTab: 'detail',
      topLoading: true,
      bottomLoading: true,
      fields: [],
      approvalHistorys: []
    }
  }

  getStatus = () => {
    const { status, rejectType } = this.state.form;
    if(rejectType === 1001)
      return '已撤回';
    if(rejectType === 1002)
      return '已驳回';
    if(rejectType === 1003)
      return '财务驳回';
    if(status === 1001)
      return '编辑中';
    if(status === 1002)
      return '审批中';
    if(status === 1003)
      return '已通过';
    if(status === 1004)
      return '财务通过';
    if(status === 1005)
      return '已付款';
    if(status === 1006)
      return '还款中';
    if(status === 1007)
      return '已付款';
    if(status === 1008)
      return '付款中';
    if(status === 1009)
      return '已停用';
  };

  componentWillMount(){
    httpFetch.get(`${config.baseUrl}/api/loan/application/${this.props.params.id}`).then(res => {
      this.setState({ form: res.data }, () => {
        res.data.custFormValues && this.getFieldsValue();
      });
      httpFetch.get(`${config.baseUrl}/api/users/oids?userOIDs=${res.data.applicantOID}`).then(applicantRes => {
        if(applicantRes.data && applicantRes.data.length > 0){
          this.setState({ applicant: applicantRes.data[0] }, () => {
            this.getHistoryStatus()
          });
        }
        this.setState({ topLoading: false });
      }).catch(e => {
        message.error('申请人加载失败');
        this.setState({ topLoading: false });
      })
    }).catch(e => {
      message.error('申请单加载失败');
      this.setState({ topLoading: false });
    })
  }

  getHistoryStatus = () => {
    const { approvalHistorys } = this.state.form;
    approvalHistorys.map(history => {
      let operation = history.operation;
      if(operation === 1001){
        history.text = "提交";
        history.icon = "up-circle";
        history.color = "#4CA8BC"
      }
      if(operation === 1002){
        history.text = "撤回";
        history.icon = "down-circle";
        history.color = "#EBA945"
      }
      if(operation === 2001){
        history.text = "审批通过";
        history.icon = "check-circle";
        history.color = "#5EBD93"
      }
      if(operation === 2002){
        history.text = "审批驳回";
        history.icon = "close-circle";
        history.color = "#E57670"
      }
      if(operation === 3001){
        history.text = "审核通过";
        history.icon = "check-circle";
        history.color = "#5EBD93"
      }
      if(operation === 4000){
        history.text = "财务付款中";
        history.icon = "clock-circle";
        history.color = "#63B8EE"
      }
      if(operation === 4001){
        history.text = "财务付款";
        history.icon = "pay-circle";
        history.color = "#A191DA"
      }
      if(operation === 5005){
        history.text = "企业停用";
        history.icon = "minus-circle";
        history.color = "#E57670"
      }
    });
    this.setState({ approvalHistorys })
  };

  getFieldsValue = () => {
    const fields = [].concat(this.state.form.custFormValues);
    let count = 0;
    fields.map(field => {
      switch(field.messageKey){
        case 'select_corporation_entity':
          field.value && httpFetch.get(`${config.baseUrl}/api/my/company/receipted/invoice/${field.value}`).then(res => {
            field.text = res.data.companyName;
            ++count === fields.length && this.setState({ bottomLoading: false, fields });
          });
          break;
        case 'contact_bank_account':
          field.value && httpFetch.get(`${config.baseUrl}/api/contact/bank/account/${field.value}`).then(res => {
            field.text = res.data.bankAccountNo;
            ++count === fields.length && this.setState({ bottomLoading: false, fields });
          });
          break;
        case 'total_budget':
          field.text = this.filterMoney(field.value);
          ++count === fields.length && this.setState({ bottomLoading: false, fields });
          break;
        case 'date':
          field.text = new Date(field.value).format('yyyy-MM-dd');
          ++count === fields.length && this.setState({ bottomLoading: false, fields });
          break;
        case 'select_approver':
          field.value && httpFetch.get(`${config.baseUrl}/api/users/oids?userOIDs=${field.value}`).then(res => {
            field.text = res.data.length ? res.data[0].fullName : '';
            ++count === fields.length && this.setState({ bottomLoading: false, fields });
          });
          break;
        case 'select_cost_center':
          field.value && httpFetch.get(`${config.baseUrl}/api/cost/center/item/${field.value}`).then(res => {
            field.text = res.data.name;
            ++count === fields.length && this.setState({ bottomLoading: false, fields });
          });
          break;
        default:
          field.text = field.value;
          ++count === fields.length && this.setState({ bottomLoading: false, fields });
      }
    });
  };

  //渲染Tab头
  renderTabs = () => {
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  };

  onChangeTabs = (key) => {
    this.setState({ tab: key })
  };

  onChangeDetailTabs = (key) => {
    this.setState({ detailTab: key });
  };

  render(){
    const { form, applicant, topLoading, bottomLoading, fields, approvalHistorys } = this.state;
    const writeoffArtificialDTO = this.state.form.writeoffArtificialDTO ? this.state.form.writeoffArtificialDTO : {hasWriteoffAmount: 0, stayWriteoffAmount: 0};
    return(
      <div className="loan-request-detail background-transparent">
        <div className="top-info">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
          <Spin spinning={topLoading}>
            <div className="info">
              <div className="applicant">
                <span className="applicant-name">{applicant.fullName}</span>
                工号：&nbsp;&nbsp;{applicant.employeeID}&nbsp;&nbsp;|&nbsp;&nbsp;部门：&nbsp;&nbsp;{applicant.department ? applicant.department.name : null}<br/>
                #{form.formName}#：&nbsp;&nbsp;{form.businessCode}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                提交日期：&nbsp;&nbsp;{new Date(form.submittedDate).format('yyyy-MM-dd')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                当前状态：&nbsp;&nbsp;{this.getStatus()}<br/>
                <Icon type="link" />&nbsp;<a>关联申请单：&nbsp;{form.referenceApplication ? form.referenceApplication.businessCode : null}</a><br/>
                <span className="loan-money">借款金额：&nbsp;{form.totalAmount ? this.filterMoney(form.totalAmount) : 0.00}</span>&nbsp;&nbsp;
                已还款：&nbsp;{ this.filterMoney(writeoffArtificialDTO.hasWriteoffAmount)}&nbsp;&nbsp;|&nbsp;&nbsp;<a>待还款：&nbsp;{ this.filterMoney(writeoffArtificialDTO.stayWriteoffAmount)}&nbsp;&nbsp;去还款 ></a>
              </div>
            </div>
          </Spin>
        </div>

        <Tabs onChange={this.onChangeDetailTabs} className="detail-tabs">
          <TabPane tab="申请单详情" key="detail">
            <div className="tab-container detail-tab">
              <h3 className="header-title" style={{ fontSize: 16 }}>申请单详情</h3>
              <Spin spinning={bottomLoading}>
                <Row gutter={40} type="flex" align="top">
                  {fields.map(field => {
                    return (
                      <Col span={8} key={field.messageKey}>
                        <div className="field-name">{field.fieldName}</div>
                        <div className="field-text">{field.text}</div>
                      </Col>
                    )
                  })}
                </Row>
              </Spin>
            </div>
          </TabPane>
          <TabPane tab="审批历史" key="history">
            <div className="tab-container history-tab">
              <h3 className="header-title" style={{ fontSize: 16 }}>审批历史</h3>
              <Spin spinning={topLoading}>
                <Timeline>
                  {approvalHistorys.map((history, index) => {
                    return (
                      <Timeline.Item key={index}
                                     dot={<Icon type={history.icon} style={{ color: history.color}}/>}>
                        {history.text}<br/>
                        {new Date(history.lastModifiedDate).format("yyyy-MM-dd hh:mm")}&nbsp;&nbsp;&nbsp;&nbsp;
                        {history.operator.fullName}&nbsp;&nbsp;{history.operator.employeeID}
                        {history.operationDetail !== null ? <br/> : null}{history.operationDetail}
                      </Timeline.Item>
                    )
                  })}
                </Timeline>
              </Spin>
            </div>
          </TabPane>
        </Tabs>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(LoanRequestDetail));
