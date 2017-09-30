import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Tabs, Button, Row, Col, message, Badge, Table, Checkbox } from 'antd';
const TabPane = Tabs.TabPane;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import selectorData from 'share/selectorData'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

class BudgetJournalTypeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
      saving: false,
      loading: true,
      infoList: [
        {type: 'input', label: '预算日记账类型代码', id: 'journalTypeCode', message: '请输入', disabled: true},
        {type: 'input', label: '预算日记账类型描述', id: 'journalTypeName', message: '请输入'},
        {type: 'select', label: '预算业务类型', id: 'businessType', message: '请选择', options:[]},
        {type: 'switch', label: '状态：', id: 'isEnabled'}
      ],
      tabs: [
        {key: 'STRUCTURE', name:'预算表'},
        {key: 'ITEM', name:'预算项目'},
        {key: 'PERSON', name:'员工组'},
        {key: 'COMPANY', name:'公司分配'}
      ],
      typeData: {},
      data: [],
      tabsData: {
        STRUCTURE:{
          saveUrl: `${config.budgetUrl}/api/budget/journal/type/assign/structures/batch`,
          url: `${config.budgetUrl}/api/budget/journal/type/assign/structures/query`,
          selectorItem: selectorData['budget_journal_structure'],
          extraParams: {organizationId: this.props.organization.id},
          columns: [
            {title: "预算表", dataIndex: "structureName", width: '30%'},
            {title: "预算表代码", dataIndex: "structureCode", width: '40%'},
            {title: "默认", dataIndex: "isDefault", width: '15%', render: (isDefault, record) => <Checkbox onChange={(e) => this.onChangeDefault(e, record)} checked={record.isDefault}/>},
            {title: '启用', key: 'isEnabled', width: '15%', render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>}
          ]
        },
        ITEM:{
          saveUrl: `${config.budgetUrl}/api/budget/journal/type/assign/items/batch`,
          url: `${config.budgetUrl}/api/budget/journal/type/assign/items/query`,
          selectorItem: selectorData['budget_journal_item'],
          extraParams: {organizationId: this.props.organization.id},
          columns:
          [
            {title: "预算项目代码", dataIndex: "itemCode", width: '30%'},
            {title: "预选项目描述", dataIndex: "itemName", width: '70%'}
          ]
        },
        PERSON: {
          columns: [
            {title: "员工组代码", dataIndex: "personCode", width: '30%'},
            {title: "员工组描述", dataIndex: "personName", width: '70%'}
          ]
        },
        COMPANY: {
          columns: [
            {title: "公司代码", dataIndex: "personCode", width: '30%'},
            {title: "公司简称", dataIndex: "personName", width: '50%'},
            {title: "公司状态", dataIndex: "isEnabled", width: '20%', render: isEnabled => <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? '启用' : '禁用'}/>},
          ]
        }
      },
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      nowStatus: 'STRUCTURE',
      showListSelector: false,
      newData: []
    };
  }

  onChangeDefault = (e, record) => {
    this.setState({loading: true});
    record.isDefault = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/journal/type/assign/structures`, record).then(() => {
      this.getList(this.state.nowStatus).then(response => {
        this.setState({loading: false})
      });
    })
  };

  onChangeEnabled = (e, record) => {
    this.setState({loading: true});
    record.isEnabled = e.target.checked;
    httpFetch.put(`${config.budgetUrl}/api/budget/journal/type/assign/structures`, record).then(() => {
      this.getList(this.state.nowStatus).then(response => {
        this.setState({loading: false})
      });
    })
  };

  componentWillMount(){
    httpFetch.get(`${config.budgetUrl}/api/budget/journal/types/${this.props.params.typeId}`).then(response => {
      this.setState({ typeData: response.data});
    });
    this.getList(this.state.nowStatus);
    if(this.props.organization.id){
      httpFetch.get(`${config.budgetUrl}/api/budget/structures/queryAllStructure?organizationId=${this.props.organization.id}`).then(response => {
        let tabsData = this.state.tabsData;
        let options = [];
        if(response.data.length && response.data.length > 0){
          response.data.map(item => {
            options.push({
              value: item.structureCode,
              label: item.structureCode
            })
          })
        }
        tabsData['STRUCTURE'].selectorItem.searchForm[2].options = options;
        tabsData['STRUCTURE'].selectorItem.searchForm[3].options = options;
        this.setState({ tabsData })
      });

      httpFetch.get(`${config.budgetUrl}/api/budget/items/find/all?organizationId=${this.props.organization.id}`).then(response => {
        let tabsData = this.state.tabsData;
        let options = [];
        if(response.data.length && response.data.length > 0){
          response.data.map(item => {
            options.push({
              value: item.itemCode,
              label: item.itemCode
            })
          })
        }
        tabsData['ITEM'].selectorItem.searchForm[2].options = options;
        tabsData['ITEM'].selectorItem.searchForm[3].options = options;
        this.setState({ tabsData })
      })
    }
  }

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList(this.state.nowStatus);
      })
  };

  getList = (key) => {
    const { tabsData, page, pageSize } = this.state;
    let url = tabsData[key].url;
    if(url){
      return httpFetch.get(`${url}?journalTypeId=${this.props.params.typeId}&page=${page}&size=${pageSize}`).then(response => {
        response.data.map((item, index)=>{
          item.key = item.id ? item.id : index;
        });
        this.setState({
          data: response.data,
          loading: false,
          pagination: {
            total: Number(response.headers['x-total-count']),
            onChange: this.onChangePager,
            current: this.state.page + 1
          }
        })
      })
    }
  };

  onChangeTabs = (key) =>{
    this.setState({
      nowStatus: key,
      loading: true,
      page: 0
    }, ()=>{
      this.getList(key);
    })
  };

  handleNew = () => {
    this.setState({ showListSelector: true })
  };

  handleAdd = (result) => {
    this.setState({
      newData: result.result,
      showListSelector: false
    }, () => {
      this.handleSave();
    })
  };

  handleCancel = () => {
    this.setState({ showListSelector: false })
  };

  handleSave = () => {
    const { tabsData, nowStatus, newData } = this.state;
    let paramList = [];
    newData.map(item => {
      if(nowStatus === 'STRUCTURE'){
        item.structureId = item.id;
        delete item.id;
      }
      if(nowStatus === 'ITEM'){
        item.bgtItemId = item.id;
        delete item.id;
      }
      item.journalTypeId = this.props.params.typeId;
      paramList.push(item);
    });
    this.setState({saving: true}, ()=>{
      httpFetch.post(tabsData[nowStatus].saveUrl, paramList).then(response => {
        message.success('添加成功');
        this.setState({
          newData: [],
          page: 0,
          saving: false
        }, () => {
          this.getList(nowStatus);
        })
      })
    })
  };

  updateHandleInfo = (params) => {
    httpFetch.put(`${config.budgetUrl}/api/budget/journal/types`, Object.assign(this.state.typeData, params)).then(response => {
      message.success('修改成功');
      this.setState({
        typeData: response.data,
        updateState: true
      });
    });
  };

  render(){
    const {infoList, typeData, tabsData, loading, pagination, nowStatus, data, showListSelector, saving, newData, updateState} = this.state;
    return (
      <div>
        <BasicInfo infoList={infoList}
                   infoData={typeData}
                   updateHandle={this.updateHandleInfo}
                   updateState={updateState}/>
        <Tabs onChange={this.onChangeTabs} style={{ marginTop: 20 }}>
          {this.renderTabs()}
        </Tabs>
        <div className="table-header">
          <div className="table-header-title">共 {pagination.total} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew} loading={saving}>添 加</Button>
          </div>
        </div>
        <Table columns={tabsData[nowStatus].columns}
               dataSource={newData.concat(data)}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"/>
        <ListSelector visible={showListSelector}
                      onOk={this.handleAdd}
                      onCancel={this.handleCancel}
                      selectorItem={tabsData[nowStatus].selectorItem}
                      extraParams={tabsData[nowStatus].extraParams ? tabsData[nowStatus].extraParams : {}}/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalTypeDetail));
