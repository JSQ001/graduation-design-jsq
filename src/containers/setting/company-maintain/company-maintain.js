/**
 * Created by 13576 on 2017/11/1.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button, Table, Select, Tag} from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import SearchArea from 'components/search-area.js';

import "styles/setting/company-maintain/company-maintain.scss"


const journalTypeCode = [];

class CompanyMaintain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      params: {},
      organization: {},
      pagination: {
        current: 0,
        page: 0,
        total: 0,
        pageSize: 10,

      },
      showUpdateSlideFrame: false,
      showCreateSlideFrame: false,
      searchForm: [
        {
          type: 'input', id: 'name',
          label: this.props.intl.formatMessage({id: 'company.name'}), /*公司名称*/
        },
        {
          type: 'input', id: 'companyCode',
          label: this.props.intl.formatMessage({id: 'company.companyCode'}), /*预算日记账编号*/
        }
      ],

      columns: [
        {
          /*公司代码*/
          title: this.props.intl.formatMessage({id: "company.companyCode"}),
          key: "companyCode",
          dataIndex: 'companyCode'
        },
        {
          /*公司类型*/
          title: this.props.intl.formatMessage({id: "company.companyType"}),
          key: "companyType",
          dataIndex: 'companyType'
        },
        {
          /*公司名称*/
          title: this.props.intl.formatMessage({id: "company.name"}), key: "name", dataIndex: 'name',
        },
        {
          /*账套*/
          title: this.props.intl.formatMessage({id: "company.setOfBooksName"}),
          key: "setOfBooksName",
          dataIndex: 'setOfBooksName'
        },
        {
          /*法人*/
          title: this.props.intl.formatMessage({id: "company.legalEntityName"}),
          key: "legalEntityName",
          dataIndex: 'legalEntityName',

        },
        {
          /*公司级别*/
          title: this.props.intl.formatMessage({id: "company.companyLevelName"}),
          key: "companyLevelName",
          dataIndex: 'companyLevelName',
        },
        {
          /*上级机构*/
          title: this.props.intl.formatMessage({id: "company.parentCompanyName"}),
          key: "parentCompanyName",
          dataIndex: 'parentCompanyName',
        },
        {
          /*有效日期从*/
          title: this.props.intl.formatMessage({id: "company.startDateActive"}),
          key: "startDateActive",
          dataIndex: 'startDateActive',
          render(recode){
            return String(recode).substr(0,10);
          }
        },
        {
          /*有效日期至*/
          title: this.props.intl.formatMessage({id: "company.endDateActive"}),
          key: "endDateActive",
          dataIndex: 'endDateActive',
          render(recode){
            return String(recode).substr(0,10);
          }
        }
      ],
      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newCompanyMaintainPage: menuRoute.getRouteItem('new-company-maintain', 'key'),         //公司新建
      companyMaintainDetailPage: menuRoute.getRouteItem('company-maintain-detail', 'key'),  //公司详情

    };
  }

  componentWillMount() {
    this.getList();
  }




  //获取公司列表
  getList() {
    this.setState({
      loading: true,
    })
    const params = this.state.params;

    httpFetch.get(`${config.baseUrl}/api/company/by/term?name=${params.name ? params.name : ''}&companyCode=${params.companyCode ? params.companyCode : ''}`).then((response) => {
      this.setState({
        loading: false,
        data: response.data,
        pagination: {
          page: this.state.pagination.page,
          current: this.state.pagination.current,
          pageSize: this.state.pagination.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          total: Number(response.headers['x-total-count']),
        }
      }, () => {

      })
    })
  }

  //分页点击
  onChangePager = (pagination, filters, sorter) => {
    this.setState({
      pagination: {
        page: pagination.current - 1,
        current: pagination.current,
        pageSize: pagination.pageSize
      }
    }, () => {
      this.getList();
    })
  };

  //点击搜搜索
  handleSearch = (values) => {
    console.log(values);

    this.setState({
      params: values,
    }, () => {
      this.getList()
    })
  };

  //新建
  handleCreate = () => {
    let path = this.state.newCompanyMaintainPage.url;
    this.context.router.push(path)
  };

  //跳转到详情
  HandleRowClick = (value) => {
    console.log(value);
    let path = this.state.companyMaintainDetailPage.url.replace(":companyOId", value.companyOID);
    this.context.router.push(path);
  }

  render() {
    const {loading, searchForm, data, selectedRowKeys, pagination, columns, batchCompany} = this.state;
    const organization = this.props.organization;
    return (
      <div className="budget-journal">
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div
            className="table-header-title">{this.props.intl.formatMessage({id: 'common.total'}, {total: `${pagination.total}`})}</div>
          {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary"
                    onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button> {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered
          onRowClick={this.HandleRowClick}
          onChange={this.onChangePager}
        />
      </div>
    )
  }

}

CompanyMaintain.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.login.organization
  }
}

export default connect(mapStateToProps)(injectIntl(CompanyMaintain));
