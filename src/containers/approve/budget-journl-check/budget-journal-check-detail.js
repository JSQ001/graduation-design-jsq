/**
 * Created by 13576 on 2017/11/22.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Popover,Button,Collapse, Table, Select,Modal,message,Popconfirm,notification,Icon,Badge,Row,Col,Input,Steps} from 'antd';
const Step =Steps.Step;

import "styles/budget/budget-journal-re-check/budget-journal-re-check-detail.scss"

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'


class BudgetJournalCheckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params: {},
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
      message.error(`查询附件失败,${e.response.data.message}`);
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
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getLayoutsByStructureId?structureId=${value}`).then((resp)=>{
      console.log(resp.data);

      this.getColumnsAndDimensionhandleData(resp.data);

    }).catch(e=>{
      message.error(`获得维度失败,${e.response.data.message}`);
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
    const id= this.state.headerAndListData.dto.id;
    let data =[];
    data.addIfNotExist(id);
    httpFetch.post(`${config.budgetUrl}/api/budget/journals/balance/create`,data).then((request)=>{
      message.success("已经通过")

      let path=this.state.budgetJournalDetailReCheckPage.url;
      this.context.router.push(path);

    }).catch((e)=>{
      message.error("失败");
    })
  }

  //驳回
  handleReject=()=>{

    const id= this.state.headerAndListData.dto.id;
    let data =[];
    data.addIfNotExist(id);

    httpFetch.post(`${config.budgetUrl}/api/budget/journals/rejectJournal`,data).then((request)=>{
      message.success("已经驳回");
      let path=this.state.budgetJournalDetailReCheckPage.url;
      this.context.router.push(path);


    }).catch((e)=>{
      message.error("失败");
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
      case 'NEW':{ return <Badge status="processing" text="新建" />}
      case 'SUBMIT':{ return   <Badge status="warning" text="提交审批" />}
      case 'SUNMIT_RETURN':{return <Badge status="default" color="#dd12333" text="提交撤回"/> }
      case 'REJECT':{ return  <Badge status="error" text="拒绝" />}
      case 'CHECKED':{return < Badge status="default" color="#234234" text="审批完成"/>}
      case 'CHECKING':{return <Badge  status="default" color="#ffdd44" text="审批中"/>}
      case 'POSTED':{return <Badge status="default"  color="#87d068" text="复核"/>}
      case 'BACKLASH_SUBMIT':{return <Badge status="default" color="#871233" text="反冲提交"/>}
      case 'BACKLASH_CHECKED':{return <Badge status="default" color="#823344" text="反冲审核"/>}
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


  getPeriodStrategy=()=>{
    const infoData = this.state.infoData;
    const periodStrategy =  infoData.periodStrategy;
    switch (periodStrategy){
      case 'MONTH':{ return `月`}
      case 'QUARTER':{ return `年`}
      case 'YEAR':{ return `季度`}
    }

  }

  getPeriodStrategyData=()=>{
    const infoData = this.state.infoData;
    const periodStrategy =  infoData.periodStrategy;
    switch (periodStrategy){
      case 'MONTH':{ return `期间`}
      case 'QUARTER':{ return `年`}
      case 'YEAR':{ return `季度`}
    }

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


  getPeriod=()=>{
    const infoData = this.state.infoData;
    switch (infoData.periodStrategy){
      case 'MONTH':{ return `${infoData.periodName?infoData.periodName:''}`}
      case 'QUARTER':{ return `${infoData.periodYear}年-第 ${infoData.periodQuarter?infoData.periodQuarter:''} 季度`}
      case 'YEAR':{ return `${infoData.periodYear}年`}

    }
  }



  render(){
    const { data, columns,infoData} = this.state;
    return(
      <div className="budget-journal-re-check-detail">

        <div className="base-info">
          <div className="base-info-header">
            基本信息
          </div>

          <Row className="base-info-cent">
            <Col span={8}>
              <div className="base-info-title">状态</div>
              <div className="beep-info-text">
                {this.getStatus()}
              </div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">预算日记账编号</div>
              <div className="beep-info-text">{infoData.journalCode?infoData.journalCode:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">总金额</div>
              <div className="beep-info-cent-text">
                {this.getAmount()}
              </div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">申请人</div>
              <div className="beep-info-text">{infoData.employeeName?infoData.employeeName:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">部门:</div>
              <div className="beep-info-text">{infoData.unitName?infoData.unitName:'-'}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">创建日期</div>
              <div className="beep-info-text">{String(infoData.createdDate).substring(0,10)}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">预算项目类型</div>
              <div className="beep-info-text">{infoData.journalTypeName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">预算表</div>
              <div className="beep-info-text">{infoData.structureName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">预算场景</div>
              <div className="beep-info-text">{infoData.scenario}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">预算版本</div>
              <div className="beep-info-text">{infoData.versionName}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">编制期段</div>
              <div className="beep-info-text">{this.getPeriodStrategy()}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">附件</div>
              <div className="beep-info-text">{this.getFile()}</div>
            </Col>

          </Row>


        </div>

        <Table columns={columns}
               dataSource={data}
               bordered
               size="middle"
               scroll={{ x: '150%' }}
               rowKey={recode=>{return recode.id}}

        />

        <div className="collapse">
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Collapse.Panel header="审批历史" key="1">
              <Steps direction="vertical" size="small" >
                <Step title="Finished" description="This is a description." />
                <Step title="In Progress" description="This is a description." />
                <Step title="Waiting" description="This is a description." icon={<Icon  type="smile-o"/>} />
              </Steps>
            </Collapse.Panel>

          </Collapse>
        </div>


        <div className="footer-operate">
          <div className="food-input" >
            <span>审批意见：&nbsp;</span><Input style={{}}/>
            <Button type="primary" onClick={this.handlePass}>通过</Button>
            <Button className="button-reject" type="primary"   onClick={this.handleReject}>驳回</Button>
            <Button className="button-return" onClick={this.HandleReturn}>返回</Button>

          </div>
          <div>


          </div>

        </div>
      </div>


    )
  }

}


BudgetJournalCheckDetail.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalCheckDetail));

