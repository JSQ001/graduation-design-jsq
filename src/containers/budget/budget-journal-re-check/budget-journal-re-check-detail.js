/**
 * Created by 13576 on 2017/10/20.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Spin,Popover,Button,Collapse, Table, Select,Modal,message,Popconfirm,notification,Icon,Badge,Row,Col,Input,Steps} from 'antd';
const Step =Steps.Step;

import "styles/budget/budget-journal-re-check/budget-journal-re-check-detail.scss"

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'


class BudgetJournalReCheckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params: {},
      spinLoading:true,
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
      organization: {},
      fileList:[],
      infoData:{},
      columns: [
        {
          /*公司*/
          title: this.props.intl.formatMessage({id: "budget.companyId"}), key: "companyName", dataIndex: 'companyName',width:'8%',
          render: companyName => (
            <Popover content={companyName}>
              {companyName}
            </Popover>)
        },
        {
          /*部门*/
          title: this.props.intl.formatMessage({id: "budget.unitId"}), key: "departmentName", dataIndex: 'departmentName',width:'8%',
          render: unitName => (
            <Popover content={unitName}>
              {unitName}
            </Popover>)

        },
        {          /*人员*/
          title: this.props.intl.formatMessage({id:"budget.employeeId"}), key: "employeeName", dataIndex: 'employeeName',
          render: recode => (
            <Popover content={recode}>
              {recode}
            </Popover>)
        },
        {
          /*预算项目*/
          title: this.props.intl.formatMessage({id: "budget.item"}), key: "itemName", dataIndex: 'itemName',width:'16%',
          render: itemName => (
            <Popover content={itemName}>
              {itemName}
            </Popover>)
        },
        {
          /*期间*/
          title: this.props.intl.formatMessage({id: "budget.periodName"}), key: "periodName", dataIndex: 'periodName',width:'6%',

        },
        {
          /*季度*/
          title: this.props.intl.formatMessage({id: "budget.periodQuarter"}),width:'6%',
          key: "periodQuarterName",
          dataIndex: 'periodQuarterName'
        },
        {
          /*年度*/
          title: this.props.intl.formatMessage({id: "budget.periodYear"}), key: "periodYear", dataIndex: 'periodYear',width:'8%'
        },
        {
          /*币种*/
          title: this.props.intl.formatMessage({id: "budget.currency"}), key: "currency", dataIndex: 'currency',width:'8%'
        },
        {
          /*汇率*/
          title: this.props.intl.formatMessage({id: "budget.rate"}), key: "rate", dataIndex: 'rate',width:'8%',
        },
        {
          /*金额*/
          title: this.props.intl.formatMessage({id: "budget.amount"}), key: "amount", dataIndex: 'amount',
          render: recode => (
            <Popover content={this.filterMoney(recode)}>
              {this.filterMoney(recode)}
            </Popover>)
        },
        {
          /*本币今额*/
          title: this.props.intl.formatMessage({id: "budget.functionalAmount"}),
          key: "functionalAmount",
          dataIndex: 'functionalAmount',
          render: recode => (
            <Popover content={this.filterMoney(recode)}>
              {this.filterMoney(recode)}
            </Popover>)
        },
        {
          /*数字*/
          title: this.props.intl.formatMessage({id: "budget.quantity"}), key: "quantity", dataIndex: 'quantity',with:'8%',
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

      budgetJournalDetailReCheckPage: menuRoute.getRouteItem('budget-journal-re-check','key'),    //预算日记账复核

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
      message.error(`${this.props.intl.formatMessage({id: "budget.getAttachmentFail"})},${e.response.data.message}`);
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

      this.setState({
        headerAndListData:request.data,
        infoData:headerData,
        data:listData,
        total:listData.length
      })
    })
  }

  //根据预算表id，获得维度
  getDimensionByStructureId = (value) =>{
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getLayoutsByStructureId?isEnabled=true&structureId=${value}`).then((resp)=>{
      this.getColumnsAndDimensionhandleData(resp.data);
    }).catch(e=>{
      message.error(`${this.props.intl.formatMessage({id: "budget.budget.getDimensionFail"})},${e.response.data.message}`);
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
    },()=>{
      this.setState({
        spinLoading:false
      })
    })
  }


  //通过
  handlePass=()=>{
    const id= this.state.headerAndListData.dto.id;
    let data =[];
    data.addIfNotExist(id);
    httpFetch.post(`${config.budgetUrl}/api/budget/journals/balance/create`,data).then((request)=>{
      message.success(this.props.intl.formatMessage({id: "common.operate.success"}));
        let path=this.state.budgetJournalDetailReCheckPage.url;
          this.context.router.push(path);

    }).catch((e)=>{
      message.error(`${this.props.intl.formatMessage({id: "common.operate.filed"})},${e.response.data.message}`);
    })
  }

  //驳回
  handleReject=()=>{

    const id= this.state.headerAndListData.dto.id;
    let data =[];
    data.addIfNotExist(id);

    httpFetch.post(`${config.budgetUrl}/api/budget/journals/rejectJournal`,data).then((request)=>{
      message.success(this.props.intl.formatMessage({id: "common.operate.success"}));
      let path=this.state.budgetJournalDetailReCheckPage.url;
       this.context.router.push(path);


    }).catch((e)=>{
      message.error(`${this.props.intl.formatMessage({id: "common.operate.filed"})},${e.response.data.message}`);
    })

  }

  //返回列表页
  HandleReturn=()=>{
       let path=this.state.budgetJournalDetailReCheckPage.url;
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
    return(
      <div className="budget-journal-re-check-detail">

        <div className="base-info">
          <div className="base-info-header">
            {this.props.intl.formatMessage({id:"budget.basicInformation"})}
          </div>

          <Row className="base-info-cent">
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.status"})}:</div>
              <div className="beep-info-text">
                {this.getStatus()}
              </div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.journalCode"})}:</div>
              <div className="beep-info-text">{infoData.journalCode?infoData.journalCode:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.amount"})}:</div>
              <div className="beep-info-cent-text">
                {this.getAmount()}
              </div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.employeeId"})}:</div>
              <div className="beep-info-text">{infoData.employeeName?infoData.employeeName:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.unitId"})}:</div>
              <div className="beep-info-text">{infoData.unitName?infoData.unitName:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.createdDate"})}:</div>
              <div className="beep-info-text">{String(infoData.createdDate).substring(0,10)}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.journalTypeId"})}:</div>
              <div className="beep-info-text">{infoData.journalTypeName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.structureId"})}:</div>
              <div className="beep-info-text">{infoData.structureName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.scenarioId"})}:</div>
              <div className="beep-info-text">{infoData.scenario}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.versionId"})}:</div>
              <div className="beep-info-text">{infoData.versionName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.periodStrategy"})}:</div>
              <div className="beep-info-text">{infoData.periodStrategyName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.props.intl.formatMessage({id:"budget.attachment"})}:</div>
              <div className="beep-info-text">{this.getFile()}</div>
            </Col>
          </Row>
        </div>
        <Spin spinning={this.state.spinLoading}>
          <Table columns={columns}
                 dataSource={data}
                 bordered
                 size="middle"
                 scroll={{ x: '150%' }}
                 rowKey={recode=>{return recode.id}}
          />
        </Spin>

        <div className="collapse">
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Collapse.Panel header={this.props.intl.formatMessage({id:"budget.budgetHistory"})} key="1">
            </Collapse.Panel>

          </Collapse>
        </div>

        <div className="footer-operate">
          <div className="food-input" >
            <span>{this.props.intl.formatMessage({id:"budget.budgetOpinion"})}：&nbsp;</span><Input style={{}}/>
            <Button type="primary" onClick={this.handlePass}>{this.props.intl.formatMessage({id:"budget.pass"})}</Button>
            <Button className="button-reject" type="primary"   onClick={this.handleReject}>{this.props.intl.formatMessage({id:"budget.reject"})}</Button>
            <Button className="button-return" onClick={this.HandleReturn}>{this.props.intl.formatMessage({id:"budget.return"})}</Button>
          </div>
          <div>
          </div>
        </div>
      </div>


    )
  }

}


BudgetJournalReCheckDetail.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalReCheckDetail));

