/**
 * Created by 13576 on 2017/10/19.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Modal,message,Popconfirm,notification,Icon,Row,Col} from 'antd';
import SearchArea from 'components/search-area.js';
import "styles/budget/budget-journal/budget-journal-detail-submit.scss"

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
      edit: false,
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
      selectorItem: {},
      selectedData: [],
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      organization: {},
      infoDate: [],
      infoList: [
        {
          type: 'input',
          label: this.props.intl.formatMessage({id: "budget.journalCode"}),
          id: 'journalCode',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        {
          type: 'input',
          label: this.props.intl.formatMessage({id: "budget.employeeId"}),
          id: 'employeeName',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        {
          type: 'input',
          label: this.props.intl.formatMessage({id: "budget.organization"}),
          id: 'organizationName',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        {
          type: 'input',
          label: this.props.intl.formatMessage({id: "budget.companyId"}),
          id: 'companyId',
          message: this.props.intl.formatMessage({id: "common.please.enter"}),
          disabled: true
        },
        {
          type: 'list', id: 'journalTypeName',
          listType: 'budget_journal_type',
          labelKey: 'journalTypeName',
          valueKey: 'id',
          label: this.props.intl.formatMessage({id: 'budget.journalTypeId'}), /*预算日记账类型*/
          listExtraParams: {'organizationId': 1}
        },
        {
          type: 'select', id: 'budgetStructure', label: '预算表', isRequired: true, options: [], method: 'get',
          getUrl: `${config.budgetUrl}/api/budget/structures/queryAll`, getParams: {},
          labelKey: 'structureName', valueKey: 'structureCode'
        },

        {
          type: 'input',
          label: this.props.intl.formatMessage({id: "budget.periodYear"}),
          id: 'periodYear',
          message: this.props.intl.formatMessage({id: "common.please.enter"})
        }, /*预算年度*/

        {
          type: 'select', label: this.props.intl.formatMessage({id: "budget.periodStrategy"}), id: 'periodStrategy',
          options: [
            {value: 'Y', label: this.props.intl.formatMessage({id: "budget.year"})},
            {value: 'Q', label: this.props.intl.formatMessage({id: "budget.quarter"})},
            {value: 'M', label: this.props.intl.formatMessage({id: "budget.month"})}

          ]

        },


        {
          type: 'list', id: 'versionName',
          listType: 'budget_versions',
          labelKey: 'versionName',
          valueKey: 'id',
          label: this.props.intl.formatMessage({id: 'budget.version'}), /*预算版本*/
          listExtraParams: {'organizationId': 1}
        },
        {
          type: 'list', id: 'scenarioName',
          listType: 'budget_scenarios',
          labelKey: 'scenarioName',
          valueKey: 'id',
          label: this.props.intl.formatMessage({id: 'budget.scenarios'}), /*预算场景*/
          listExtraParams: {'organizationId': 1}
        },


      ],

      columns: [
        {
          /*公司*/
          title: this.props.intl.formatMessage({id: "budget.companyId"}), key: "companyId", dataIndex: 'companyId'
        },
        {
          /*部门*/
          title: this.props.intl.formatMessage({id: "budget.unitId"}), key: "unitId", dataIndex: 'unitId'
        },
        {
          /*预算项目*/
          title: this.props.intl.formatMessage({id: "budget.item"}), key: "itemId", dataIndex: 'itemId'
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
          /*汇率类型*/
          title: this.props.intl.formatMessage({id: "budget.rateType"}), key: "rateType", dataIndex: 'rateType'
        },
        {
          /*标价方法*/
          title: this.props.intl.formatMessage({id: "budget.rateQuotation"}),
          key: "rateQuotation",
          dataIndex: 'rateQuotation'
        },
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
        {
          /*单位*/
          title: this.props.intl.formatMessage({id: "budget.unit"}), key: "unit", dataIndex: 'unit'
        },
        {
          /*备注*/
          title: this.props.intl.formatMessage({id: "budget.remark"}), key: "remark", dataIndex: 'remark'
        },
      ],
    };
  }

  componentWillMount=()=>{
    this.getOrganization();
    this.getDataByBudgetJournalCode();
  }

  //获取预算组织
  getOrganization=()=> {
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/organization/by/login`).then((request) => {
      console.log(request.data)
      this.setState({
        organization: request.data
      })
    })
  }

  //根据预算日记账编码查询预算日记账头行
  getDataByBudgetJournalCode=()=>{
    const budgetJournalCode =this.props.params.journalTypeCode;
    console.log(budgetJournalCode);
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


  render(){
    const { data, columns,pagination} = this.state;
    return(
    <div className="budget-journal-detail-submit">

      <div className="base-info">
        <div className="base-info-header">
          基本信息
        </div>

          <Row className="base-info-cent">
            <Col span={8}>

            </Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
          </Row>


      </div>

        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               bordered
               size="middle"
        />
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetailSubmit));

