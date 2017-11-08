/**
 * Created by 13576 on 2017/10/20.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button,Collapse, Table, Select,Modal,message,Popconfirm,notification,Icon,Badge,Row,Col,Input,Steps} from 'antd';
const Step =Steps.Step;
import SearchArea from 'components/search-area.js';
import "styles/budget/budget-journal-re-check/budget-journal-re-check-detail.scss"

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import selectorData from 'share/selectorData'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'
import SlideFrame from 'components/slide-frame.js'
import BudgetJournalDetailLead from 'containers/budget/budget-journal/budget-journal-detail-lead.js'
import WrappedNewBudgetJournalDetail from 'containers/budget/budget-journal/new-budget-journal-detail.js'





class BudgetJournalDetailSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params: {},
      headerAndListData: {},
      pageSize: 10,
      page: 0,
      pagination: {
        current: 0,
        page: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      organization: {},
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
          title: this.props.intl.formatMessage({id: "budget.unitId"}), key: "unitName", dataIndex: 'unitName',
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
        /*{

         title: this.props.intl.formatMessage({id: "budget.rateType"}), key: "rateType", dataIndex: 'rateType'
         },
         {

         title: this.props.intl.formatMessage({id: "budget.rateQuotation"}),
         key: "rateQuotation",
         dataIndex: 'rateQuotation'
         },    */
        {
          /*汇率*/
          title: this.props.intl.formatMessage({id: "budget.rate"}), key: "rate", dataIndex: 'rate'
        },
        {
          /*金额*/
          title: this.props.intl.formatMessage({id: "budget.amount"}), key: "amount", dataIndex: 'amount'
        },
        {
          /*本币今额*/
          title: this.props.intl.formatMessage({id: "budget.functionalAmount"}),
          key: "functionalAmount",
          dataIndex: 'functionalAmount'
        },
        {
          /*数字*/
          title: this.props.intl.formatMessage({id: "budget.quantity"}), key: "status", dataIndex: 'quantity'
        },
        /* {

         title: this.props.intl.formatMessage({id: "budget.unit"}), key: "unit", dataIndex: 'unit'
         },*/
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
    console.log(this.props.params.journalCode);

    this.getDataByBudgetJournalCode();
  }



  //根据预算日记账编码查询预算日记账头行
  getDataByBudgetJournalCode=()=>{
    const budgetJournalCode =this.props.params.journalCode;
    console.log(budgetJournalCode);
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/${budgetJournalCode}`).then((request)=>{
      console.log(request.data)
      let listData = request.data.list;
      console.log(listData);
      let headerData =request.data.dto;
      this.setState({
        headerAndListData:request.data,
        infoData:headerData,
        data:listData,
        pagination: {
          total:request.data.list.length ,
          onChange: this.onChangePager,
          pageSize: this.state.pageSize,
          current: this.state.page + 1
        }
      })
    })
  }

  //通过
  handlePass=()=>{
    const id= this.state.headerAndListData.dto.id;
    let data =[];
    data.addIfNotExist(id);
    console.log(data);

    httpFetch.post(`${config.budgetUrl}/api/budget/journals/balance/create`,data).then((request)=>{
      console.log(request.data)
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
    console.log(data);

    httpFetch.post(`${config.budgetUrl}/api/budget/journals/rejectJournal`,data).then((request)=>{
      console.log(request.data)
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
    console.log(path);
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
    return "CNY"+" "+sum;
  }


  getPeriodStrategy=()=>{
    const infoData = this.state.infoData;
    const periodStrategy =  infoData.periodStrategy;
    switch (periodStrategy){
      case 'MONTH':{ return `期间`}
      case 'QUARTER':{ return `年`}
      case 'YEAR':{ return `季度`}
    }

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
    const { data, columns,pagination,infoData} = this.state;
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
              <div className="base-info-title">创建日期</div>
              <div className="beep-info-text">{infoData.createdDate}</div>
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
              <div className="base-info-title">{this.props.intl.formatMessage({id: "budget.periodYear"})}：</div>
              <div>{infoData.periodYear}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">编制期段</div>
              <div className="beep-info-text">{this.getPeriodStrategy()}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">{this.getPeriodStrategy()}</div>
              <div className="beep-info-text">{this.getPeriod()}</div>
            </Col>
            <Col span={8}>
              <div className="base-info-title">附件</div>
              <div className="beep-info-text">{infoData.file}</div>
            </Col>

          </Row>


        </div>

        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               bordered
               size="middle"
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

      </div>


    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetailSubmit));

