/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Modal } from 'antd';
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
      showSlideFramePut:false,
      showSlideFrameNew:false,
      showModal:false,
      updateState:false,
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      infoDate:[],
      infoList: [
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.journalNumber"}), id: 'journalNumber', message: this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.employeeId"}), id: 'employeeId', message:this.props.intl.formatMessage({id:"common.please.enter"}), disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.organization"}), id: 'organizationName', message:this.props.intl.formatMessage({id:"common.please.enter"}),disabled: true},
        {type: 'input', label: this.props.intl.formatMessage({id:"budget.companyId"}), id: 'companyId', message:this.props.intl.formatMessage({id:"common.please.enter"}),disabled: true},
        {type: 'list', id: 'journalTypeName',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'id',
          label:this.props.intl.formatMessage({id: 'budget.journalTypeId'}),  /*预算日记账类型*/
          listExtraParams:{'organizationId':1}
        },

        {
          type: 'combobox',
          id: 'structureId',
          label: this.props.intl.formatMessage({id:"budget.structureId"}),  /*预算表*/
          placeholder: this.props.intl.formatMessage({id:"common.please.enter"}),
          options: [],
          searchUrl: `${config.budgetUrl}/api/budget/structures/query`,
          method: 'get',
          searchKey: '',
          labelKey: 'structureName',
          valueKey: 'id'
        },


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


  componentWillMount(){
    console.log(this.props.location)
    const data = this.props.location.state.fromData;
    console.log(data);
    this.setState({
      infoDate:data
    })
  }



  showImport=()=>{}

  updateHandleInfo=()=>{}



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


  handleAfterCloseNewSlide=(value)=>{
      console.log(value)
  }


  render(){
    const { data, columns, pagination,formData,infoDate,infoList,updateState,showModal,showSlideFrameNew,showSlideFramePut} = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <div className="budget-versions-detail">
          <BasicInfo infoList={infoList}
                     infoData={infoDate}
                     updateHandle={this.updateHandleInfo}
                     updateState={updateState}/>

          <div className="table-header">
            <div className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>
            <div className="table-header-buttons">
              <Button type="primary" onClick={()=>this.showSlideFrameNew(true)}>{this.props.intl.formatMessage({id:"common.add"})}</Button>
              <Button type="primary" onClick={() => this.handleModal(true)}>{this.props.intl.formatMessage({id:"budget.leading"})}</Button>

              <Button onClick={this.infoDateChangeHandle}>{this.props.intl.formatMessage({id:"common.delete"})}</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"
          />

        </div>

        <div className="footer-operate">
          <Button>提交</Button>
          <Button>{this.props.intl.formatMessage({id:"common.save"})}</Button>
          <Button>{this.props.intl.formatMessage({id:"budget.delete.journal"})}</Button>
        </div>

        <Modal
          width={600}
          title="Basic Modal"
          visible={showModal}
          onOk={this.handleModalOk}
          onCancel={() => this.handleModal(false)}
        >
          <BudgetJournalDetailLead/>
        </Modal>

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
