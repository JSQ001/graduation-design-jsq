/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import {Affix,Popover,Button, Table, Select,Modal,message,Popconfirm,notification,Icon} from 'antd';
import "styles/budget/budget-journal/budget-journal-detail.scss";

import httpFetch from 'share/httpFetch';
import config from 'config';
import menuRoute from 'routes/menuRoute';

import BasicInfo from 'components/basic-info';
import SlideFrame from 'components/slide-frame.js';
import NewBudgetJournalDetail from 'containers/budget/budget-journal/new-budget-journal-detail.js';
import Importer from 'components/template/importer.js';

class BudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew:true,
      params:{},
      loading: true,
      columnsSetFlag:true,
      data: [],
      listData:[],
      headerAndListData:{},
      showSlideFrameNew:false,
      updateState:false,
      pageSize:10,
      page:0,
      total:0,
      buttonLoading:false,
      fileList:[],
      selectorItem:{},
      selectedRowKeys:[],
      rowSelection: {
        type:'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
      },
      commitFlag:false,
      infoDate:{},
      templateUrl:'',
      uploadUrl:'',
      errorUrl:'',
      handleData:[
        {type: 'list', id: 'company',options: [], labelKey: 'name', valueKey: 'id', columnLabel: 'companyName', columnValue: 'companyId'},//公司
        {type: 'list', id: 'unit',options: [], labelKey: 'name',valueKey: 'id',columnLabel: 'departmentName',columnValue: 'unitId'},//部门
        {type: 'list', id: 'employee',options: [], labelKey: 'userName',valueKey: 'userId', columnLabel: 'employeeName',columnValue: 'employeeId'},//人员
        {type: 'list', id:'item',options: [],labelKey:'itemName',valueKey:'id',columnLabel: 'itemName',columnValue: 'itemId'},     //预算项目
        {type: 'select', id:'periodName',options: [], labelKey:'periodName',valueKey:'periodName',columnLabel:'periodName',columnValue:'periodName'}, //期间
        {type: 'value_list', id: 'periodQuarter', options: [],labelKey:'periodQuarter',columnLabel:'periodQuarter',columnValue:'periodQuarterName',value:'periodQuarter'}, //季度
        {type: 'select', id:'periodYear', options:[],labelKey:'periodYear',valueKey:'periodYear',columnLabel:'periodYear',columnValue:'periodYear'}, //年度
        {type: 'select', id:'currency',method:'get', options: [],labelKey:'currencyName',valueKey:'currency',columnLabel: 'currency', columnValue: 'currency'}, //币种
        {type: 'input', id:'rate',valueKey:'rate'},  //汇率
        {type: 'inputNumber', id:'amount',valueKey:'amount'},  //金额
        {type: 'inputNumber', id:'functionalAmount',valueKey:'functionalAmount'}, //本位金额
        {type: 'inputNumber', id:'quantity',valueKey:'quantity'}, //数量
        {type: 'input', id:'remark',valueKey:'remark'}  //备注
      ],
      infoList:[
        /*状态*/
        {type:'badge',label: this.props.intl.formatMessage({id:"budgetJournal.status"}),id:'status'},
        /*预算日记账编号*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budgetJournal.journalCode"}), id: 'journalCode', disabled: true},
        /*总金额*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budgetJournal.total.amount"}), id: 'totalAmount', disabled: true},
        /*申请人*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budgetJournal.employeeId"}), id: 'employeeName', disabled: true},
        /*公司*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budgetJournal.companyId"}), id: 'companyName', disabled: true},
        /*部门*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budgetJournal.unitId"}), id: 'unitName', disabled: true},
        /*创建时间*/
        {type: 'date', label: this.props.intl.formatMessage({id:"budgetJournal.createdDate"}), id: 'createdDate', disabled: true},
        /*预算日记账类型*/
        {type: 'list', id: 'journalType',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'journalTypeId',
          label:this.props.intl.formatMessage({id: 'budgetJournal.journalTypeId'}),
          listExtraParams:{organizationId:this.props.organization.id},
          disabled: true
        },
        /*预算表*/
        {type: 'select', id:'budgetStructure', label: this.props.intl.formatMessage({id: 'budgetJournal.structureId'}), options: [], method: 'get',disabled: true,
          getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams:{organizationId :this.props.organization.id},
          labelKey: 'structureName', valueKey: 'id'},
        /*预算版本*/
        {type: 'list', id: 'versionName',
          listType: 'budget_versions',
          labelKey: 'versionName',
          valueKey: 'id',
          single:true,
          label:this.props.intl.formatMessage({id: 'budgetJournal.versionId'}),
          listExtraParams:{"organizationId":this.props.organization.id,"isEnabled":true}
        },
        /*预算场景*/
        {type: 'list', id: 'scenarioName',
          listType: 'budget_scenarios',
          labelKey: 'scenarioName',
          valueKey: 'id',
          single:true,
          label:this.props.intl.formatMessage({id: 'budgetJournal.scenarios'}),  /*预算场景*/
          listExtraParams:{"organizationId":this.props.organization.id,"isEnabled":true}
        },
        /*编辑期段*/
        {type: 'value_list', id: 'periodStrategy', label: this.props.intl.formatMessage({id: 'budgetJournal.periodStrategy'}), options: [], valueListCode: 2002,disabled: true},
        /*附件*/
        {type:'file',label:this.props.intl.formatMessage({id: 'budgetJournal.attachment'}),id:'file',disabled: true},

      ],
      dimensionList:[],

      columns: [
        {          /*公司*/
          title: this.props.intl.formatMessage({id:"budgetJournal.companyId"}), key: "companyName", dataIndex: 'companyName',width:'5%',
          render: companyName => (
            <Popover content={companyName}>
              {companyName}
            </Popover>)
        },
        {          /*部门*/
          title: this.props.intl.formatMessage({id:"budgetJournal.unitId"}), key: "departmentName", dataIndex: 'departmentName',width:'5%',
          render: departmentName => (
            <Popover content={departmentName}>
              {departmentName}
            </Popover>)
        },
        {          /*员工*/
          title: this.props.intl.formatMessage({id:"budgetJournal.employee"}), key: "employeeName", dataIndex: 'employeeName',width:'5%',
          render: recode => (
            <Popover content={recode}>
              {recode}
            </Popover>)
        },
        {          /*预算项目*/
          title: this.props.intl.formatMessage({id:"budgetJournal.item"}), key: "itemName", dataIndex: 'itemName',width:'10%',
          render: itemName => (
            <Popover content={itemName}>
              {itemName}
            </Popover>)
        },
        {          /*期间*/
          title: this.props.intl.formatMessage({id:"budgetJournal.periodName"}), key: "periodName", dataIndex: 'periodName',
        },
        {          /*季度*/
          title: this.props.intl.formatMessage({id:"budgetJournal.periodQuarter"}), key: "periodQuarterName", dataIndex: 'periodQuarterName',
        },
        {          /*年度*/
          title: this.props.intl.formatMessage({id:"budgetJournal.periodYear"}), key: "periodYear", dataIndex: 'periodYear',
        },
        {          /*币种*/
          title: this.props.intl.formatMessage({id:"budgetJournal.currency"}), key: "currency", dataIndex: 'currency',
        },
        {          /*汇率*/
          title: this.props.intl.formatMessage({id:"budgetJournal.rate"}), key: "rate", dataIndex: 'rate',
          render: rate => (
            <Popover content={rate}>
              {rate}
            </Popover>)
        },
        {          /*金额*/
          title: this.props.intl.formatMessage({id:"budgetJournal.amount"}), key: "amount", dataIndex: 'amount',
          render: recode => (
            <Popover content={this.filterMoney(recode)}>
              {this.filterMoney(recode)}
            </Popover>)
        },
        {          /*本币今额*/
          title: this.props.intl.formatMessage({id:"budgetJournal.functionalAmount"}), key: "functionalAmount", dataIndex: 'functionalAmount',
          render: recode => (
            <Popover content={this.filterMoney(recode)}>
              {this.filterMoney(recode)}
            </Popover>)
        },
        {          /*数字*/
          title: this.props.intl.formatMessage({id:"budgetJournal.quantity"}), key: "quantity", dataIndex: 'quantity',
        },
        {          /*备注*/
          title: this.props.intl.formatMessage({id:"budgetJournal.remark"}), key: "remark", dataIndex: 'remark',
          render: remark => (
            <Popover content={remark}>
              {remark}
            </Popover>)
        },
      ],

      budgetJournalPage: menuRoute.getRouteItem('budget-journal','key'),    //预算日记账

    };
  }

  componentWillMount(){
    //根据编制期代码拿数据
    this.getDataByBudgetJournalCode();
  }

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys,selectedRows) =>{
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({
      rowSelection,
      selectedRowKeys,
      selectedData:selectedRowKeys
    });
  };


  //删除预算日记账行
  handleDeleteLine=()=>{
    let data = this.state.selectedRowKeys;
    let  selectedRowKeys=[];
    data.map((item)=>{
      if(item){
        let id ={"id":item}
        selectedRowKeys.addIfNotExist(id)
      }
    })
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/batch/lines`,selectedRowKeys).then((req)=>{
      this.getDataByBudgetJournalCode();
      message.success(`${this.props.intl.formatMessage({id:'common.operate.success'})}`);
      this.setState({
        selectedRowKeys:[]
      })
    }).catch(e=>{
      message.error(`${this.props.intl.formatMessage({id:'common.operate.filed'})}`);
    })
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
      message.error(`${this.props.intl.formatMessage({id:"budgetJournal.getAttachmentFail"})},${e.response.data.message}`);
    })
  }

  //根据预算表id，获得维度
  getDimensionByStructureId = (value) =>{
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getLayoutsByStructureId?isEnabled=true&structureId=${value}`).then((resp)=>{
      this.setState({
        dimensionList:resp.data
      },()=>{
        //根据预算表，的维度.获取获取Columuns和获取维度的handleData数据
        this.getColumnsAndDimensionhandleData();
      })
    }).catch(e=>{
      message.error(`${this.props.intl.formatMessage({id:"budgetJournal.getDimensionFail"})},${e.response.data.message}`);
    })
  }

  //根据预算表的维度.获取维度Columuns和获取维度的handleData数据
  getColumnsAndDimensionhandleData(){
    let columns=this.state.columns;
    let handleData=this.state.handleData;
    const dimensionList = this.state.dimensionList;
    for(let i=0;i<dimensionList.length;i++){
     const item =dimensionList[i];
      const priority = item.sequenceNumber;
     columns.push(
       {title:`${item.dimensionName}`, key:`dimension${priority}ValueName`,id:`dimension${priority}ValueName`, dataIndex: `dimension${priority}ValueName`,
         render: recode => (
           <Popover content={recode}>
             {recode}
           </Popover>)
       }
     )
     handleData.push(
      {type: 'select', id:`dimension${priority}`,options: [],labelKey:'id',valueKey:'name',columnLabel: `dimension${priority}ValueName`,columnValue: `dimension${priority}ValueId`},
     )
   }
    this.setState({
      columns,
      columnsSetFlag:false
    })
  }


  //根据预算日记账编码查询预算日记账头行
  getDataByBudgetJournalCode(){
    this.setState({
      loading:true,
      fileList:[]
    })
    const journalCode =this.props.params.journalCode;
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/${journalCode}`).then((response)=>{
      let listData = response.data.list;
      let headerData =response.data.dto;
      if(this.state.columnsSetFlag){
        this.getDimensionByStructureId(headerData.structureId);
      }
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
      const versionName=[];
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
        "label":period=="YEAR"?this.props.intl.formatMessage({id:'budgetJournal.year'}):(period=="QUARTER"?this.props.intl.formatMessage({id:'budgetJournal.quarter'}):this.props.intl.formatMessage({id:'budgetJournal.month'})),
        "value":period
      }

      //状态
      let statusData={};
      if(headerData.status=="NEW"){
        statusData={'status':'processing', 'value':headerData.statusName};
      }else if(headerData.status=="SUBMIT_RETURN"){
        statusData={'status':'warning', 'value':headerData.statusName};
      }else if(headerData.status=="REJECT") {
        statusData = {'status': 'error', 'value': headerData.statusName};
      }else{
        statusData={'status':'default', 'value':headerData.statusName};
      }

      //获取总金额
      let sum =0;
      listData.map((item)=>{
        sum+= item.functionalAmount;
      })
      const amountData = "CNY"+" "+sum.toFixed(2);
      const infoData={
        ...headerData,
        "status":statusData,
        "journalType":journalType,
        "versionName":versionName,
        "scenarioName":scenarioName,
        "budgetStructure":budgetStructure,
        "file":this.state.fileList,
        "periodStrategy":periodStrategy,
        "totalAmount":amountData
      }
      const templateUrl = `${config.budgetUrl}/api/budget/journals/export/template?budgetJournalHeadId=${headerData.id}`;
      const uploadUrl =`${config.budgetUrl}/api/budget/journals/import?budgetJournalHeadId=${headerData.id}`;
      const errorUrl =`${config.budgetUrl}/api/budget/batch/transaction/logs/failed/export/budgetJournal/${headerData.id}`
      this.setState({
        templateUrl,
        uploadUrl,
        errorUrl,
        loading:false,
        headerAndListData:response.data,
        infoDate:infoData,
        data:listData,
        commitFlag:listData.length>0
      })
    }).catch((e)=>{
      message.error(e.response.data.message);
    })
  }

  //保存编辑
  updateHandleInfo=(value)=>{
    const headerAndListData =this.state.headerAndListData;
    headerAndListData.dto.versionId=value.versionName[0];
    headerAndListData.dto.scenarioId=value.scenarioName[0];

    this.setState({
      headerAndListData:headerAndListData,
      updateState:true
    },()=>{
      this.handleSaveJournal();
    })

  }

  handleSaveJournal(){
    let headerAndListData = this.state.headerAndListData;
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`,headerAndListData).then((req) => {
      message.success(`${this.props.intl.formatMessage({id:'common.operate.success'})}`);
      this.getDataByBudgetJournalCode();
    }).catch((e)=>{
      message.error(e.response.data.message)
    })

  }

  showSlideFrameNew=(value)=>{
    this.setState({
      showSlideFrameNew:value,
    })
  }

  showSlideFrameNewData=()=> {
    let params = {
      "isNew": true,
      "periodStrategy": this.state.headerAndListData.dto.periodStrategy,
      "structureId":this.state.headerAndListData.dto.structureId,
      "journalTypeId":this.state.headerAndListData.dto.journalTypeId,
    }
    this.setState({
      params: params,
    },()=>{
      this.showSlide(true);
    });

  }

  showSlide = (value) =>{
    this.setState({
      showSlideFrameNew: value,
    })
  }

  //获得表单数据,保存或者修改
  handleAfterCloseNewSlide=(value)=>{
    if(value){
      this.setState({
        showSlideFrameNew:false,
      });
      let data = value;
      data.journalHeaderId = this.state.headerAndListData.dto.id;
      httpFetch.post(`${config.budgetUrl}/api/budget/journals/insertOrUpdateLine`,data).then((req) => {
        message.success(`${this.props.intl.formatMessage({id:'common.operate.success'})}`);
        this.getDataByBudgetJournalCode();
      }).catch((e)=>{
        message.error(e.response.data.message)
      })
    }
  }

//删除该预算日记账
  handleDeleteJournal=()=> {
    const id = this.state.headerAndListData.dto.id;
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/${id}`).then((req) => {
      message.success(`${this.props.intl.formatMessage({id:'common.operate.success'})}`);
      //删除完该预算日记账，跳转
      let path=this.state.budgetJournalPage.url;
      this.context.router.push(path);
    }).catch((e) => {
      message.error(`${this.props.intl.formatMessage({id:'common.operate.filed'})}`);
    })
  }


  //提交单据
  handlePut=()=>{
    let header =this.state. headerAndListData.dto;
    if(this.state.commitFlag) {
       let header =this.state. headerAndListData.dto;
        httpFetch.post(`${config.budgetUrl}/api/budget/journals/submitJournal/${header.id}`).then((res)=>{
          message.success(`${this.props.intl.formatMessage({id:'common.operate.success'})}`);
            this.setState({
            listData:[],
          })
          let path=this.state.budgetJournalPage.url;
          this.context.router.push(path);
        }).catch(e => {
          message.error(e.response.data.message)
        })
    }else {
      notification.open({
        message:this.props.intl.formatMessage({id:"budgetJournal.notEmpty"}),
        description:this.props.intl.formatMessage({id:"budgetJournal.andOrLead"}),
        icon: <Icon type="frown-circle" style={{ color: '#e93652' }} />,
      });
    }
  }

  //编辑行前,数据处理，传入数据
  headleUpData(values) {
    let valuesData = {};
    const handData = this.state.handleData;
    handData.map((item)=>{
        if ( item.type === 'select' || item.type === 'value_list') {
          valuesData[item.id]=values[item.columnLabel];
      } else if (item.type === 'list' ){
          let result = [];
          let  itemData ={}
          if(values[item.columnValue]){
            itemData[item.labelKey]=values[item.columnLabel];
            itemData[item.valueKey]=values[item.columnValue];
            itemData["key"]=values[item.columnValue];
            result.push(itemData);
          }
          valuesData[item.id] = result;
        } else if (item.type === 'input' || item.type === 'inputNumber'){
          valuesData[item.id] = values[item.valueKey];
      }
    })
    return valuesData;
  }

  //编辑行
  handlePutData=(value)=>{
    let valuePutData =this.headleUpData(value);
    this.setState({
     params:{...valuePutData,
              "id":value.id,
               "structureId":this.state.headerAndListData.dto.structureId,
              "journalTypeId":this.state.headerAndListData.dto.journalTypeId,
              "periodStrategy": this.state.headerAndListData.dto.periodStrategy,
              "versionNumber":value.id,
              "isNew":false,
              "oldData":value,
            }
     },()=>{
      this.showSlide(true);
     })

  }

  //返回预算日记账查询
  handleReturn = () =>{
    let path=this.state.budgetJournalPage.url;
    this.context.router.push(path);
  }

  onLoadOk = () =>{
    this.getDataByBudgetJournalCode()
  }

  render(){

    const {loading, data,templateUrl,errorUrl,uploadUrl,columns, pagination,formData,infoDate,infoList,updateState,showSlideFrameNew,rowSelection} = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div className="budget-journal-detail">
        <div className="budget-journal-cent">
          <BasicInfo infoList={infoList}
                     infoData={infoDate}
                     updateHandle={this.updateHandleInfo}
                     updateState={updateState}/>

          <div className="table-header">
            <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${this.state.data.length}`})}/{this.props.intl.formatMessage({id:'common.total'},{total:`${this.state.selectedRowKeys.length}`})}</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={this.showSlideFrameNewData}>{this.props.intl.formatMessage({id:"common.add"})}</Button>
              <Importer
                templateUrl={templateUrl}
                uploadUrl={uploadUrl}
                errorUrl={errorUrl}
                title={this.props.intl.formatMessage({id:'budgetJournal.leading'})}
                fileName={this.props.intl.formatMessage({id:'budgetJournal.budgetJournalLeading'})}
                onOk={this.onLoadOk}
              />
              <Popconfirm placement="topLeft" title={this.props.intl.formatMessage({id:'common.delete'})} onConfirm={this.handleDeleteLine} okText={this.props.intl.formatMessage({id:'common.ok'})} cancelText={this.props.intl.formatMessage({id:'common.cancel'})}>
                <Button className="delete"    disabled={this.state.selectedRowKeys.length === 0} >{this.props.intl.formatMessage({id:"common.delete"}) }</Button>
              </Popconfirm>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 rowKey={record=>record.id}
                 bordered
                 size="middle"
                 scroll={{ x: '200%' }}
                 onRow={record => ({
                   onClick: () => this.handlePutData(record)
                 })}
                 rowSelection={rowSelection}
                 loading={loading}
          />

        </div>

        <SlideFrame title={this.props.intl.formatMessage({id:'budgetJournal.journal'})}
                    show={showSlideFrameNew}
                    content={NewBudgetJournalDetail}
                    afterClose={this.handleAfterCloseNewSlide}
                    onClose={()=>this.showSlideFrameNew(false)}
                    params={this.state.params}/>
        <div className="divider"> </div>
        <Affix offsetBottom={0}
               style={{position:'fixed',bottom:0,marginLeft:'-35px', width:'100%', height:'50px',
                 boxShadow:'0px -5px 5px rgba(0, 0, 0, 0.067)', background:'#fff',lineHeight:'50px'}}>
          <Popconfirm style={{width:200}} placement="topLeft" title={this.props.intl.formatMessage({id:'budgetJournal.commit'})} onConfirm={this.handlePut} okText={this.props.intl.formatMessage({id:'common.ok'})}cancelText={this.props.intl.formatMessage({id:'common.cancel'})}>
            <Button type="primary" style={{marginLeft:'20px',marginRight:'8px'}}>{this.props.intl.formatMessage({id:'budgetJournal.commit'})}</Button>
          </Popconfirm>
          <Popconfirm placement="topLeft" title={this.props.intl.formatMessage({id:"budgetJournal.delete.journal"})} onConfirm={this.handleDeleteJournal} okText={this.props.intl.formatMessage({id:'common.ok'})}cancelText={this.props.intl.formatMessage({id:'common.cancel'})}>
            <Button className="delete" style={{marginRight:'8px'}}>{this.props.intl.formatMessage({id:"budgetJournal.delete.journal"})}</Button>
          </Popconfirm>
          <Button onClick={this.handleReturn}>{this.props.intl.formatMessage({id:"budgetJournal.return"})}</Button>
        </Affix>
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
