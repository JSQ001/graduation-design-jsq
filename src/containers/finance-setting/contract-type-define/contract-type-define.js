import React from "react";
import { injectIntl } from 'react-intl';
import { Form, Button, Table, Badge } from 'antd'
import config from 'config'
import menuRoute from 'share/menuRoute'
import httpFetch from 'share/httpFetch'

import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'
import NewContractType from 'containers/finance-setting/contract-type-define/new-contract-type'

class ContractTypeDefine extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchForm: [
        {type: 'select', id: 'setOfBooksId', label: '账套', options: [], defaultValue: '', isRequired: true,
          getUrl: `${config.baseUrl}/api/setOfBooks/query/dto`, method: 'get', labelKey: 'setOfBooksCode', valueKey: 'setOfBooksId'},
        {type: 'input', id: 'contractTypeCode', label: '合同类型代码'},
        {type: 'input', id: 'contractTypeName', label: '合同类型名称'}
      ],
      searchParams: {
        setOfBooksId: '',
        contractTypeCode: '',
        contractTypeName: ''
      },
      columns : [
        {title: '合同类型代码', dataIndex: 'contractTypeCode'},
        {title: '合同类型名称', dataIndex: 'contractTypeName'},
        {title: '合同大类', dataIndex: 'contractCategoryName'},
        {title: '账套', dataIndex: 'setOfBooksId'},
        {title: '状态', dataIndex: 'isEnabled',
          render: status => <Badge status={status ? 'success' : 'error'} text={status ? '启用' : '禁用'} />},
        {title: '操作', dataIndex: 'id', render: (id, record) => (
          <span>
            <a onClick={() => this.handleEdit(record)}>编辑</a>
            <span className="ant-divider"/>
            <a onClick={this.handleDistribute}>公司分配</a>
          </span>
        )}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      showSlideFrame: false,
      editContractType: {},
      companyDistribution:  menuRoute.getRouteItem('company-distribution','key'),    //公司分配
    }
  }

  componentWillMount() {
    let url = `${config.baseUrl}/api/setOfBooks/query/dto`;
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        let searchForm = this.state.searchForm;
        let searchParams = this.state.searchParams;
        searchForm[0].defaultValue = res.data[0].setOfBooksId;
        searchForm[0].options = [{
          temp: true,
          label: res.data[0].setOfBooksCode,
          value: res.data[0].setOfBooksId
        }];
        searchParams.setOfBooksId = res.data[0].setOfBooksId;
        this.setState({ searchForm, searchParams }, () => {
          this.getList()
        })
      }
    })
  }

  getList = () => {
    const { searchParams, page, pageSize } = this.state;
    let url = `${config.contractUrl}/contract/api/contract/type/${searchParams.setOfBooksId}/query?page=${page}&size=${pageSize}`;
    for(let searchKey in searchParams) {
      searchKey !== 'setOfBooksId' && (url += searchParams[searchKey] ? `&${searchKey}=${searchParams[searchKey]}` : '')
    }
    this.setState({ loading: true });
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          data: res.data,
          pagination: {
            total: Number(res.headers['x-total-count']) ? Number(res.headers['x-total-count']) : 0,
            current: page + 1,
            onChange: this.onChangePaper
          }
        })
      }
    })
  };

  onChangePaper = (page) => {
    if (page - 1 !== this.state.page) {
      this.setState({ page: page - 1 },() => {
        this.getList()
      })
    }
  };

  onSearch = (result) => {
    if (!result.setOfBooksId) return;
    this.setState({
      page: 0,
      searchParams: {
        setOfBooksId: result.setOfBooksId,
        contractTypeCode: result.contractTypeCode,
        contractTypeName: result.contractTypeName
      },
    },() => {
      this.getList()
    })
  };

  onClear = () => {

  };

  showSlide = (flag) => {
    this.setState({ showSlideFrame: flag })
  };

  //关闭侧滑后的回调
  handleCloseSlide = (params) => {
    if(params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  //新建合同类型
  handleNew = () => {
    this.setState({
      editContractType: {},
      showSlideFrame: true
    });
  };

  //编辑合同类型
  handleEdit = (record) => {
    this.setState({ editContractType: record }, () => {
      this.showSlide(true)
    })
  };

  //分配公司
  handleDistribute = () => {
    this.context.router.push(this.state.companyDistribution.url);
  };

  render() {
    const { loading, searchForm, columns, data, pagination, showSlideFrame, editContractType } = this.state;
    return (
      <div className="contract-type-define">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.onSearch}
                    clearHandle={this.onClear}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
        </div>
        <Table rowKey={record => record.id}
               columns={columns}
               dataSource={data}
               loading={loading}
               bordered
               size="middle"/>
        <SlideFrame title={editContractType.id ? "编辑合同类型" :  "新建合同类型"}
                    show={showSlideFrame}
                    content={NewContractType}
                    onClose={() => this.showSlide(false)}
                    afterClose={this.handleCloseSlide}
                    params={editContractType}/>
      </div>
    )
  }
}

ContractTypeDefine.contextTypes = {
  router: React.PropTypes.object
};

const wrappedContractTypeDefine = Form.create()(injectIntl(ContractTypeDefine));

export default wrappedContractTypeDefine;
