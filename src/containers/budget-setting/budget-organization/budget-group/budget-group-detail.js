import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Table, Form, Select, Button, Row, Col, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import selectorData from 'share/selectorData'

class BudgetGroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      loading: true,
      saving: false,
      groupData: {},
      columns: [
        {title: "预算项目代码", dataIndex: "itemCode", width: '25%'},
        {title: "预算项目描述", dataIndex: "itemName", width: '35%'},
        {title: "预算项目类型", dataIndex: "itemTypeName", width: '20%'},
        {title: '操作', key: 'operation', width: '20%', render: () => <a href="#">删除</a>,}
      ],
      infoList: [
        {type: 'input', label: '预算组织', id: 'organizationName', message: '请输入', isDisabled: true},
        {type: 'input', label: '预算项目组代码', id: 'itemGroupCode', message: '请输入'},
        {type: 'input', label: '预算项目组描述', id: 'itemGroupName', message: '请输入'},
        {type: 'switch', label: '状态：', id: 'isEnabled'}
      ],
      data: [],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      showListSelector: false,
      newData: [],
      extraParams: {},
      selectedData: [],
      rowSelection: {
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      selectorItem: {}
    }
    ;
  }

  componentWillMount(){
    httpFetch.get(`${config.budgetUrl}/api/budget/groups/${this.props.params.groupId}`).then(response => {
      response.data.organizationName = this.props.organization.organizationName;
      this.setState({ groupData: response.data});
    });
    this.getList();

    let selectorItem = selectorData['budget_item_filter'];
    selectorItem.url = `${config.budgetUrl}/api/budget/groupDetail/${this.props.params.groupId}/query/fiter`;
    httpFetch.get(`${config.budgetUrl}/api/budget/items/find/all?organizationId=${this.props.organization.id}`).then(response => {
      let result = [];
      response.data.map((item) => {
        result.push({
          label: item.itemCode,
          value: item.itemCode
        })
      });
      selectorItem.searchForm[2].options = result;
      selectorItem.searchForm[3].options = result;
      this.setState({ selectorItem })
    });
  }

  updateHandleInfo = (params) => {
    httpFetch.put(`${config.budgetUrl}/api/budget/groups`, Object.assign(this.state.groupData, params)).then(response => {
      message.success('修改成功');
      response.data.organizationName = this.props.organization.organizationName;
      this.setState({
        groupData: response.data,
        updateState: true
      });
    });
  };

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList(this.state.nowStatus);
      })
  };

  /**
   * 根据selectedData刷新当页selection
   */
  refreshSelected(){
    let { selectedData, data, rowSelection } = this.state;
    let nowSelectedRowKeys = [];
    selectedData.map(selected => {
      data.map(item => {
        if(item.id === selected.id)
          nowSelectedRowKeys.push(item.id)
      })
    });
    rowSelection.selectedRowKeys = nowSelectedRowKeys;
    this.setState({ rowSelection });
  };

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ rowSelection });
  };

  /**
   * 选择单个时的方法，遍历selectedData，根据是否选中进行插入或删除操作
   * @param record 被改变的项
   * @param selected 是否选中
   */
  onSelectItem = (record, selected) => {
    let { selectedData } = this.state;
    if(!selected){
      selectedData.map((selected, index) => {
        if(selected.id === record.id){
          selectedData.splice(index, 1);
        }
      })
    } else {
      selectedData.push(record);
    }
    this.setState({ selectedData });
  };

  //选择当页全部时的判断
  onSelectAll = (selected, selectedRows, changeRows) => {
    changeRows.map(changeRow => this.onSelectItem(changeRow, selected));
  };

  getList = () => {
    const { page, pageSize } = this.state;
    return httpFetch.get(`${config.budgetUrl}/api/budget/groupDetail/${this.props.params.groupId}/query?page=${page}&size=${pageSize}`).then(response => {
      response.data.map((item)=>{
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      }, () => {
        this.refreshSelected();  //刷新当页选择器
      })
    })
  };

  handleBatchDelete = () => {
    console.log(this.state.selectedData);
  };

  handleNew = () => {
    this.setState({ showListSelector: true })
  };

  handleAdd = (result) => {
    console.log(result)
    this.setState({ showListSelector: false })
  };

  handleCancel = () => {
    this.setState({ showListSelector: false })
  };

  render(){
    const { pagination, saving, showListSelector, extraParams, loading, newData, data, rowSelection, columns, selectedData, infoList, groupData, updateState, selectorItem } = this.state;
    return (
      <div>
        <BasicInfo infoList={infoList}
                   infoData={groupData}
                   updateHandle={this.updateHandleInfo}
                   updateState={updateState}/>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew} loading={saving}>添 加</Button>
            <Button onClick={this.handleBatchDelete} disabled={selectedData.length === 0}>删 除</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={newData.concat(data)}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"
               rowSelection={rowSelection}/>
        <ListSelector visible={showListSelector}
                      onOk={this.handleAdd}
                      onCancel={this.handleCancel}
                      type='budget_item_filter'
                      extraParams={extraParams}
                      selectorItem={selectorItem}/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

BudgetGroupDetail.contextTypes = {
  router: React.PropTypes.object
};

const WrappedBudgetGroupDetail = Form.create()(BudgetGroupDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetGroupDetail));
