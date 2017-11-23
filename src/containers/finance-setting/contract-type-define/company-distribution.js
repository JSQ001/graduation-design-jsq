import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Row, Col, Badge, Button, Table, Checkbox, message } from 'antd'

import ListSelector from 'components/list-selector'

class CompanyDistribution extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      companyTypeList: [
        {label: '账套', id: 'setOfBooksCode'},
        {label: '合同类型代码', id: 'contractTypeCode'},
        {label: '合同类型名称', id: 'contractTypeName'},
        {label: '合同类型状态', id: 'isEnabled'}
      ],
      companyTypeInfo: {},
      columns: [
        {title: '公司代码', dataIndex: 'companyCode'},
        {title: '公司名称', dataIndex: 'companyName'},
        {title: '公司类型', dataIndex: 'companyTypeName', render: type => <span>{type ? type : '-'}</span>},
        {title: '账套', dataIndex: 'setOfBooksCode'},
        {title: '启用', dataIndex: 'isEnabled', width: '8%', render: isEnabled => <Checkbox defaultChecked={isEnabled} onChange={this.handleStatusChange}/>}
      ],
      data: [],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      showListSelector: false,
      selectorItem: {},
    }
  }

  componentWillMount() {
    this.getBasicInfo();
    this.getList();
  }

  getBasicInfo = () => {
    const { params } = this.props;
    let url = `${config.contractUrl}/contract/api/contract/type/${params.setOfBooksId}/${params.id}`;
    httpFetch.get(url).then((res) => {
      let selectorItem = {
        title: "批量分配公司",
        url: `${config.contractUrl}/contract/api/contract/type/${params.setOfBooksId}/companies/query/filter`,
        searchForm: [
          {type: 'input', id: 'setOfBooksCode', label: '账套', defaultValue: res.data.setOfBooksCode, disabled: true},
          {type: 'input', id: 'companyName', label: '公司代码/名称'},
          {type: 'input', id: 'companyCodeFrom', label: '公司代码从'},
          {type: 'input', id: 'companyCodeTo', label: '公司代码至'},
        ],
        columns: [
          {title: '公司代码', dataIndex: 'companyCode'},
          {title: '公司名称', dataIndex: 'name'},
          {title: '公司类型', dataIndex: 'companyType'},
          {title: '账套', dataIndex: 'setOfBooksCode', render: () => <span>{res.data.setOfBooksCode}</span>}
        ],
        key: 'id'
      };
      this.setState({ companyTypeInfo: res.data, selectorItem })
    })
  };

  getList = () => {
    const { params } = this.props;
    const { page, pageSize } = this.state;
    this.setState({ loading: true });
    let url = `${config.contractUrl}/contract/api/contract/type/${params.setOfBooksId}/companies/query?page=${page}&size=${pageSize}&contractTypeId=${params.id}`;
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({ data: res.data, loading: false })
      }
    })
  };

  handleStatusChange = (e) => {
    console.log(e.target.checked)
  };

  handleListShow = (flag) => {
    this.setState({ showListSelector: flag })
  };

  handleListOk = (values) => {
    console.log(values);
    const { params } = this.props;
    let paramsValue = [];
    let url = `${config.contractUrl}/contract/api/contract/type/${params.setOfBooksId}/toCompany`;
    httpFetch.post(url, paramsValue).then((res) => {
      if (res.status === 200) {
        message.success('操作成功');
        this.handleListShow(false);
        this.getList()
      }
    }).catch((e) => {
      if (e.response) {
        message.error(`操作失败，${e.response.data.message}`)
      }
    })
  };

  render() {
    const { loading, companyTypeList, companyTypeInfo, pagination, columns, data, showListSelector, selectorItem } = this.state;
    let periodRow = [];
    let periodCol = [];
    companyTypeList.map((item, index) => {
      index <= 2 && periodCol.push(
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.label}</div>
          <div style={{wordWrap:'break-word'}}>{companyTypeInfo[item.id]}</div>
        </Col>
      );
      if (index === 2) {
        periodRow.push(
          <Row style={{background:'#f7f7f7',padding:'20px 25px 0',borderRadius:'6px'}} key="1">
            {periodCol}
          </Row>
        );
      }
      if (index === 3) {
        periodRow.push(
          <Row style={{background:'#f7f7f7',padding:'0 25px 5px',borderRadius:'6px'}} key="2">
            <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
              <div style={{color: '#989898'}}>{item.label}</div>
              <Badge status={companyTypeInfo[item.id] ? 'success' : 'error'}
                     text={companyTypeInfo[item.id] ? '启用' : '禁用'} /></Col>
          </Row>
        );
      }
    });
    return (
      <div className="company-distribution">
        {periodRow}
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={() => this.handleListShow(true)}>批量分配公司</Button>
          </div>
        </div>
        <Table rowKey={record => record.companyId}
               columns={columns}
               dataSource={data}
               loading={loading}
               bordered
               size="middle"/>
        <ListSelector visible={showListSelector}
                      onCancel={() => this.handleListShow(false)}
                      selectorItem={selectorItem}
                      extraParams={{contractTypeId: this.props.params.id}}
                      onOk={this.handleListOk}/>
      </div>
    )
  }
}

const wrappedCompanyDistribution = Form.create()(injectIntl(CompanyDistribution));

export default wrappedCompanyDistribution;
