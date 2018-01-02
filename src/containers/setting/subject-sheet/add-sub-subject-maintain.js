/**
 * Created by dicky on 2017/12/27.
 */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Popconfirm, Table, Badge, Button, Popover, Form, Switch, Input, message, Icon, Select, Radio } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
import SearchArea from 'components/search-area.js';
import config from 'config';
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import 'styles/pay-setting/payment-method/new-payment-method.scss'
import ListSelector from 'components/list-selector'

//添加子科目
class AddSubSubjectMaintain extends React.Component {
  constructor(props) {
    super(props);

    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      params: {},
      page: 0,
      pageSize: 10,
      visible: false,
      pagination: {
        total: 0
      },
      deptListSelector: false,  //控制部门选则弹框
      selectedRowKeys: [],//行选中的数据ID
      searchForm: [
        {
          type: 'items', colSpan: 24, id: 'name', items: [
            { type: 'input', id: 'accountCode', label: formatMessage({ id: "subject.code" }) },
            { type: 'input', id: 'accountName', label: formatMessage({ id: "subject.name" }) }
          ]
        },
        //科目表代码
        {
          type: 'items', colSpan: 24, id: 'code', items: [
            { type: 'input', id: 'codeFrom', width: 200, label: formatMessage({ id: "subject.code.from" }) },
            { type: 'input', id: 'codeTo', width: 200, label: formatMessage({ id: "subject.code.to" }) }
          ]
        }
      ],
      
      searchParams: {
        accountId: '', // 科目ID
        accountSetId: '',//科目表ID
        accountCode: '',
        accountName: '',
        codeFrom: '',
        codeTo: ''
      },
      tableData: [],
      columns: [
        {
          title: formatMessage({ id: "subject.code" }),
          key: 'accountCode',
          dataIndex: 'accountCode',
          width: '10%',
          "align": "center",
        },
        {
          title: formatMessage({ id: "subject.name" }),
          key: 'accountName',
          dataIndex: 'accountName',
          width: '10%',
          "align": "center",
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
          "align": "center",
        },
        {
          title: "操作", dataIndex: 'operation', width: '10%', key: 'id', dataIndex: "id", key: "id", "align": "center",
          render: (text, record) => {
            return (<div>
              <a onClick={(e) => this.deleteItem(record)}>删除</a>
            </div>)
          }
        }
      ],
    };
  }

  //初始化加载
  componentWillMount() {

  }

  //控制是否弹出部门列表
  showListSelector = (flag) =>{
    this.setState({
      deptListSelector: flag
    })
  };
  //只要有props的值发生变化，就会调用该方法
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.params);
    console.log("=====componentWillReceiveProps add====");
    if (!nextProps.params || nextProps.params == this.props.params) {
      console.log("=====componentWillReceiveProps return");
      return;
    }
    this.clear();
    //定义临时对象
    let searchParamsTmp = {
      accountId: nextProps.params.accountId,
      accountSetId: nextProps.params.accountSetId
    };
    this.setState({
      searchParams: searchParamsTmp
    },()=>{
      this.search(this.state.searchParams);
    });
  }

  search = (values) => {
    this.setState({
      page: 0,
      searchParams: {
        ...this.state.searchParams,
        accountCode: values.accountCode ? values.accountCode : '',
        accountName: values.accountName ? values.accountName : '',
        codeFrom: values.codeFrom ? values.codeFrom : '',
        codeTo: values.codeTo ? values.codeTo : ''
      }
    }, () => {
      //设置完参数后， 执行查询
      this.getUnAddSubList();
    })
  };



  //未添加到该科目下的子科目
  getUnAddSubList() {
    this.setState({ loading: true });
    let url = `${config.baseUrl}/api/accounts/hierarchy/child/query?accountSetId=${this.state.searchParams.accountSetId}&parentAccountId=${this.state.searchParams.accountId}&accountCode=${this.state.searchParams.accountCode}&accountName=${this.state.searchParams.accountName}&codeFrom=${this.state.searchParams.codeFrom}&codeTo=${this.state.searchParams.codeTo}&size=${this.state.pageSize}&page=${this.state.page}`;
    return httpFetch.get(url).then((response) => {
      response.data.map((item) => {
        item.key = item.id;
      });
      this.setState({
        tableData: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
        },
        page: 0 //默认转到第1页
      })
    }).catch((e) => {

    });
  }

  //分页点击
  onChangePager = (page) => {
    console.log("onChangePager:" + this.state.page);
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, () => {
        this.getUnAddSubList();
      })
  };

  //重置查询条件
  clear = () => {
    this.setState({
      searchParams: {
        accountCode: '',
        accountName: '',
        codeFrom: '',
        codeTo: ''
      }
    })
  };

  searchEventHandle = (event, value) => {
    console.log(event, value)
  };

  // 添加子科目
  addSubSubjectSave = (visible) => {
    console.log(visible);
    if (this.state.selectedRowKeys.length < 1){
      message.info(this.props.intl.formatMessage({ id: 'common.select.at.least.one.line' }));  //操作成功
      return;
    }
    let addData = [];
    this.state.selectedRowKeys.map((selected) => {
      let data = {};
      data.subAccountId = selected;
      data.parentAccountId = this.state.searchParams.accountId;
      addData.push(data);
    });
    if (!visible) {
      this.setState({ visible });
    }
    this.setState({
      selectedRowKeys:addData
    },()=>{
      this.confirmSave(); // show the popconfirm
    });
  }
  //执行确认保存
  confirmSave = () => {
    httpFetch.post(`${config.baseUrl}/api/accounts/hierarchy/batch/insert`, this.state.selectedRowKeys).then((res) => {
      this.setState({ loading: false,visible: false });
      if (res.status === 200) {
        message.success(this.props.intl.formatMessage({ id: 'common.operate.success' }));  //操作成功
        this.props.form.resetFields();
        this.props.close(true);//会调用
      }
    }).catch((e) => {
      this.setState({ loading: false,visible: false });
      message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
    })
  }
  //确认的取消
  cancel = () => {
    console.log("cancel");
    this.setState({ visible: false });
  }

  //删除
  deleteItem = (values) => {
    console.log(values);
  };
  //取消按钮
  onCancel = () => {
    //this.props.form.resetFields();
    this.props.close();
  };


  render() {
    const { formatMessage } = this.props.intl;
    const { columns, tableData, searchForm, loading, pagination, showSlideFrameSub } = this.state;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(selectedRows);//打印行数据
        this.setState({ selectedRowKeys: selectedRowKeys });
      },
      /* getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User'
      }) */
    };
    return (
      <div className="budget-organization">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          maxLength={1}
          eventHandle={this.searchEventHandle} />
        <Table rowKey={record => record.subAccountId}
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          loading={loading}
          rowSelection={rowSelection}
          bordered
          size="middle" />
        <div className="slide-footer">
          <Popconfirm onConfirm={(e) => this.addSubSubjectSave(e)} title={formatMessage({id:"common.confirm.add"})}>{/* 你确定要删除organizationName吗 */}
            <Button type="primary" onClick={(e) => {e.preventDefault();e.stopPropagation();}}
              loading={this.state.loading}>{this.props.intl.formatMessage({ id: "common.add" })}</Button>
          </Popconfirm>
          <Button onClick={this.onCancel}>{this.props.intl.formatMessage({ id: "common.cancel" })}</Button>
        </div>
      </div>
    )
  }
}


const WrappedAddSubSubjectMaintain = Form.create()(AddSubSubjectMaintain);

WrappedAddSubSubjectMaintain.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(injectIntl(WrappedAddSubSubjectMaintain));
