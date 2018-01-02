import React from "react";
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux'
import { Button, Table, Badge } from 'antd'
import config from 'config'
import menuRoute from 'share/menuRoute'
import { contractService } from 'service'

import SearchArea from 'components/search-area'

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
        {title: '账套', dataIndex: 'setOfBooksCode'},
        {title: '状态', dataIndex: 'isEnabled',
          render: status => <Badge status={status ? 'success' : 'error'} text={status ? '启用' : '禁用'} />},
        {title: '操作', dataIndex: 'id', render: (id, record) => (
          <span>
            <a onClick={() => this.handleEdit(record)}>编辑</a>
            <span className="ant-divider"/>
            <a onClick={() => this.handleDistribute(record)}>公司分配</a>
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
      companyDistribution:  menuRoute.getRouteItem('company-distribution','key'),    //公司分配
      newContractType:  menuRoute.getRouteItem('new-contract-type','key'),    //新建公司类型
      editContractType:  menuRoute.getRouteItem('edit-contract-type','key'),    //编辑公司类型
    }
  }

  componentWillMount() {
    const { company } = this.props;
    let searchForm = this.state.searchForm;
    let searchParams = this.state.searchParams;
    searchForm[0].defaultValue = company.setOfBooksId;
    searchForm[0].options = [{
      temp: true,
      label: company.setOfBooksName,
      value: company.setOfBooksId
    }];
    searchParams.setOfBooksId = company.setOfBooksId;
    this.setState({ searchForm, searchParams }, () => {
      this.getList()
    })
  }

  getList = () => {
    const { page, pageSize, searchParams } = this.state;
    this.setState({ loading: true });
    contractService.getContractTypeDefineList(page, pageSize, searchParams.setOfBooksId, searchParams).then((res) => {
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

  //关闭侧滑后的回调
  handleCloseSlide = (params) => {
    this.setState({
      showSlideFrame: false
    },() => {
      params && this.getList()
    })
  };

  //新建合同类型
  handleNew = () => {
    this.context.router.push(this.state.newContractType.url)
  };

  //编辑合同类型
  handleEdit = (record) => {
    this.context.router.push(this.state.editContractType.url.replace(':setOfBooksId', record.setOfBooksId).replace(':id', record.id))
  };

  //分配公司
  handleDistribute = (record) => {
    this.context.router.push(this.state.companyDistribution.url.replace(':setOfBooksId', record.setOfBooksId).replace(':id', record.id))
  };

  render() {
    const { loading, searchForm, columns, data, pagination } = this.state;
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
               pagination={pagination}
               bordered
               size="middle"/>
      </div>
    )
  }
}

ContractTypeDefine.contextTypes = {
  router: React.PropTypes.object
};
function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(ContractTypeDefine));
