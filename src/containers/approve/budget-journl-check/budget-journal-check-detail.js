/**
 * Created by 13576 on 2017/11/22.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import {Form,Timeline,Popover,Button,Collapse, Table, Select,Modal,message,Popconfirm,notification,Icon,Badge,Row,Col,Input,Steps} from 'antd';
const Step =Steps.Step;
const FormItem =Form.Item;
import "styles/budget/budget-journal-re-check/budget-journal-re-check-detail.scss"
import httpFetch from 'share/httpFetch';
import config from 'config';
import menuRoute from 'share/menuRoute';


class BudgetJournalCheckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params: {},
      HistoryData:[],
      headerAndListData: {},
      pageSize: 10,
      page: 0,
      total:0,
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      statusData:{
        SUBMIT_FOR_APPROVAL:{color:'blue',name:'提交'},
        WITHDRAW:{color:'blue',name:'撤回预算日记'},
        SELF_PASS:{color:'green',name:'自审批通过'},
        APPROVAL_PASS:{color:'green',name:'审批通过'},
        APPROVAL_REJECT:{color:'red',name:'审批驳回'},
        AUDIT_PASS:{color:'purple',name:'审核通过'},
        AUDIT_REJECT:{color:'red',name:'审核驳回'},
      },
      organization: {},
      fileList:[],
      infoData:{},
      columns: [
        {
          /*公司*/
          title: this.props.intl.formatMessage({id: "budget.companyId"}), key: "companyName", dataIndex: 'companyName',
          render: companyName => (
            <Popover content={companyName}>
              {companyName}
            </Popover>)
        },
        {
          /*部门*/
          title: this.props.intl.formatMessage({id: "budget.unitId"}), key: "departmentName", dataIndex: 'departmentName',
          render: unitName => (
            <Popover content={unitName}>
              {unitName}
            </Popover>)

        },
        {
          /*预算项目*/
          title: this.props.intl.formatMessage({id: "budget.item"}), key: "itemName", dataIndex: 'itemName',
          render: itemName => (
            <Popover content={itemName}>
              {itemName}
            </Popover>)

        },
        {
          /*期间*/
          title: this.props.intl.formatMessage({id: "budget.periodName"}), key: "periodName", dataIndex: 'periodName'

        },
        {
          /*季度*/
          title: this.props.intl.formatMessage({id: "budget.periodQuarter"}),
          key: "periodQuarter",
          dataIndex: 'periodQuarter'
        },
        {
          /*年度*/
          title: this.props.intl.formatMessage({id: "budget.periodYear"}), key: "periodYear", dataIndex: 'periodYear'
        },
        {
          /*币种*/
          title: this.props.intl.formatMessage({id: "budget.currency"}), key: "currency", dataIndex: 'currency'
        },
        {
          /*汇率*/
          title: this.props.intl.formatMessage({id: "budget.rate"}), key: "rate", dataIndex: 'rate'
        },
        {
          /*金额*/
          title: this.props.intl.formatMessage({id: "budget.amount"}), key: "amount", dataIndex: 'amount',render: this.filterMoney
        },
        {
          /*本币今额*/
          title: this.props.intl.formatMessage({id: "budget.functionalAmount"}),
          key: "functionalAmount",
          dataIndex: 'functionalAmount',
          render: this.filterMoney
        },
        {
          /*数字*/
          title: this.props.intl.formatMessage({id: "budget.quantity"}), key: "quantity", dataIndex: 'quantity'
        },
        {
          /*备注*/
          title: this.props.intl.formatMessage({id: "budget.remark"}), key: "remark", dataIndex: 'remark',
          render: remark => (
            <Popover content={remark}>
              {remark}
            </Popover>)
        },
      ],

      budgetJournalDetailCheckPage: menuRoute.getRouteItem('budget-journal-check','key'),    //预算日记账审核

    };
  }

  componentWillMount=()=>{
    this.getDataByBudgetJournalCode();

  }


//根据attachmentOID，查询附件
  getFileByAttachmentOID=(value)=>{
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getAttachmentDTOByOid?oid=${value}`,).then((resp)=>{
      let fileList = this.state.fileList;
      fileList.addIfNotExist(resp.data)
      this.setState({
        fileList:fileList
      })
    }).catch(e=>{
      message.error(`${this.props.intl.formatMessage({id: "budgetJournal.getAttachmentFail"})},${e.response.data.message}`);
    })
  }

  //根据预算日记账编码查询预算日记账头行
  getDataByBudgetJournalCode=()=>{
    const budgetJournalCode =this.props.params.journalCode;
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/${budgetJournalCode}`).then((request)=>{
      let listData = request.data.list;
      let headerData =request.data.dto;
      this.getDimensionByStructureId(headerData.structureId);
      headerData.attachmentOID.map((item)=>{
        this.getFileByAttachmentOID(item);
      })
      this.getApproveHistory(headerData);
      this.setState({
        headerAndListData:request.data,
        infoData:headerData,
        data:listData,
        total:listData.length
      },()=>{

      })
    })
  }

  //根据预算表id，获得维度
  getDimensionByStructureId = (value) =>{
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getLayoutsByStructureId?isEnabled=true&structureId=${value}`).then((resp)=>{
    this.getColumnsAndDimensionhandleData(resp.data);
    }).catch(e=>{
      message.error(`${this.props.intl.formatMessage({id: "budgetJournal.getDimensionFail"})},${e.response.data.message}`);

    })
  }

  //根据预算表的维度.获取维度Columuns
  getColumnsAndDimensionhandleData(dimensionList){
    let columns=this.state.columns;
    for(let i=0;i<dimensionList.length;i++){
      const item =dimensionList[i];
      const priority = item.sequenceNumber;
      columns.push(
        {title:`${item.dimensionName}`, key:`dimension${priority}ValueName`, dataIndex: `dimension${priority}ValueName`,
          render: recode => (
            <Popover content={recode}>
              {recode}
            </Popover>)
        }
      )
    }
    this.setState({
      columns,
    })
  }

  //通过
  handlePass=()=>{

    this.props.form.validateFieldsAndScroll((err, value) => {
      if(!err){
        const dataValue={
          "approvalTxt":value.approvalTxt?value.approvalTxt:null,
          "entities":[
            {"entityOID":this.state.headerAndListData.dto.documentOid,
              "entityType":this.state.headerAndListData.dto.documentType,
              "countersignApproverOIDs":null,
            }]
        }
        httpFetch.post(`${config.baseUrl}/api/approvals/pass`,dataValue).then((request)=>{
          message.success(this.props.intl.formatMessage({id: "common.operate.success"}));
          let path=this.state.budgetJournalDetailCheckPage.url;
          this.context.router.push(path);

        }).catch((e)=>{
          message.error(`${this.props.intl.formatMessage({id: "common.operate.filed"})},${e.response.data.message}`);

        })
      }

    })

  }

  getApproveHistory(headerData){
   console.log(headerData);
    console.log(123);
    const documentType = headerData.documentType;
    const documentOid = headerData.documentOid;
    httpFetch.get(`${config.baseUrl}/api/budget/journa/reports/history?entityType=${documentType?documentType:''}&entityOID=${documentOid?documentOid:''}`).then((request)=>{
     console.log(request.data);
      this.setState({"HistoryData":request.data},()=>{
        console.log(this.state.HistoryData);
      });
      message.success(this.props.intl.formatMessage({id: "budgetJournal.getApproveCodeSuccess"}))
    }).catch((e)=>{
      message.error(this.props.intl.formatMessage({id: "budgetJournal.getApproveCodeFail"}));
    })
  }

  getHistory(){
    const HistoryData = this.state.HistoryData;
    let children = [];
    HistoryData.map((item, i)=>{
      children.push(
        this.getHistoryRender(item,i)
      )
    })
    return children;
  }

  getHistoryRender(item,i){
    const statusData= this.state.statusData;
    if(item){
      return(
        <Timeline.Item color={statusData[item.operation].color} key={i}>
          <p>
            <span style={{fontWeight:'bold'}}>{statusData[item.operation].name}</span>
            <span style={{marginLeft:50}}>【{item.lastModifiedDate}】{item.employeeName}</span>
          </p>
          <p>{item.operationDetail}</p>
        </Timeline.Item>)
    }
    return ''
  }

  //驳回
  handleReject=()=>{
    this.props.form.validateFieldsAndScroll((err, value) => {
      if(!err){
        const dataValue={
          "approvalTxt":value.approvalTxt?value.approvalTxt:null,
          "entities":[
            {"entityOID":this.state.headerAndListData.dto.documentOid,
              "entityType":this.state.headerAndListData.dto.documentType}]
        }
        httpFetch.post(`${config.baseUrl}/api/approvals/reject`,dataValue).then((request)=>{
          message.success(this.props.intl.formatMessage({id: "common.operate.success"}));
          let path=this.state.budgetJournalDetailCheckPage.url;
          this.context.router.push(path);

        }).catch((e)=>{
          message.error(`${this.props.intl.formatMessage({id: "common.operate.filed"})},${e.response.data.message}`);

        })
      }

    })

  }

  //返回列表页
  HandleReturn=()=>{
    let path=this.state.budgetJournalDetailCheckPage.url;
    this.context.router.push(path);
  }

  //返回状态
  getStatus=()=>{
    const infoData = this.state.infoData;
    switch (infoData.status){
      case 'NEW':{ return <Badge status="processing" text={infoData.statusName} />}
      case 'SUBMIT':{ return   <Badge status="warning" text={infoData.statusName}/>}
      case 'SUBMIT_RETURN':{return   <Badge status="warning" text={infoData.statusName}/>}
      case 'REJECT':{ return  <Badge status="error" text={infoData.statusName} />}
      case 'CHECKED':{return < Badge status="default" text={infoData.statusName}/>}
      case 'CHECKING':{return <Badge  status="default"text={infoData.statusName}/>}
      case 'POSTED':{return <Badge status="default" text={infoData.statusName}/>}
      case 'BACKLASH_SUBMIT':{return <Badge status="default"  text={infoData.statusName}/>}
      case 'BACKLASH_CHECKED':{return <Badge status="default"  text={infoData.statusName}/>}
      default :{return <Badge status="default"  text={infoData.statusName}/>}
    }
  }

//获得总金额
  getAmount=()=>{
    const data = this.state.data;
    let sum =0;
    data.map((item)=>{
      sum+= item.functionalAmount;
    })
    return "CNY"+" "+sum.toFixed(2);
  }


  //获取附件
  getFile=()=>{
    const fileList = this.state.fileList;
    let file_arr=[];
    fileList.map((link)=>{
      file_arr.push(<div key={link.fileURL}><a href={link.fileURL} target="_blank"><Icon type="paper-clip" /> {link.fileName}</a> </div>)
    })
    return file_arr.length > 0 ? file_arr : '-';

  }


  render(){
    const { data, columns,infoData} = this.state;
    const {getFieldDecorator} = this.props.form;
    return(
      <div className="budget-journal-re-check-detail">

        <div className="base-info">
          <div className="base-info-header">
            {this.props.intl.formatMessage({id:"budgetJournal.basicInformation"})}
          </div>

          <Row className="base-info-cent">
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.status"})}:</div>
              <div className="beep-info-text">
                {this.getStatus()}
              </div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.journalCode"})}:</div>
              <div className="beep-info-text">{infoData.journalCode?infoData.journalCode:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.amount"})}:</div>
              <div className="beep-info-cent-text">
                {this.getAmount()}
              </div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.employeeId"})}:</div>
              <div className="beep-info-text">{infoData.employeeName?infoData.employeeName:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.unitId"})}:</div>
              <div className="beep-info-text">{infoData.unitName?infoData.unitName:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.createdDate"})}:</div>
              <div className="beep-info-text">{String(infoData.createdDate).substring(0,10)}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.journalTypeId"})}:</div>
              <div className="beep-info-text">{infoData.journalTypeName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.structureId"})}:</div>
              <div className="beep-info-text">{infoData.structureName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.scenarioId"})}:</div>
              <div className="beep-info-text">{infoData.scenario}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.versionId"})}:</div>
              <div className="beep-info-text">{infoData.versionName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.periodStrategy"})}:</div>
              <div className="beep-info-text">{infoData.periodStrategyName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budgetJournal.attachment"})}:</div>
              <div className="beep-info-text">{this.getFile()}</div>
            </Col>

          </Row>


        </div>

        <Table columns={columns}
               dataSource={data}
               bordered
               size="middle"
               scroll={{ x: '150%' }}
        />

        <div className="collapse">
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Collapse.Panel header={this.props.intl.formatMessage({id:"budgetJournal.budgetHistory"})} key="1">
              <Timeline>
                {this.getHistory()}
              </Timeline>
            </Collapse.Panel>
          </Collapse>
        </div>

        <div className="footer-operate">
          <div className="food-input" >
            <span>{this.props.intl.formatMessage({id:"budgetJournal.budgetOpinion"})}}：&nbsp;</span>
            <Form>
              <FormItem
              >
                {getFieldDecorator('approvalTxt', {
                  rules: [{ required: true, message:this.props.intl.formatMessage({id:"comment.please.enter"}) }],
                })(
                  <Input/>
                )}
              </FormItem>
            </Form>
            <Button type="primary" onClick={this.handlePass}>{this.props.intl.formatMessage({id:"budgetJournal.pass"})}</Button>
            <Button className="button-reject" type="primary"   onClick={this.handleReject}>{this.props.intl.formatMessage({id:"budgetJournal.reject"})}</Button>
            <Button className="button-return" onClick={this.HandleReturn}>{this.props.intl.formatMessage({id:"budgetJournal.return"})}</Button>
          </div>
          <div>
          </div>

        </div>
      </div>

    )
  }

}


BudgetJournalCheckDetail.contextTypes = {
  router: React.PropTypes.object
};


const WebBudgetJournalCheckDetail = Form.create()(BudgetJournalCheckDetail);

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company,
    organization: state.login.organization

  }

}

export default connect(mapStateToProps)(injectIntl(WebBudgetJournalCheckDetail));

