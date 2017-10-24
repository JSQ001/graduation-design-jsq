/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Modal,message,Popconfirm,notification,Icon} from 'antd';
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
      selectedData:[],
      rowSelection: {
        type:'checkbox',
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


  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ rowSelection });
  };

  onSelectItem=(record, selected)=>{
    console.log(record);
    console.log(selected);
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
    console.log(selectedData);
    httpFetch.delete(`${config.budgetUrl}/api/budget/journals/batch/lines`,selectedData).then((res)=>{
        message.success("删除成功");
    }).catch(e=>{
      message.error("删除失败");
    })
  }


  componentWillMount(){
    //根据编制期代码拿数据

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

    console.log(value);

      let data = this.state.data;
      let headerAndListData = this.state.headerAndListData;
      let fla =1;
      if(value.hasOwnProperty("id")){

        console.log("id+6666666666666666")
         let list = headerAndListData.list;
         for(let a=0;a<list.length;a++){
            if(list[a].id==value.id){
              list[a]=value;
              fla=0;
            }
         }
          headerAndListData.list=list;
        console.log(list);
      }

      if(fla==1){
        console.log("value");
        console.log(value)
        headerAndListData.list.addIfNotExist(value);
        data.addIfNotExist(value);
      }


    this.setState({
      data:data,
      headerAndListData: headerAndListData
    });


      console.log(headerAndListData)
      console.log(this.state.data);
      console.log(55555555555555555555555)

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

//保存新增，或修改
  handleSaveJournal=()=>{
    let headerAndListData = this.state.headerAndListData;
    console.log(headerAndListData);
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`,headerAndListData).then((req) => {
      console.log(req.data)
      message.success("成功");
      this.getDataByBudgetJournalCode;
    }).catch(e => {
      message.error("失败")
    })

  }

  //提交单据
  handlePut=()=>{
    let headerAndListData = this.state.headerAndListData;
    console.log(headerAndListData.list.length);
    if(headerAndListData.list.length>0) {
      let headerId = headerAndListData.dto.id;
      console.log(headerId)
      httpFetch.post(`${config.budgetUrl}/api/budget/journals/submitJournal/${headerId}`).then((req) => {
        console.log(req.data)
        message.success("提交成功");
        this.getDataByBudgetJournalCode;
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

    //let company = JSON.parse(value.company);
    // let item = JSON.parse(value.item);
    //let periodName = JSON.parse(value.periodName);
    // let currency =JSON.parse(value.currency);

  /*  let company = {
      "key": value.companyId,
      "label": value.companyName,
      "value":{
        "id":value.companyId,
        "companyName":value.companyName
      }
    }*/

   /* let item = {
      "key": value.itemId,
      "label": value.itemName,
      "value":{
        "id":value.itemId,
        "companyName":value.itemName
      }
    }*/

   /* let periodName = {
      "key": value.companyId,
      "label": value.companyId,
      "value":{
        "id":value.companyId,
        "companyName":value.companyName
      }
    }*/

  /*  let currency = {
      "key": value.currency,
      "label": value.currency,
      "value":{
        "currency":value.currency,
      }
    }*/


    const valueData = {
      ...value,
      "company":value.companyName,
      "item":value.itemName,
      "periodName":value.periodName,
      "currency":value.currency

    }

    console.log(valueData);

    this.setState({
      params:valueData,
      showSlideFrameNew:true,
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
              <Button type="primary" onClick={this.showSlideFrameNewData}>{this.props.intl.formatMessage({id:"common.add"})}</Button>
              <Button type="primary" onClick={() => this.handleModal(true)}>{this.props.intl.formatMessage({id:"budget.leading"})}</Button>
              <Popconfirm placement="topLeft" title={"确认删除"} onConfirm={this.handleDeleteLine} okText="Yes" cancelText="No">
              <Button className="delete" >{this.props.intl.formatMessage({id:"common.delete"})}</Button>
              </Popconfirm>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"
                 onRowClick={this.handlePutData}
                 rowSelection={rowSelection}

          />
          <div className="footer-operate">
            <Button type="primary" onClick={this.handlePut}>提交</Button>
            <Button type="primary" onClick={this.handleSaveJournal}>{this.props.intl.formatMessage({id:"common.save"})}</Button>
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

        <SlideFrame title={this.props.intl.formatMessage({id:"budget.newItemType"})}
                    show={showSlideFrameNew}
                    content={WrappedNewBudgetJournalDetail}
                    afterClose={this.handleAfterCloseNewSlide}
                    onClose={()=>this.showSlideFrameNew(false)}
                    params={this.state.params}/>
      </div>
    )
  }

}



function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetail));
