import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SearchArea from 'components/search-area.js';
import SlideFrame from 'components/slide-frame'
import BasicInfo from 'components/basic-info'
import {
  Form,
  Button,
  Select,
  Row,
  Col,
  Input,
  Switch,
  Popover,
  Icon,
  Badge,
  Tabs,
  Table,
  message,
  Popconfirm
} from 'antd'
import classNames from 'classnames';
import SubjectSheetDetailMaintain from 'containers/setting/subject-sheet/subject-sheet-detail-maintain'
import SubSubjectMaintain from 'containers/setting/subject-sheet/sub-subject-maintain'
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
/**
 * 科目表详情
 */
class SubjectSheetDetail extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      updateState: false,
      pagination: {
        total: 0,
        page: 0,
        pageSize:10,
        current: 1,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      value: '',
      focus: false,
      infoData: {},
      tableData: [],
      params: {},
      updateParams: {},
      subParams: {},//子科目的参数
      showSlideFrameNew: false,// 新增/编辑
      showSlideFrameSub: false,// 子科目
      showSlideFrameFromTo: false,
      showSlideFrameTitle: '',
      accountSetId: '',
      accountTypeOptions: [], //科目类型
      searchParams: {
        info: '',
        accountType: ''
      },
      searchForm: [
        { type: 'input', id: 'accountSetCode', disabled: true, label: this.props.intl.formatMessage({ id: "subject.sheet.code" }) },
        { type: 'input', id: 'accountSetDesc', disabled: true, label: this.props.intl.formatMessage({ id: "subject.sheet.describe" }) },
        {
          type: 'switch', id: 'enabled', label: this.props.intl.formatMessage({ id: "common.column.status" }),
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
              text={enabled ? formatMessage({ id: "common.enabled" }) : formatMessage({ id: "common.disabled" })} />)
        },
      ],
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
          key: 'accountDesc',
          dataIndex: 'accountDesc',
          width: '10%',
          "align": "center",
          render: accountDesc => (
            <Popover content={accountDesc}>
              {accountDesc}
            </Popover>)
        },
        {
          title: formatMessage({ id: "subject.balance.direction" }),
          key: 'balanceDirectionName',
          dataIndex: 'balanceDirectionName',
          width: '10%',
          "align": "center",
        },
        {
          title: formatMessage({ id: "subject.type" }),
          key: 'accountTypeName',
          dataIndex: 'accountTypeName',
          width: '10%',
          "align": "center",
        },
        {
          title: formatMessage({ id: "subject.report.type" }),
          key: 'reportTypeName',
          dataIndex: 'reportTypeName',
          width: '10%',
          "align": "center",
        },
        {
          title: formatMessage({ id: "subject.summary.flag" }),
          key: 'summaryFlag',
          dataIndex: 'summaryFlag',
          width: '10%',
          "align": "center",
          render: summaryFlag => (
            <Badge status={summaryFlag ? 'success' : 'error'}
              text={summaryFlag ? formatMessage({ id: "common.yes" }) : formatMessage({ id: "common.no" })} />
          )
        },
        {
          title: formatMessage({ id: "common.column.status" }),
          key: 'enabled',
          dataIndex: 'enabled',
          width: '6%',
          "align": "center",
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
              text={enabled ? formatMessage({ id: "common.status.enable" }) : formatMessage({ id: "common.status.disable" })} />
          )
        },
        {
          title: "操作", dataIndex: 'operation', width: '10%', key: 'id', dataIndex: "id", key: "id", "align": "center",
          render: (text, record) => {
            if (record.summaryFlag) {
              return (<div>
                <span>
                  <a onClick={(e) => this.editItem(record)}>编辑</a>
                  <span className="ant-divider" />
                  <a style={{ marginRight: 10 }} onClick={(e) => this.subSubjectItem(record.id, this.props.params.accountSetId)}>子科目</a>
                </span>
              </div>)
            } else {
              return (<div>
                <a onClick={(e) => this.editItem(record)}>编辑</a>
              </div>)
            }
          }
        }
      ],
    }
  }

  //初始化加载
  componentWillMount() {
    //根据科目表ID，取科目表信息
    httpFetch.get(`${config.baseUrl}/api/account/set/${this.props.params.accountSetId}`).then(res => {
      this.setState({ infoData: res.data });
    });
    //获取科目明细列表数据
    this.getList();
  };

  //获取 科目类型的值列表
  clickAccountTypeSelect = () => {
    //console.log("clickAccountTypeSelect:" + this.state.accountTypeOptions);
    //如果已经有值，则不再查询
    if (this.state.accountTypeOptions != '' && this.state.accountTypeOptions != undefined) {
      return;
    }
    this.getSystemValueList(2205).then(res => { //科目类型
      let accountTypeOptions = res.data.values || [];
      this.setState({ accountTypeOptions })
    });
  };

  //获取科目明细列表数据
  getList() {
    this.setState({ loading: true });
    let url = `${config.baseUrl}/api/accounts/query?accountSetId=${this.props.params.accountSetId}&info=${this.state.searchParams.info}&accountType=${this.state.searchParams.accountType}&size=${this.state.pagination.pageSize}&page=${this.state.pagination.page}`;
    return httpFetch.get(url).then((response) => {
      response.data.map((item,index) => {
        item.index = this.state.pagination.page * this.state.pagination.pageSize + index + 1;
        item.key = item.id;
      });
      this.setState({
        tableData: response.data,
        loading: false,
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
      this.getList();
    })
  };

  //点击搜索
  searchAccountDetailList = (values) => {
    if (values === undefined) {
      values = '';
    }
    let searchParams = {
      ...this.state.searchParams,
      info: values
    };
    this.setState({
      searchParams: searchParams,
      loading: true
    }, () => {
      this.getList();
    })
  };

  //表格上的子科目
  subSubjectItem = (recordId, accountSetId) => {
    this.setState({
      showSlideFrameSub: true,
      subParams: { record: { accountId: recordId, accountSetId: accountSetId } },
    })
  };

  //表格上的编辑
  editItem = (record) => {
    this.showSlideNew(true, record, this.state.accountTypeOptions, false)
  };
  //点击新建
  handleCreate = () => {
    let record = { accountSetId: this.props.params.accountSetId };
    this.showSlideNew(true, record, this.state.accountTypeOptions, true);
  }
  //设置侧拉
  showSlideNew = (flag, record, accountTypeOptions, isNew) => {
    this.setState({
      showSlideFrameNew: flag,
      updateParams: { record: record, accountTypeOptions, isNew },
      showSlideFrameTitle: isNew ? "新建科目" : "编辑科目"
    })
  };

  //侧拉关闭
  afterClose = (props) => {
    // 侧拉框的保存 this.props.close(true);//会调用
    if (props) {
      //刷新
      this.setState({ showSlideFrameNew: false, showSlideFrameSub: false }, () => {
        this.getList()
      });
    } else {
      //取消 不刷新
      this.setState({ showSlideFrameNew: false, showSlideFrameSub: false });
    }
  }
  //头编辑时点保存
  headerUpdateHandle = (values) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let toValue = {
      ...this.props.params,
      ...values,//如果与this.props.params有冲突，则以values里的值为准
      id: this.props.params.accountSetId
    }
    httpFetch.put(`${config.baseUrl}/api/account/set`, toValue).then((res) => {
      this.setState({
        infoData: res.data,
        loading: false,
        updateState: true
      }, () => {
        message.success("编辑成功");
      });
    }).catch((e) => {
      this.setState({ loading: false });
      message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
    })
  };

  // 查询条件 科目类型发生改变时，给state里赋值
  accountTypeChange = (values) => {
    //当为all时，表示查询时不受该字段限制
    if (values === "all") {
      values = "";
    }
    let searchParams = {
      accountType: values,
    };
    this.setState({
      searchParams: searchParams,
    });
  }

  render() {
    const { loading, infoData, searchForm, accountTypeOptions, showSlideFrameNew, showSlideFrameSub, showSlideFrameFromTo, subParams, tableData, updateState, pagination, columns, updateParams } = this.state;
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });
    return (
      <div className="budget-journal">
        <BasicInfo infoList={searchForm} ref="subject_ref" infoData={infoData} loading={loading}
          updateState={updateState}
          updateHandle={this.headerUpdateHandle} />

        <div className="table-header">
          <div className="table-header-title"><h2>科目明细</h2></div>
          <div className="table-header-buttons">
            <Row>
              <Col span="17"><Button type="primary"
                onClick={this.handleCreate}>{this.props.intl.formatMessage({ id: 'common.create' })}</Button></Col>
              <Col span="3">
                <Select defaultValue="all" style={{ width: 136 }} onChange={this.accountTypeChange} onFocus={this.clickAccountTypeSelect}>
                  <Option key='all'>{this.props.intl.formatMessage({ id: 'common.all' })}</Option>
                  {accountTypeOptions.map(option => {
                    return <Option key={option.value}>{option.messageKey}</Option>
                  })}
                </Select>
              </Col>
              <Col span="4">
                <Search
                  placeholder={this.props.intl.formatMessage({ id: 'subject.search.code.name' })}
                  onSearch={this.searchAccountDetailList}
                  enterButton={this.props.intl.formatMessage({ id: 'common.search' })}
                />
              </Col>
            </Row>
          </div>
          <Table rowKey={record => record.id}
            columns={columns}
            dataSource={tableData}
            pagination={pagination}
            loading={loading}
            onChange={this.onChangePager}
            bordered
            /*onRowClick={this.editItem}*/
            size="middle" />
          {/* 科目明细 */}
          <SlideFrame title={this.state.showSlideFrameTitle}
            show={showSlideFrameNew}
            content={SubjectSheetDetailMaintain}
            afterClose={this.afterClose}// 取消和确定的时候执行
            onClose={() => { this.setState({ showSlideFrameNew: false }) }}// 点击 侧拉之外的地方时触发
            params={updateParams} />
          {/* 子科目 */}
          <SlideFrame title={this.props.intl.formatMessage({ id: 'subject.sub.subject' })}
            show={showSlideFrameSub}
            content={SubSubjectMaintain}
            afterClose={this.afterClose}// 取消和确定的时候执行
            onClose={() => { this.setState({ showSlideFrameSub: false, showSlideFrameFromTo: false }) }}// 点击 侧拉之外的地方时触发
            params={subParams} />
        </div>
      </div>
    );
  }
}

SubjectSheetDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SubjectSheetDetail));
