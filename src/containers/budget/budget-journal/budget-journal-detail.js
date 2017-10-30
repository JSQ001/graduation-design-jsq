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
      infoDate:[],
      infoList:[
        /*预算日记账编号*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.journalCode"}), id: 'journalCode', message: this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        /*总金额*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.total.amount"}), id: 'totalAmount', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        /*申请人*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.employeeId"}), id: 'employeeName', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        /*岗位*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.positionId"}), id: 'positionId', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        /*创建时间*/
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.createdDate"}), id: 'createdDate', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        /*预算日记账类型*/
        {type: 'list', id: 'journalType',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'journalTypeId',
          label:this.props.intl.formatMessage({id: 'budget.journalTypeId'}),
          listExtraParams:{organizationId:1},
          disabled: true
        },
       /* {type: 'select', id:'budgetStructure', label: '预算表', isRequired: true, options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: {organizationId:1},
          labelKey: 'structureName', valueKey: 'id'},*/

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
        {type:'value_list',label: this.props.intl.formatMessage({id:"budget.periodStrategy"}) ,id:'periodStrategy',isRequired: true, options: [], valueListCode: 2002, disabled: true},
        {type:'file',label: this.props.intl.formatMessage({id:"budget.attachment"}),id:'file'}

      ],

      columns: [


        {          /*公司*/
          title: this.props.intl.formatMessage({id:"budget.companyId"}), key: "companyName", dataIndex: 'companyName'
        },
        {          /*部门*/
          title: this.props.intl.formatMessage({id:"budget.unitId"}), key: "unitName", dataIndex: 'unitName'
        },
        {          /*预算项目*/
          title: this.props.intl.formatMessage({id:"budget.item"}), key: "itemName", dataIndex: 'itemName'
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
          title: this.props.intl.formatMessage({id:"budget.quantity"}), key: "quantity", dataIndex: 'quantity'
        },
        {          /*单位*/
          title: this.props.intl.formatMessage({id:"budget.unit"}), key: "unit", dataIndex: 'unit'
        },
        {          /*备注*/
          title: this.props.intl.formatMessage({id:"budget.remark"}), key: "remark", dataIndex: 'remark'
        },
      ],

      budgetJournalPage: menuRoute.getRouteItem('budget-journal','key'),    //预算日记账

    };
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
      this.getDataByBudgetJournalCode();
        message.success("删除成功");
    }).catch(e=>{
      message.error("删除失败");
    })
  }


  componentWillMount(){
    //根据编制期代码拿数据
    this.getDataByBudgetJournalCode();

  }




 //根据预算日记账编码查询预算日记账头行
  getDataByBudgetJournalCode=()=>{
    this.setState({
      loading:true
    })
    const journalCode =this.props.params.journalCode;
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/query/${journalCode}`).then((response)=>{
    console.log(response.data)
      let listData = response.data.list;
    console.log(listData);
      let headerData =response.data.dto;
      console.log("!!!!!!!!!!!!!!!!!!!!");
      console.log(headerData);

      const journalType=[]
      const journalType1={
        "journalTypeName":headerData.journalTypeName,
        "journalTypeId":headerData.journalTypeId,
      }
      journalType.push(journalType1);


      const versionName=[]
      const versionName1={
        "versionName":headerData.versionName,
        "id":headerData.versionId
      }
      versionName.push(versionName1);

      const scenarioName=[]
      const scenarioName1={
        "scenarioName":headerData.scenario,
        "id":headerData.scenarioId
      }
      scenarioName.push(scenarioName1);

      const budgetStructure={
        "label":headerData.structureName,
        "key":headerData.structureId
      }


      const periodYear={
        "label":headerData.periodYear,
        "key":headerData.periodYear
      }

     /* const periodStrategy={
        "label":headerData.periodStrategy,
        "key":headerData.periodStrategy
      }
*/
      const periodStrategy={
        "label":"年",
        "key":"YEAR"
      }

      const file={
        "fileName": "捕获.PNG",
        "fileType": "IMAGE",
        "fileURL": "https://huilianyi-uat.oss-cn-shanghai.aliyuncs.com/e4b4a421-0355-4449-a610-26ff99322ab1/pdf/%E6%8D%95%E8%8E%B7.PNG?Expires=1509020077&OSSAccessKeyId=zmKqYB24JQrTqfiH&Signature=M%2BhSLTAjdrEtfgn%2Fe9GosXSyFGQ%3D",
      }
      const fileData =[];
      fileData.push(file);

      const infoData={
        ...headerData,
        "journalType":journalType,
        "versionName":versionName,
        "scenarioName":scenarioName,
        "budgetStructure":budgetStructure,
        "periodYear":periodYear,
        "file":fileData,
      }

      console.log(infoData)


    this.setState({
      loading:false,
      headerAndListData:response.data,
      infoDate:infoData,
      data:listData,
      pagination: {
        total:response.data.list.length ,
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
    console.log(headerAndListData);
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`,headerAndListData).then((req) => {
      console.log(req.data)
      message.success("成功");
      this.getDataByBudgetJournalCode();
    }).catch(e => {
      message.error("失败")
    })

  }

  //提交单据
  handlePut=()=>{
    let headerAndListData = this.state.headerAndListData;
    console.log(headerAndListData.list.length);
    if(headerAndListData.list.length>0 ) {
      let headerId = headerAndListData.dto.id;
      console.log(headerId)
      httpFetch.post(`${config.budgetUrl}/api/budget/journals/submitJournal/${headerId}`).then((req) => {
        console.log(req.data)
        message.success("提交成功");
       // this.getDataByBudgetJournalCode();

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

    const {loading, data, columns, pagination,formData,infoDate,infoList,updateState,showModal,showSlideFrameNew,showSlideFramePut,rowSelection} = this.state;
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

BudgetJournalDetail.contextTypes ={
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetail));
