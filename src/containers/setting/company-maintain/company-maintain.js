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
import SlideFrame from 'components/slide-frame'

import EditCompanyMaintain from './edit-company-maintain';
import NewCompanyMaintain from './new-company-maintain';

import "styles/setting/company-maintain/company-maintain.scss"


const journalTypeCode = [];

class CompanyMaintain extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      params: {},
      organization: {},
      showSlideFrame:false,
      updateParams: {},
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
          key: "companyTypeName",
          dataIndex: 'companyTypeName'
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
          },
        },
        {
          title: "操作", dataIndex: 'operation', width: '10%', dataIndex: "id", key: "id",
          render: (text, record) => (
            <span>
              <a  style={{ marginRight: 10 }} onClick={(e) => this.handleRowClick(e, record)}>详情</a>
              <a  onClick={(e) => this.editItem(e, record)}>编辑</a>
            </span>)
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

    this.setState({
      params: values,
    }, () => {
      this.getList()
    })
  };

  //侧拉关闭后
  handleCloseNewSlide = (params) => {
    if (params) {
      this.getList();
    }
    this.setState({
      showSlideFrame: false
    })
  };

  //新建
  handleCreate = () => {
    let path = this.state.newCompanyMaintainPage.url;
    this.context.router.push(path)
  };

  //跳转到详情
  handleRowClick = (e,value) => {
    let path = this.state.companyMaintainDetailPage.url.replace(":companyOId", value.companyOID);
    path = path.replace(":companyId", value.id);
    this.context.router.push(path);
  }

  //弹出侧拉框
  editItem = (e,record) => {

    this.setState({
      updateParams: record,
      showSlideFrame: true
    })
  };

  render() {
    const { loading, searchForm, data, selectedRowKeys, pagination, columns, batchCompany, showSlideFrame, updateParams } = this.state;
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
          onChange={this.onChangePager}
        />
        <SlideFrame title="编辑公司信息"
          show={showSlideFrame}
          content={EditCompanyMaintain}
          afterClose={this.handleCloseNewSlide}
          onClose={() => this.setState({ showSlideFrame: false })}
          params={updateParams} />
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
