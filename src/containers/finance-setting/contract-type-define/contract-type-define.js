import React from "react";
import { injectIntl } from 'react-intl';
import { Form, Button, Table } from 'antd'
import config from 'config'
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
        {title: '合同大类', dataIndex: 'contractCategory'},
        {title: '账套', dataIndex: 'setOfBooksId'},
        {title: '状态', dataIndex: 'isEnabled'},
        {title: '操作', dataIndex: 'id'}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      showSlideFrame: false,
      editContractType: {},
    }
  }

  componentWillMount() {
    let url = `${config.baseUrl}/api/setOfBooks/query/dto`;
    httpFetch.get(url).then((res) => {
      if (res.status === 200) {
        let searchForm = this.state.searchForm;
        let searchParams = this.state.searchParams;
        // searchForm[0].defaultValue = res.data[0].setOfBooksCode;
        searchForm[0].defaultValue = res.data[0].setOfBooksId;
        searchParams.setOfBooksId = res.data[0].setOfBooksId;
        this.setState({ searchForm, searchParams }, () => {
          this.getList()
        })
      }
    })
  }

  getList = () => {
    const { searchParams, page, pageSize } = this.state;
    let url = `${config.baseUrl}/api/contract/type/${searchParams.setOfBooksId}/query?page=${page}&size=${pageSize}`;
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

  showSlide = (flag) => {
    this.setState({ showSlideFrame: flag })
  };

  handleNew = () => {
    this.setState({
      editContractType: {},
      showSlideFrame: true
    });
  };

  render() {
    const { loading, searchForm, columns, data, pagination, showSlideFrame, editContractType } = this.state;
    return (
      <div className="contract-type-define">
        <SearchArea searchForm={searchForm}
                    submitHandle={this.onSearch}/>
        <div className="table-header">
          <div className="table-header-title">{`共搜索到 ${pagination.total} 条数据`}</div>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleNew}>新 建</Button>
          </div>
        </div>
        <Table columns={columns}
               dataScource={data}
               loading={loading}
               bordered
               size="middle"/>
        <SlideFrame title={editContractType.setOfBooksId ? "编辑合同类型" :  "新建合同类型"}
                    show={showSlideFrame}
                    content={NewContractType}
                    onClose={() => this.showSlide(false)}/>
      </div>
    )
  }
}

const wrappedContractTypeDefine = Form.create()(injectIntl(ContractTypeDefine));

export default wrappedContractTypeDefine;
