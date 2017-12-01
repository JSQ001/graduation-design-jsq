import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Tabs, Button, message, Icon, Table, Checkbox, Badge } from 'antd';
const TabPane = Tabs.TabPane;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import selectorData from 'share/selectorData'
import ListSelector from 'components/list-selector'
import BasicInfo from 'components/basic-info'

class CashTransactionClassDetail extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      updateState: false,
      saving: false,
      loading: true,
      editing: false,
      setOfBookId: -1,
      infoList: [
        {type: 'input', id: 'setOfBookName',required: true, disabled: true, label: `${this.props.intl.formatMessage({id:"budget.set.of.books"})}`}, //账套
        {type: 'input', id: 'typeName',required: true, disabled: true, label: formatMessage({id: 'cash.transaction.class.type'}) }, /*现金事务类型代码*/
        {type: 'input', id: 'classCode',required: true, disabled: true, label: formatMessage({id: 'cash.transaction.class.code'}) }, /*现金事务分类代码*/
        {type: 'input', id: 'description',required: true, label: formatMessage({id: 'cash.transaction.class.description'}) }, /*现金事务分类名称*/
        {type: 'switch', id: 'isEnabled', label: formatMessage({id: 'common.column.status'}) +" :"/*状态*/},
      ],
      classData: {},
      data: [],
      cashFlowItemData: {
          saveUrl: `${config.payUrl}/api/cash/default/flowitems/batch`,
          url: `${config.payUrl}/api/cash/default/flowitems/query`,
          selectorItem: selectorData['cash_flow_item'],
          columns: [
            {title: formatMessage({id: 'cash.flow.item.flowCode'}), dataIndex: "flowCode", width: '30%'},
            {title: formatMessage({id: 'cash.flow.item.description'}), dataIndex: "description", width: '40%'},
            {title: formatMessage({id: 'cash.flow.item.default.flag'}), dataIndex: "defaultFlag", width: '15%', render: (defaultFlag, record) => <Checkbox onChange={(e) => this.onChangeDefault(e, record)} checked={record.defaultFlag}/>},
            {title: formatMessage({id: 'cash.flow.item.enabled.flag'}), key: 'isEnabled', width: '15%', render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>}
          ]
      },
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      showListSelector: false,
      newData: [],
      cashTransactionClass: menuRoute.getRouteItem('cash-transaction-class', 'key'),  //现金事务的页面项
    };
  }

  onChangeDefault = (e, record) => {
    this.setState({loading: true});
    record.defaultFlag = e.target.checked;
    httpFetch.put(`${config.payUrl}/api/cash/default/flowitems`, record).then(() => {
      this.getList().then(response => {
        this.setState({loading: false})
      });
    })
  };

  onChangeEnabled = (e, record) => {
    this.setState({loading: true});
    record.isEnabled = e.target.checked;
    httpFetch.put(`${config.payUrl}/api/cash/default/flowitems`, record).then(() => {
      this.getList().then(response => {
        this.setState({loading: false})
      });
    })
  };

  componentWillMount(){
    httpFetch.get(`${config.payUrl}/api/cash/transaction/classes/${this.props.params.classId}`).then(response => {
      let data = response.data;
      let infoList = this.state.infoList;
      this.setState({ classData: data,setOfBookId: data.setOfBookId, infoList});
    });
    this.getList();
  }


  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  getList = () => {
    const { cashFlowItemData, page, pageSize } = this.state;
    let url = cashFlowItemData.url;
    if(url){
      return httpFetch.get(`${url}?transactionClassId=${this.props.params.classId}&page=${page}&size=${pageSize}`).then(response => {
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
    const { cashFlowItemData, nowStatus, newData } = this.state;
    let paramList = [];
    newData.map(item => {
      let flowItem = {};
      flowItem.cashFlowItemId = item.id;
      flowItem.transactionClassId = this.props.params.classId;
      flowItem.defaultFlag = false;
      flowItem.isEnabled = true;
      paramList.push(flowItem);
    });
    this.setState({saving: true}, ()=>{
      httpFetch.post(cashFlowItemData.saveUrl, paramList).then(response => {
        message.success('添加成功');
        this.setState({
          newData: [],
          page: 0,
          saving: false
        }, () => {
          this.getList();
        })
      }).catch(e => {
        this.setState({ editing: false });
        if(e.response){
          message.error(`添加失败,${e.response.data.validationErrors[0].message}`);
        }
      });
    })
  };

  updateHandleInfo = (params) => {
    this.setState({ editing: true });
    httpFetch.put(`${config.payUrl}/api/cash/transaction/classes`, Object.assign({}, this.state.classData, params)).then(response => {
      message.success('修改成功');
      let data = response.data;
      let infoList = this.state.infoList;
      this.setState({
        classData: data,
        updateState: true,
        editing: false,
        infoList
      });
    }).catch(e => {
      if(e.response){
        message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.validationErrors[0].message}`);
      }
      this.setState({ editing: false })
    });
  };

  render(){
    const {infoList, classData, cashFlowItemData, loading, pagination, data, showListSelector, saving, updateState, editing} = this.state;
    return (
      <div>
        <BasicInfo infoList={infoList}
                   infoData={classData}
                   updateHandle={this.updateHandleInfo}
                   updateState={updateState}
                   loading={editing}/>
        <div className="table-header">
          <div className="table-header-title">共搜索到 {pagination.total} 条数据</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew} loading={saving}>添 加</Button>
          </div>
        </div>
        <Table columns={cashFlowItemData.columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"/>

        <a className="back" onClick={() => {this.context.router.push(this.state.cashTransactionClass.url);}}><
          Icon type="rollback" style={{marginRight:'5px'}}/>返回
        </a>

        <ListSelector visible={showListSelector}
                      onOk={this.handleAdd}
                      onCancel={this.handleCancel}
                      selectorItem={cashFlowItemData.selectorItem}
                      extraParams={cashFlowItemData.extraParams ? cashFlowItemData.extraParams : {setOfBookId: this.state.setOfBookId,isEnabled: true}}/>
      </div>
    )
  }

}

CashTransactionClassDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(injectIntl(CashTransactionClassDetail));
