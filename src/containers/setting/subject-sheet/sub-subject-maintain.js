/**
 * Created by dicky on 2017/12/28.
 */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table, Popconfirm, Badge, Button, Popover, Form, Switch, Input, message, Icon, Select, Radio } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
import SearchArea from 'components/search-area.js';
import SlideFrame from 'components/slide-frame'
import config from 'config';
import httpFetch from 'share/httpFetch';
import menuRoute from 'routes/menuRoute'
import 'styles/setting/subject-sheet/subject-sheet.scss'
import ListSelector from 'components/list-selector'
import AddSubSubjectMaintain from 'containers/setting/subject-sheet/add-sub-subject-maintain'
//子科目
class SubSubjectMaintain extends React.Component {
  constructor(props) {
    super(props);

    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      params: {},
      batchDelete: true,
      buttonLoading: false,
      subjectListSelector: false,  //控制科目明细选则弹框
      selectedRowKeys: [],
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchParams: {
        parentAccountId: '',//父科目ID
        info: '' //查询信息
      },
      updateParams: {
        accountId: '', // 科目ID
        accountSetId: ''//科目表ID
      },

      subjectSelectorItem: {
        title: "添加科目",
        url: `${config.baseUrl}/api/accounts/hierarchy/child/query`,
        searchForm: [
          {
            type: 'items', colSpan: 24, id: 'name', items: [
              { type: 'input', id: 'accountCode', label: formatMessage({ id: "subject.code" }),defaultValue: '' },
              { type: 'input', id: 'accountName', label: formatMessage({ id: "subject.name" }),defaultValue: '' }
            ]
          },
          //科目表代码
          {
            type: 'items', colSpan: 24, id: 'code', items: [
              { type: 'input', id: 'codeFrom', width: 200, label: formatMessage({ id: "subject.code.from" }),defaultValue: '' },
              { type: 'input', id: 'codeTo', width: 200, label: formatMessage({ id: "subject.code.to" }) ,defaultValue: ''}
            ]
          }
        ],
        columns: [
          {
            title: formatMessage({ id: "subject.code" }),
            key: 'accountCode',
            dataIndex: 'accountCode',
            width: '10%',
            align: "center",
          },
          {
            title: formatMessage({ id: "subject.name" }),
            key: 'accountName',
            dataIndex: 'accountName',
            width: '10%',
            align: "center",
            render: accountName => (
              <Popover content={accountName}>
                {accountName}
              </Popover>)
          },
          {
            title: formatMessage({ id: "subject.type" }),
            key: 'accountTypeName',
            dataIndex: 'accountTypeName',
            width: '10%',
            align: "center",
          }
        ],
        key: 'subAccountId'
      },
      tableData: [],
      columns: [
        {
          title: formatMessage({ id: "subject.code" }),
          key: 'accountCode',
          dataIndex: 'accountCode',
          width: '10%',
          align: "center",
        },
        {
          title: formatMessage({ id: "subject.name" }),
          key: 'accountName',
          dataIndex: 'accountName',
          width: '10%',
          align: "center",
          render: accountName => (
            <Popover content={accountName}>
              {accountName}
            </Popover>)
        },
        {
          title: formatMessage({ id: "subject.type" }),
          key: 'accountTypeName',
          dataIndex: 'accountTypeName',
          width: '10%',
          align: "center",
        },
        {
          title: "操作", dataIndex: 'operation', width: '10%', key: 'id', dataIndex: "id", key: "id", align: "center",
          render: (text, record) => {
            return (<div>
              <Popconfirm onConfirm={(e) => this.deleteItem(e, record.id)} title={formatMessage({ id: "common.confirm.delete" })}>{/* 你确定要删除吗 */}
                <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>{formatMessage({ id: "common.delete" })}</a>
              </Popconfirm>
            </div>)
          }
        }
      ],
    }
  }

  //删除
  deleteItem = (e, id) => {
    httpFetch.delete(`${config.baseUrl}/api/accounts/hierarchy/${id}`).then((res) => {
      if (res.status === 200) {
        message.success(this.props.intl.formatMessage({ id: "common.operate.success" }))
        this.getAddedSubList();
      }
    }).catch((e) => {
      message.error(this.props.intl.formatMessage({ id: "common.operate.filed" }) + `${e.response.data.message}`);
    })
  }

  //批量删除
  deleteItemBatch = (e,record) => {
    this.setState({buttonLoading: true});
    httpFetch.delete(`${config.baseUrl}/api/accounts/hierarchy/batch/delete`,this.state.selectedRowKeys).then((res) => {
      if (res.status === 200) {
        message.success(this.props.intl.formatMessage({ id: "common.operate.success" }))
        this.setState({
          selectedRowKeys:[],
        },this.getAddedSubList());

      }
    }).catch((e) => {
      message.error(this.props.intl.formatMessage({ id: "common.operate.filed" }) + `${e.response.data.message}`);
    })
    this.setState({buttonLoading: false,batchDelete:true});
  }

  //初始化加载
  componentWillMount() {

  }
  //查出所有已添加的子科目
  getAddedSubList() {
    this.setState({ loading: true });
    let url = `${config.baseUrl}/api/accounts/hierarchy/parent/query?parentAccountId=${this.state.searchParams.parentAccountId}&info=${this.state.searchParams.info}&size=${this.state.pageSize}&page=${this.state.page}`;
    return httpFetch.get(url).then((response) => {
      response.data.map((item) => {
        item.key = item.id;
      });
      this.setState({
        tableData: response.data,
        loading: false,
        selectedRowKeys:[],
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
        },
      })
    }).catch((e) => {

    });
  }

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      pagination: temp
    }, ()=>{
      this.getAddedSubList();
    })
  };

  //只要有props的值发生变化，就会调用该方法
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.params.record);
    if (!nextProps.params || nextProps.params == this.props.params) {
      //console.log("=====componentWillReceiveProps return");
      return;
    }
    let searchParamsTmp = {
      parentAccountId: nextProps.params.record.accountId,
      info: ''
    }
    //定义临时对象
    let updateParamsTmp = {
      accountId: nextProps.params.record.accountId,
      accountSetId: nextProps.params.record.accountSetId
    };
    this.setState({
      updateParams: updateParamsTmp,
      searchParams: searchParamsTmp,
      batchDelete:true
    }, () => {
      this.getAddedSubList();
    });
  }


  //控制是否弹出子科目列表
  showListSelector = (flag) => {
    this.setState({
      subjectListSelector: flag
    })
  };

  //点击弹框ok，添加勾选的科目
  handleListOk = (result) => {
    let param = [];
    result.result.map((item) => {
      param.push({ parentAccountId: this.state.updateParams.accountId, subAccountId: item.subAccountId })
    });
    httpFetch.post(`${config.baseUrl}/api/accounts/hierarchy/batch/insert`, param).then((response) => {
      if (response.status === 200) {
        message.success(this.props.intl.formatMessage({ id: "common.operate.success" }))
        this.setState({
          loading: true,
          subjectListSelector: false,
          batchDelete:true
        }, this.getAddedSubList())
      }
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys,batchDelete: selectedRowKeys.length >0 ? false : true  });
  }

  //返回
  onBack = () => {
    this.props.close();
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { columns, updateParams, tableData, loading,batchDelete,selectedRowKeys,subjectSelectorItem, subjectListSelector, pagination } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className="subject-sheet">
        <div className="table-header">
          <div
            className="table-header-title">{formatMessage({ id: "common.total" }, { total: pagination.total ? pagination.total : '0' })}</div>
          <div className="table-header-buttons">
            <Button type="primary"
              onClick={() => this.showListSelector(true)}>{formatMessage({ id: "subject.add.sub.subject" })}</Button> {/* 新建 */}
          <Popconfirm onConfirm={(e) => this.deleteItemBatch(e)} title={formatMessage({ id: "common.confirm.delete" })}>
            <Button disabled={batchDelete} onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>{this.props.intl.formatMessage({id: 'common.delete'})}</Button>
          </Popconfirm>
          </div>
        </div>
        <Table rowKey={record => record.id}
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          onChange={this.onChangePager}
          rowSelection={rowSelection}
          loading={loading}
          bordered
          size="middle"
          style={{margin:'16px 0', textAlign:'right'}}/>

        {/* 子科目弹出框 */}
        <ListSelector
          visible={subjectListSelector}
          onOk={this.handleListOk}
          selectorItem={subjectSelectorItem}
          extraParams={{ parentAccountId: this.state.updateParams.accountId, accountSetId: this.state.updateParams.accountSetId }}
          onCancel={() => this.showListSelector(false)} />
        <div className="slide-footer">
          <Button onClick={this.onBack}>{this.props.intl.formatMessage({ id: "common.back" })}</Button>
        </div>
      </div>
    )
  }
}


const WrappedSubSubjectMaintain = Form.create()(SubSubjectMaintain);

WrappedSubSubjectMaintain.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(injectIntl(WrappedSubSubjectMaintain));
