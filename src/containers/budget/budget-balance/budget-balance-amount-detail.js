import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Button, message, Popover } from 'antd'

import httpFetch from 'share/httpFetch'
import config from 'config'
import menuRoute from 'routes/menuRoute'

import 'styles/budget-setting/budget-organization/new-budget-organization.scss'

class BudgetBalanceAmountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      dimensionColumns: [],
      data: [],
      titleMap: {
        J: '预算额明细',
        R: '保留额明细',
        U: '发生额明细'
      },
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail'),
      columns: {
        J: [
          {title: "期间", dataIndex: "periodName", render: periodName => <Popover content={periodName}>{periodName}</Popover>},
          {title: "季度", dataIndex: "periodQuarter"},
          {title: "年度", dataIndex: "periodYear"},
          {title: "公司", dataIndex: "companyName", render: companyName => <Popover content={companyName}>{companyName}</Popover>},
          {title: "部门", dataIndex: "unitName", render: unitName => <Popover content={unitName}>{unitName}</Popover>},
          {title: "预算申请人", dataIndex: "employeeName"},
          {title: "预算日记账类型", dataIndex: "documentType"},
          {title: "预算日记账编号", dataIndex: "documentNumber", render: documentNumber => <Popover content={documentNumber}><a onClick={() => this.goBudgetJournal(documentNumber)}>{documentNumber}</a></Popover>},
          {title: "预算编制日期", dataIndex: "requisitionDate", render: requisitionDate => new Date(requisitionDate).format('yyyy-MM-dd')},
          {title: "预算项目", dataIndex: "itemName", render: itemName => <Popover content={itemName}>{itemName}</Popover>},
          {title: "币种", dataIndex: "currency"},
          {title: "汇率", dataIndex: "rate", render: this.filterMoney},
          {title: "本位金额", dataIndex: "functionAmount", render: functionAmount => this.filterMoney(functionAmount, 4)},
          {title: "数量", dataIndex: "quantity"},
          {title: "摘要", dataIndex: "description", render: description => <Popover content={description}>{description}</Popover>}
        ],
        R: [
          {title: "公司", dataIndex: "companyName", render: companyName => <Popover content={companyName}>{companyName}</Popover>},
          {title: "部门", dataIndex: "unitName", render: unitName => <Popover content={unitName}>{unitName}</Popover>},
          {title: "申请人", dataIndex: "employeeName"},
          {title: "单据类型", dataIndex: "documentType"},
          {title: "单据编号", dataIndex: "documentNumber", render: documentNumber => <Popover content={documentNumber}>{documentNumber}</Popover>},
          {title: "申请日期", dataIndex: "requisitionDate", render: requisitionDate => new Date(requisitionDate).format('yyyy-MM-dd')},
          {title: "单据行号", dataIndex: "documentLineNum"},
          {title: "申请项目", dataIndex: "itemName",  render: itemName => <Popover content={itemName}>{itemName}</Popover>},
          {title: "币种", dataIndex: "currency"},
          {title: "申请金额", dataIndex: "amount", },
          {title: "税额", dataIndex: "taxAmount"},
          {title: "不含税金额", dataIndex: "saleAmount"},
          {title: "状态"},
          {title: "摘要", dataIndex: "description", render: description => <Popover content={description}>{description}</Popover>},
          {title: "关闭状态"},
          {title: "会计期间", dataIndex: "periodName"},
          {title: "审核状态"}
        ],
        U: [
          {title: "公司", dataIndex: "companyName", render: companyName => <Popover content={companyName}>{companyName}</Popover>},
          {title: "部门", dataIndex: "unitName", render: unitName => <Popover content={unitName}>{unitName}</Popover>},
          {title: "报销人", dataIndex: "employeeName"},
          {title: "单据类型", dataIndex: "documentType"},
          {title: "单据编号", dataIndex: "documentNumber", render: documentNumber => <Popover content={documentNumber}>{documentNumber}</Popover>},
          {title: "报销日期", dataIndex: "requisitionDate", render: requisitionDate => new Date(requisitionDate).format('yyyy-MM-dd')},
          {title: "单据行号", dataIndex: "documentLineNum"},
          {title: "报销项目", dataIndex: "itemName", render: itemName => <Popover content={itemName}>{itemName}</Popover>},
          {title: "币种", dataIndex: "currency"},
          {title: "报销金额", dataIndex: "amount",},
          {title: "税额", dataIndex: "taxAmount"},
          {title: "不含税金额", dataIndex: "saleAmount"},
          {title: "状态"},
          {title: "摘要", dataIndex: "description", render: description => <Popover content={description}>{description}</Popover>},
          {title: "反冲"},
          {title: "会计期间", dataIndex: "periodName"},
          {title: "审核状态"}
        ]
      }
    };
  }

  componentWillReceiveProps(nextProps){
    if((!this.props.params.data && nextProps.params.data) ||
      (this.props.params.data &&
        (nextProps.params.type !== this.props.params.type || nextProps.params.data.key !== this.props.params.data.key))){
      this.getList(nextProps);
    }
  }

  goBudgetJournal = (code) => {
    this.context.router.push(this.state.budgetJournalDetailPage.url.replace(":journalCode",code))
  };

  onChangePager = (page) => {
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1
      }, () => {
        this.getList();
      })
  };

  getList = (nextProps) => {
    this.setState({ loading: true });
    let params = nextProps.params.data;
    params.reserveFlag = nextProps.params.type;
    params.organizationId = this.props.organization.id;
    params.year = params.periodYear;
    httpFetch.post(`${config.budgetUrl}/api/budget/balance/query/results/detail`, params).then(res => {
      let data = res.data.map((item, index) => {
        item.key = index;
        return item;
      });
      this.setState({
        loading: false,
        data,
        dimensionColumns: nextProps.params.dimensionColumns,
        pagination: {
          total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      });
    })
  };

  render(){
    const type = this.props.params.type;
    const { data, loading, pagination, columns, titleMap, dimensionColumns } = this.state;
    const { formatMessage } = this.props.intl;
    let tableColumns = [].concat(columns[type] ? columns[type] : []).concat(dimensionColumns);
    return (
      <div>
        <h3 className="header-title">{titleMap[type]}</h3>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:"common.total"}, {total: pagination.total ? pagination.total : '0'})}</div> {/* 共total条数据 */}
        </div>
        <Table columns={tableColumns}
               dataSource={data}
               bordered
               pagination={pagination}
               loading={loading}
               size="middle"
               rowKey="key"
               scroll={{ x: `${tableColumns.length * 20}%` }}/>
        <div className="slide-footer">
          <Button onClick={() => {this.getList(this.props)}}>刷新查询结果</Button>
          <Button>导出CSV</Button>
        </div>
      </div>
    )
  }

}

BudgetBalanceAmountDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetBalanceAmountDetail));
