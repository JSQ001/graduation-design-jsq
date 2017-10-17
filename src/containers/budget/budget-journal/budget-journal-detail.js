/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Modal,message } from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget/budget-journal/budget-journal-detail.scss"

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import selectorData from 'share/selectorData'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'
import SlideFrame from 'components/slide-frame.js'
import BudgetJournalDetailLead from 'containers/budget/budget-journal/budget-journal-detail-lead.js'
import WrappedNewBudgetJournalDetail from 'containers/budget/budget-journal/new-budget-journal-detail.js'



class BudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit:false,
      loading: true,
      data: [],
      params:{},
      organization:{},
      headerAndListData:{},
      showSlideFramePut:false,
      showSlideFrameNew:false,
      showModal:false,
      updateState:false,
      pageSize:10,
      page:0,
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      selectorItem:{},
      rowSelection: {
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      organization:{},
      infoDate:[],
      infoList: [
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.journalCode"}), id: 'journalCode', message: this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.employeeId"}), id: 'employeeName', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.organization"}), id: 'organizationName', message:this.props.intl.formatMessage({id:"common.please.enter"}),disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.companyId"}), id: 'companyId', message:this.props.intl.formatMessage({id:"common.please.enter"}),disabled: true},
        {type: 'list', id: 'journalTypeName',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.journalTypeId'}),  /*预算日记账类型*/
          listExtraParams:{'organizationId':1}
        },
        {type: 'select', id:'budgetStructure', label: '预算表', isRequired: true, options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: {},
          labelKey: 'structureName', valueKey: 'structureCode'},

        {type: 'input', label: this.props.intl.formatMessage({id:"budget.periodYear"}), id: 'periodYear', message:this.props.intl.formatMessage({id:"common.please.enter"})}, /*预算年度*/

        {type:'select',label: this.props.intl.formatMessage({id:"budget.periodStrategy"}) ,id:'periodStrategy',
          options:
            [
              {value:'Y',label:this.props.intl.formatMessage({id:"budget.year"})},
              {value:'Q',label:this.props.intl.formatMessage({id:"budget.quarter"})},
              {value:'M',label:this.props.intl.formatMessage({id:"budget.month"})}

            ]

        },


        {type: 'list', id: 'versionName',
          listType: 'budget_versions',
          labelKey: 'versionName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.version'}),  /*预算版本*/
          listExtraParams:{'organizationId':1}
        },
        {type: 'list', id: 'scenarioName',
          listType: 'budget_scenarios',
          labelKey: 'scenarioName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.scenarios'}),  /*预算场景*/
          listExtraParams:{'organizationId':1}
        },



      ],

      columns: [
        {          /*公司*/
          title: this.props.intl.formatMessage({id:"budget.companyId"}), key: "companyId", dataIndex: 'companyId'
        },
        {          /*部门*/
          title: this.props.intl.formatMessage({id:"budget.unitId"}), key: "unitId", dataIndex: 'unitId'
        },
        {          /*预算项目*/
          title: this.props.intl.formatMessage({id:"budget.item"}), key: "itemId", dataIndex: 'itemId'
        },
        {          /*期间*/
          title: this.props.intl.formatMessage({id:"budget.periodName"}), key: "periodName", dataIndex: 'periodName'
        },
        {          /*季度*/
          title: this.props.intl.formatMessage({id:"budget.periodQuarter"}), key: "periodQuarter", dataIndex: 'periodQuarter'
        },
        {          /*年度*/
          title: this.props.intl.formatMessage({id:"budget.periodYear"}), key: "periodYear", dataIndex: 'periodYear'
        },
        {          /*币种*/
          title: this.props.intl.formatMessage({id:"budget.currency"}), key: "currency", dataIndex: 'currency'
        },
        {          /*汇率类型*/
          title: this.props.intl.formatMessage({id:"budget.rateType"}), key: "rateType", dataIndex: 'rateType'
        },
        {          /*标价方法*/
          title: this.props.intl.formatMessage({id:"budget.rateQuotation"}), key: "rateQuotation", dataIndex: 'rateQuotation'
        },
        {          /*汇率*/
          title: this.props.intl.formatMessage({id:"budget.rate"}), key: "rate", dataIndex: 'rate'
        },
        {          /*金额*/
          title: this.props.intl.formatMessage({id:"budget.amount"}), key: "amount", dataIndex: 'amount'
        },
        {          /*本币今额*/
          title: this.props.intl.formatMessage({id:"budget.functionalAmount"}), key: "functionalAmount", dataIndex: 'functionalAmount'
        },
        {          /*数字*/
          title: this.props.intl.formatMessage({id:"budget.quantity"}), key: "status", dataIndex: 'quantity'
        },
        {          /*单位*/
          title: this.props.intl.formatMessage({id:"budget.unit"}), key: "unit", dataIndex: 'unit'
        },
        {          /*备注*/
          title: this.props.intl.formatMessage({id:"budget.remark"}), key: "remark", dataIndex: 'remark'
        },
      ],
    };
  }

  //获取预算组织
  getOrganization(){
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/organization/by/login`).then((request)=>{
      console.log(request.data)
      this.setState({
        organization:request.data
      })
    })
  }

  //当选择行变化的时候
  onSelectChange=(selectedRowKeys, selectedRows)=>{
      console.log(selectedRowKeys);
      this.setState({
        selectorItem:selectedRows
      })
  }

  onSelectItem=()=>{

  }

  onSelectAll=()=>{

  }


  //删除预算日记账行
  handleDeleteLine=()=>{
    let data = this.state.rowSelection;
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/batch/lines`,data).then((res)=>{
        message.success("删除成功");
    }).catch(e=>{
      message.error("删除失败");
    })
  }


  componentWillMount(){
    //根据编制期代码拿数据
    const data1={
      "id": null,
      "isEnabled": null,
      "isDeleted": null,
      "createdDate": null,
      "createdBy": null,
      "lastUpdatedDate": null,
      "lastUpdatedBy": null,
      "budgetJournalHeaders": {
        "id": 899636999271137300,
        "isEnabled": true,
        "isDeleted": false,
        "createdDate": "2017-08-21T22:19:10+08:00",
        "createdBy": null,
        "lastUpdatedDate": "2017-08-21T22:19:10+08:00",
        "lastUpdatedBy": null,
        "companyId": 1,
        "operationUnitId": 1,
        "organisationId": 1,
        "structureId": 1,
        "journalCode": "BGT20178211",
        "periodYear": null,
        "periodQuarter": null,
        "periodName": null,
        "description": null,
        "scenarioId": 1,
        "versionId": 1,
        "status": "11",
        "reversedFlag": null,
        "sourceBudgetHeaderId": null,
        "sourceType": null,
        "journalTypeId": 1,
        "employeeId": null,
        "positionId": null,
        "unitId": null
      },
      "list": [
        {
          "id": 899636999355023400,
          "isEnabled": true,
          "isDeleted": true,
          "createdDate": "2017-08-21T22:19:09+08:00",
          "createdBy": null,
          "lastUpdatedDate": "2017-08-21T22:19:10+08:00",
          "lastUpdatedBy": null,
          "journalHeaderId": 899636999271137300,
          "budgetItemId": 1111,
          "currency":"RNB",
          "periodYear": 2017,
          "periodQuarter": 1,
          "periodName": 1,
          "rateType": "RGF",
          "rateQuotation":"daongt",
          "rate": 1.00,
          "amount": null,
          "functionalAmount": null,
          "quantity": null,
          "unit": "Java1",
          "companyId": null,
          "operationUnitId": null,
          "unitId": null,
          "positionId": null,
          "employeeId": null,
          "remark": 1,
          "dimension1Id": null,
          "dimension2Id": null,
          "dimension3Id": null,
          "dimension4Id": null,
          "dimension5Id": null,
          "dimension6Id": null,
          "dimension7Id": null,
          "dimension8Id": null,
          "dimension9Id": null,
          "dimension10Id": null,
          "dimension11Id": null,
          "dimension12Id": null,
          "dimension13Id": null,
          "dimension14Id": null,
          "dimension15Id": null,
          "dimension16Id": null,
          "dimension17Id": null,
          "dimension18Id": null,
          "dimension19Id": null,
          "dimension20Id": null
        },
        {
          "id": 899636999388577800,
          "isEnabled": true,
          "isDeleted": true,
          "createdDate": "2017-08-21T22:19:09+08:00",
          "createdBy": null,
          "lastUpdatedDate": "2017-08-21T22:19:10+08:00",
          "lastUpdatedBy": null,
          "journalHeaderId": 899636999271137300,
          "budgetItemId": 2222,
          "currency": null,
          "periodYear": null,
          "periodQuarter": null,
          "periodName": null,
          "rateType": null,
          "rateQuotation": null,
          "rate": null,
          "amount": null,
          "functionalAmount": null,
          "quantity": null,
          "unit": null,
          "companyId": null,
          "operationUnitId": null,
          "unitId": null,
          "positionId": null,
          "employeeId": null,
          "remark": null,
          "dimension1Id": null,
          "dimension2Id": null,
          "dimension3Id": null,
          "dimension4Id": null,
          "dimension5Id": null,
          "dimension6Id": null,
          "dimension7Id": null,
          "dimension8Id": null,
          "dimension9Id": null,
          "dimension10Id": null,
          "dimension11Id": null,
          "dimension12Id": null,
          "dimension13Id": null,
          "dimension14Id": null,
          "dimension15Id": null,
          "dimension16Id": null,
          "dimension17Id": null,
          "dimension18Id": null,
          "dimension19Id": null,
          "dimension20Id": null
        }
      ]
    }

    const data={
      "dto" :
        {
          "companyId":"683edfba-4e52-489e-8ce4-6e820d5478b2",
          "companyName":"companyName",
          "organizationId":"1",
          "organizationName":"orgName1",
          "structureId":"1",
          "structureName":"structureName",
          "scenarioId":"1",
          "scenarioName":"scenarioId",
          "periodYear": "2017",
          "periodQuarter": "1",
          "periodName": "11",
          "description": "1111",
          "reversedFlag":"y",
          "sourceBudgetHeaderId": "1",
          "sourceType": "233",
          "employeeId": "683edfba-4e52-489e-8ce4-6e820d5478b2",
          "employeeName":"employeename",
          "periodNumber": "2",
          "unitId": "683edfba-4e52-489e-8ce4-6e820d5478b2",
          "unitName":"periodNumber",
          "versionId":"1",
          "versionName":"versionName",
          "status":"NEW",
          "journalTypeId":"912159728258908162",
          "journalTypeName":"bgtJournalTypeName",
          "versionNumber":"1"
        }
      ,
      "list":[{}]
    }


    const journalCode =this.props.params.journalCode;

    this.getDataByBudgetJournalCode(journalCode)

  }




 //根据预算日记账编码查询预算日记账头行
  getDataByBudgetJournalCode=(budgetJournalCode)=>{

    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/${budgetJournalCode}`).then((request)=>{
    console.log(request.data)
      let listData = request.data.list;
    console.log(listData);
      let headerData =request.data.dto;
    this.setState({
      headerAndListData:request.data,
      infoDate:headerData,
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

  //当页码变化
  onChangePager=()=>{

  }

  showImport=()=>{}

  //保存编辑
  updateHandleInfo=(value)=>{
    console.log(value)
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


  handleCloseNewSlide=()=>{
    this.setState({
      showSlideFrameNew:false,
    })
  }
  showSlideFrameNew=(value)=>{
    this.setState({
      showSlideFrameNew:value,
    })
  }


  //获得表单数据
  handleAfterCloseNewSlide=(value)=>{
    this.setState({
      showSlideFrameNew:false,
    })

    console.log(value);
    if(value.company!=undefined) {
      let company = JSON.parse(value.company);
      let item = JSON.parse(value.item);
      let periodName = JSON.parse(value.periodName);
      // let currency =JSON.parse(value.currency);
      const valueData = {
        "companyId": company.companyOID,
        "companyName": company.name,
        "unitId": "683edfba-4e52-489e-8ce4-6e820d5478b2",
        "departmentCode": "department1code",
        "costCenter": "我是测试成本中心",
        "itemId": item.id,
        "itemName": item.itemName,
        "currency": "RNB",
        "rateType": "1",
        "rateQuotation": "1",
        "rate": value.rate,
        "amount": value.amount,
        "functionalAmount": value.functionalAmount,
        "quantity": value.quantity,
        "unit": "1",
        "remark": "1",
        "periodYear": value.periodYear,
        "periodQuarter": "2",
        "periodName": "201701",
        "dimension1Id": "1111",
        "dimension2Id": "2222",
        "dimension3Id": null,
        "dimension4Id": null,
        "dimension5Id": null,
        "dimension6Id": null,
        "dimension7Id": null,
        "dimension8Id": null,
        "dimension9Id": null,
        "dimension10Id": null,
        "dimension11Id": null,
        "dimension12Id": null,
        "dimension13Id": null,
        "dimension14Id": null,
        "dimension15Id": null,
        "dimension16Id": null,
        "dimension17Id": null,
        "dimension18Id": null,
        "dimension19Id": null,
        "dimension20Id": null,
      }
      const valueData2 = valueData;
      let data = this.state.data;
      let headerAndListData = this.state.headerAndListData;
      headerAndListData.list.addIfNotExist(valueData);
      data.addIfNotExist(valueData2);
      this.setState({
        data:data,
        headerAndListData: headerAndListData
      });

      console.log(headerAndListData)
      console.log(this.state.data);
      console.log(55555555555555555555555)
    }
  }



  handleAfterCloseEditorSlide=()=>{
    this.setState({

    })
  }

  showSlideFrameEditor=(value)=>{
    this.setState({
      showSlideFrameNew:value,
    })
  }

  showEditor=(value)=>{
    console.log(value)

  }

//删除该预算日记账
  handleDeleteJournal=()=> {
    console.log(this.state.headerAndListData);
    const id = this.state.headerAndListData.dto.id;
    console.log(id);
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/${id}`).then((req) => {
      message.success("成功删除该预算日记账")
    }).catch(e => {
      message.error("失败")
    })

  }



  render(){

    const { data, columns, pagination,formData,infoDate,infoList,updateState,showModal,showSlideFrameNew,showSlideFramePut,rowSelection} = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div className="budget-versions-detail">
        <div className="budget-versions-cent">
          <BasicInfo infoList={infoList}
                     infoData={infoDate}
                     updateHandle={this.updateHandleInfo}
                     updateState={updateState}/>

          <div className="table-header">
            <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={()=>this.showSlideFrameNew(true)}>{this.props.intl.formatMessage({id:"common.add"})}</Button>
              <Button type="primary" onClick={() => this.handleModal(true)}>{this.props.intl.formatMessage({id:"budget.leading"})}</Button>
              <Button className="delete" onClick={this.handleDeleteLine}>{this.props.intl.formatMessage({id:"common.delete"})}</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"
                 onRowClick={this.showEditor}
                 rowSelection={rowSelection}

          />
          <div className="footer-operate">
            <Button type="primary">提交</Button>
            <Button type="primary">{this.props.intl.formatMessage({id:"common.save"})}</Button>
            <Button className="delete" onClick={this.handleDeleteJournal}>{this.props.intl.formatMessage({id:"budget.delete.journal"})}</Button>
          </div>

        </div>



        <BudgetJournalDetailLead
          visible={showModal}
          onOk={this.handleModalOk}
          onCancel={() => this.handleModal(false)}
        >
        </BudgetJournalDetailLead>

        <SlideFrame title={this.props.intl.formatMessage({id:"budget.newItemType"})}
                    show={showSlideFrameNew}
                    content={WrappedNewBudgetJournalDetail}
                    afterClose={this.handleAfterCloseNewSlide}
                    onClose={()=>this.showSlideFrameNew(false)}
                    params={{}}/>
      </div>
    )
  }

}



function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetail));
