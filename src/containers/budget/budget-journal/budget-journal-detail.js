/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Popover,Button, Table, Select,Modal,message,Popconfirm,notification,Icon} from 'antd';
import "styles/budget/budget-journal/budget-journal-detail.scss";

import httpFetch from 'share/httpFetch';
import config from 'config';
import menuRoute from 'share/menuRoute';


import BasicInfo from 'components/basic-info';
import SlideFrame from 'components/slide-frame.js';
import BudgetJournalDetailLead from 'containers/budget/budget-journal/budget-journal-detail-lead.js';
import WrappedNewBudgetJournalDetail from 'containers/budget/budget-journal/new-budget-journal-detail.js';

class BudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      listData:[],
      headerAndListData:{},
      showSlideFrameNew:false,
      showModal:false,
      updateState:false,
      pageSize:10,
      page:0,
      total:0,
      fileList:[],
      selectorItem:{},
      selectedData:[],
      rowSelection: {
        type:'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      infoDate:{},
      infoList:[
        /*状态*/
        {type:'badge',label: this.props.intl.formatMessage({id:"budget.status"}),id:'status'},
        /*预算日记账编号*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.journalCode"}), id: 'journalCode', disabled: true},
        /*总金额*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.total.amount"}), id: 'totalAmount', disabled: true},
        /*申请人*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.employeeId"}), id: 'employeeName', disabled: true},
        /*创建时间*/
        {type: 'date', label: this.props.intl.formatMessage({id:"budget.createdDate"}), id: 'createdDate', disabled: true},
        /*预算日记账类型*/
        {type: 'list', id: 'journalType',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'journalTypeId',
          label:this.props.intl.formatMessage({id: 'budget.journalTypeId'}),
          listExtraParams:{organizationId:1},
          disabled: true
        },
        {type: 'select', id:'budgetStructure', label: '预算表', options: [], method: 'get',disabled: true,
          getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams:{organizationId :1},
          labelKey: 'structureName', valueKey: 'id'},
        /*预算版本*/
        {type: 'list', id: 'versionName',
          listType: 'budget_versions',
          labelKey: 'versionName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.version'}),  /*预算版本*/
          listExtraParams:{organizationId:1}
        },
        /*预算场景*/
        {type: 'list', id: 'scenarioName',
          listType: 'budget_scenarios',
          labelKey: 'scenarioName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.scenarios'}),  /*预算场景*/
          listExtraParams:{organizationId:1}
        },
        /*编辑期段*/
        {type: 'value_list', id: 'periodStrategy', label: '编制期段', options: [], valueListCode: 2002,disabled: true},
        /*预算年度*/
        {type:'input',id:'periodYear',label:'预算年度',disabled: true,},
        /*预算季度*/
        {type:'input',id:'periodQuarterName',label:'预算季度',disabled: true,},
        /*期间*/
       {type:'input',id:'periodName',label:'期间',disabled: true},
        /*附件*/
        {type:'file',label:'附件',id:'file',disabled: true},

      ],

      columns: [
        {          /*公司*/
          title: this.props.intl.formatMessage({id:"budget.companyId"}), key: "companyName", dataIndex: 'companyName',width:'10%',
          render: companyName => (
            <Popover content={companyName}>
              {companyName}
            </Popover>)
        },
        {          /*部门*/
          title: this.props.intl.formatMessage({id:"budget.unitId"}), key: "departmentName", dataIndex: 'departmentName',width:'10%',
          render: departmentName => (
            <Popover content={departmentName}>
              {departmentName}
            </Popover>)
        },
        {          /*预算项目*/
          title: this.props.intl.formatMessage({id:"budget.item"}), key: "itemName", dataIndex: 'itemName',width:'10%',
          render: itemName => (
            <Popover content={itemName}>
              {itemName}
            </Popover>)
        },
        {          /*期间*/
          title: this.props.intl.formatMessage({id:"budget.periodName"}), key: "periodName", dataIndex: 'periodName',width:'6%'
        },
        {          /*季度*/
          title: this.props.intl.formatMessage({id:"budget.periodQuarter"}), key: "periodQuarter", dataIndex: 'periodQuarter',width:'6%'
        },
        {          /*年度*/
          title: this.props.intl.formatMessage({id:"budget.periodYear"}), key: "periodYear", dataIndex: 'periodYear',width:'6%'
        },
        {          /*币种*/
          title: this.props.intl.formatMessage({id:"budget.currency"}), key: "currency", dataIndex: 'currency',width:'4%'
        },
      /*  {          /!*汇率类型*!/
          title: this.props.intl.formatMessage({id:"budget.rateType"}), key: "rateType", dataIndex: 'rateType'
        },*/
      /*  {          /!*标价方法*!/
          title: this.props.intl.formatMessage({id:"budget.rateQuotation"}), key: "rateQuotation", dataIndex: 'rateQuotation'
        },*/
        {          /*汇率*/
          title: this.props.intl.formatMessage({id:"budget.rate"}), key: "rate", dataIndex: 'rate',width:'6%',
          render: rate => (
            <Popover content={rate}>
              {rate}
            </Popover>)
        },
        {          /*金额*/
          title: this.props.intl.formatMessage({id:"budget.amount"}), key: "amount", dataIndex: 'amount',width:'6%'
        },
        {          /*本币今额*/
          title: this.props.intl.formatMessage({id:"budget.functionalAmount"}), key: "functionalAmount", dataIndex: 'functionalAmount',width:'6%',
          render: functionalAmount => (
            <Popover content={functionalAmount}>
              {functionalAmount}
            </Popover>)
        },
        {          /*数字*/
          title: this.props.intl.formatMessage({id:"budget.quantity"}), key: "quantity", dataIndex: 'quantity',width:'6%'
        },
       /* {          /!*单位*!/
          title: this.props.intl.formatMessage({id:"budget.unit"}), key: "unit", dataIndex: 'unit'
        },*/
        {          /*备注*/
          title: this.props.intl.formatMessage({id:"budget.remark"}), key: "remark", dataIndex: 'remark',
          render: remark => (
            <Popover content={remark}>
              {remark}
            </Popover>)
        },
      ],

      budgetJournalPage: menuRoute.getRouteItem('budget-journal','key'),    //预算日记账

    };
  }

//获得总金额
  getAmount= () =>{
    const data = this.state.data;
    let sum =0;
    data.map((item)=>{
      sum+= item.functionalAmount;
    })
    return "CNY"+" "+sum.toFixed(2);
  }


  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ rowSelection });
  };

  onSelectItem=(record, selected)=>{;
    let selectedData = this.state.selectedData;
    if(!selected){
      selectedData.map((selected, index) => {

      })
    } else {
      selectedData.push(record);
    }

  }

  onSelectAll=()=>{

  }


  //删除预算日记账行
  handleDeleteLine=()=>{
    let data = this.state.selectedData;
     let  selectedData=[];
     data.map((item)=>{
       if(item.id){
         let id ={"id":item.id}
         selectedData.addIfNotExist(id)
       }
     })
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/batch/lines`,selectedData).then((res)=>{
      this.getDataByBudgetJournalCode();
        message.success("删除成功");
    }).catch(e=>{
      message.error(`删除失败,${e.response.data.message}`);
    })
  }


  componentWillMount(){
    //根据编制期代码拿数据
    this.getDataByBudgetJournalCode();

  }

//根据attachmentOID，查询附件
  getFile=(value)=>{
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
      this.setState({
        loading:true,
        fileList:[]
      })
      const journalCode =this.props.params.journalCode;
      httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/${journalCode}`).then((response)=>{
            let listData = response.data.list;
            let headerData =response.data.dto;
        headerData.attachmentOID.map((item)=>{
          this.getFile(item);
        })
            const journalType=[];
            const journalType1={
              "journalTypeName":headerData.journalTypeName,
              "journalTypeId":headerData.journalTypeId,
        }
        journalType.push(journalType1);

        //预算版本
        const versionName=[]
        const versionName1={
          "versionName":headerData.versionName,
          "id":headerData.versionId
        }
        versionName.push(versionName1);

        //预算场景
        const scenarioName=[]
        const scenarioName1={
          "scenarioName":headerData.scenario,
          "id":headerData.scenarioId
        }
        scenarioName.push(scenarioName1);

        //预算表
        const budgetStructure={
          "label":headerData.structureName,
          "value":headerData.structureId
        }

     //编制期段
       const period = headerData.periodStrategy;
        const periodStrategy={
          "label":period=="YEAR"?"年":(period=="QUARTER"?"季度":"月"),
          "value":period
        }


        //状态
        let statusData={};
      if(headerData.status=="NEW"){
         statusData={'status':'processing', 'value':'新建'};
      }else if(headerData.status=="REJECT"){
        statusData={'status':'error', 'label':'拒绝'};
      }

        //获取总金额
        let sum =0;
        listData.map((item)=>{
          sum+= item.functionalAmount;
        })
        const amountData = "CNY"+" "+sum;

        const infoData={
          ...headerData,
          "status":statusData,
          "journalType":journalType,
          "versionName":versionName,
          "scenarioName":scenarioName,
          "budgetStructure":budgetStructure,
         // "periodYear":periodYear,
          "file":this.state.fileList,
          "periodStrategy":periodStrategy,
          "totalAmount":amountData
        }


      this.setState({
        loading:false,
        headerAndListData:response.data,
        infoDate:infoData,
        data:listData
      })
    })
  }



  //保存编辑
  updateHandleInfo=(value)=>{
    const headerAndListData =this.state.headerAndListData;
    headerAndListData.dto.versionId=value.versionName[0];
    headerAndListData.dto.scenarioId=value.scenarioName[0];
    this.handleSaveJournal();
    this.setState({
      headerAndListData:headerAndListData,
      updateState:true
    })

  }


  //处理导入
  handleModal=(value)=>{
    this.setState({
      showModal: value,
    });
  }

  handleModalOk=()=>{
    this.handleModal(false)
  }


  showSlideFrameNew=(value)=>{
    this.setState({
      showSlideFrameNew:value,
    })
  }


  showSlideFrameNewData=()=>{
    this.setState({
      params:{},
      showSlideFrameNew:true,
    })
  }


  //获得表单数据
  handleAfterCloseNewSlide=(value)=>{
    this.setState({
      showSlideFrameNew:false,
    })
      let data = this.state.data;
      let listData=this.state.listData;
      let headerAndListData = this.state.headerAndListData;
      if(value.isNew){
          headerAndListData.list.addIfNotExist(value);
          data.addIfNotExist(value);
          listData.addIfNotExist(value);
        }
      else{

      let list = headerAndListData.list;
      for(let a=0;a<list.length;a++){
        if(list[a].id==value.id){
          list[a]=value;
        }
      }
      headerAndListData.list=list;

    }


    this.setState({
      data:data,
      headerAndListData: headerAndListData,
      listData:listData
    });
  }



//删除该预算日记账
  handleDeleteJournal=()=> {
    const id = this.state.headerAndListData.dto.id;
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/${id}`).then((req) => {
      message.success("成功删除该预算日记账");

      //删除完该预算日记账，跳转
      let path=this.state.budgetJournalPage.url;
      this.context.router.push(path);
    }).catch(e => {
      message.error("失败")
    })

  }

//保存新增，或修改
  handleSaveJournal=()=>{
    let headerAndListData = this.state.headerAndListData;
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`,headerAndListData).then((req) => {
      message.success("成功");
      this.getDataByBudgetJournalCode();

    }).catch(e => {
      message.error("失败")
    })

  }

  //提交单据
  handlePut=()=>{
    let headerAndListData = this.state.headerAndListData;
    if(headerAndListData.list.length>0 ) {
      let headerId = headerAndListData.dto.id;
      httpFetch.post(`${config.budgetUrl}/api/budget/journals/submitJournal/${headerId}`).then((req) => {
        message.success("提交成功");
       // this.getDataByBudgetJournalCode();
        this.setState({
          listData:[],
        })

        let path=this.state.budgetJournalPage.url;
        this.context.router.push(path);

      }).catch(e => {
        message.error("提交失败")
      })
    }else {
      notification.open({
        message: '行信息不能为空！',
        description: '请添加或导入预算日记账行信息',
        icon: <Icon type="frown-circle" style={{ color: '#e93652' }} />,
      });
    }
  }


  //编辑行
  handlePutData=(value)=>{

    const valueData = {
      ...value,
      "company":value.companyName,
      "item":value.itemName,
      "periodName":value.periodName,
      "currency":value.currency

    }

    this.setState({
      params:valueData,
      showSlideFrameNew:true,
    })

  }



  render(){

    const {loading, data, columns, pagination,formData,infoDate,infoList,updateState,showModal,showSlideFrameNew,rowSelection} = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div className="budget-versions-detail">
        <div className="budget-versions-cent">
          <BasicInfo infoList={infoList}
                     infoData={infoDate}
                     updateHandle={this.updateHandleInfo}
                     updateState={updateState}/>

          <div className="table-header">
            <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${this.state.total}`})}</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={this.showSlideFrameNewData}>{this.props.intl.formatMessage({id:"common.add"})}</Button>
              <Button type="primary" onClick={() => this.handleModal(true)}>{this.props.intl.formatMessage({id:"budget.leading"})}</Button>
              <Popconfirm placement="topLeft" title={"确认删除"} onConfirm={this.handleDeleteLine} okText="Yes" cancelText="No">
               <Button className="delete" disable={!(this.state.selectedData.length>0)} >{this.props.intl.formatMessage({id:"common.delete"}) }</Button>
              </Popconfirm>
            </div>
          </div>
          <Table columns={columns}
                  dataSource={data}
                  rowKey={record=>record.id}
                  bordered
                  size="middle"
                  scroll={{ x: '150%' }}
                  onRowClick={this.handlePutData}
                  rowSelection={rowSelection}
                  loading={loading}

          />
          <div className="footer-operate">
            <Button type="primary" onClick={this.handlePut}>提交</Button>
            <Button  type="primary"  onClick={this.handleSaveJournal}>{this.props.intl.formatMessage({id:"common.save"})}</Button>
            <Popconfirm placement="topLeft" title={"确认删除"} onConfirm={this.handleDeleteJournal} okText="Yes" cancelText="No">
            <Button className="delete">{this.props.intl.formatMessage({id:"budget.delete.journal"})}</Button>
            </Popconfirm>
          </div>

        </div>



        <BudgetJournalDetailLead
          visible={showModal}
          onOk={this.handleModalOk}
          onCancel={() => this.handleModal(false)}
        >
        </BudgetJournalDetailLead>

        <SlideFrame title={"预算日记账"}
                    show={showSlideFrameNew}
                    content={WrappedNewBudgetJournalDetail}
                    afterClose={this.handleAfterCloseNewSlide}
                    onClose={()=>this.showSlideFrameNew(false)}
                    params={this.state.params}/>
      </div>
    )
  }

}

BudgetJournalDetail.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetail));
