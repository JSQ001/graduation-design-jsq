/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'routes/menuRoute'
import {Button, Table, Badge, Popconfirm, Form, message, DatePicker, Col, Row, Switch, notification, Icon} from 'antd'
import SearchArea from 'components/search-area'
import NewBudgetVersion from 'containers/budget-setting/budget-organization/budget-versions/new-budget-versions'
import SlideFrame from 'components/slide-frame'

import 'styles/budget-setting/budget-organization/budget-versions/budget-versions.scss'
const FormItem = Form.Item;

class BudgetVersions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      slideFrame:{
        visible: false
      },
      columns: [
        {
          title: this.props.intl.formatMessage({id: "budgetVersion.versionCode"}),
          dataIndex: 'versionCode',
          key: 'versionCode',
        },
        {
          title: this.props.intl.formatMessage({id: "budgetVersion.versionName"}),
          dataIndex: 'versionName',
          key: 'versionName',
        },
        {
          title: this.props.intl.formatMessage({id: "budgetVersion.versionDate"}),
          dataIndex: 'versionDate',
          key: 'versionDate',
        },
        {
          title: this.props.intl.formatMessage({id: "budgetVersion.versionDescription"}),
          dataIndex: 'description',
          key: 'description',
          render: (recode) => {
            return <span>{recode ? recode : '-'}</span>
          }
        },
        {
          title: this.props.intl.formatMessage({id: "budgetVersion.versionStatus"}),
          dataIndex: 'status',
          key: 'status',
          render: (recode) => {
            return <div>{recode.label}</div>
          }
        },
        {
          title: this.props.intl.formatMessage({id: "budgetVersion.isEnabled"}), dataIndex: 'isEnabled', key: 'isEnabled',
          render: (recode, text) => {
            return (
              <div >
                <Badge status={ recode ? "success" : "error"}/>
                {recode ? this.props.intl.formatMessage({id: "common.status.enable"}) : this.props.intl.formatMessage({id: "common.status.disable"})}
              </div>
            );
          }
        },

      ],
      form: {
        name: '',
        enabled: true
      },
      searchForm: [
        {type: 'input', id: 'versionCode', label: this.props.intl.formatMessage({id: "budgetVersion.versionCode"})},
        {type: 'input', id: 'versionName', label: this.props.intl.formatMessage({id: "budgetVersion.versionName"})},
      ],
      pageSize: 10,
      page: 0,
      pagination: {
        total: 0
      },
      searchParams: {
        versionCode: '',
        versionName: '',
      },
      redirect: true,
      loading: true,
      newData: {versionCode: ''},
      newBudgetVersionsPage: menuRoute.getRouteItem('new-budget-versions', 'key'),
      budgetVersionsDetailDetailPage: menuRoute.getRouteItem('budget-versions-detail', 'key'),    //预算版本详情的页面项

    };

  }


  //显示新建
  showSlide = (flag) => {
    let slideFrame = this.state.slideFrame;
    slideFrame.visible = flag;
    slideFrame.params = {};
    this.setState({slideFrame})
  };

  handleCloseSlide = (params) => {
    if(params) {
      this.setState({loading: true});
      this.getList();
    }
   this.showSlide(false)
  };

  //一开始就显示数据
  componentWillMount() {
    this.getList();
  }

  //获得数据
  getList() {
    httpFetch.get(`${config.budgetUrl}/api/budget/versions/query?organizationId=${this.props.organization.id}&page=${this.state.page}&size=${this.state.pageSize}&versionCode=${this.state.searchParams.versionCode || ''}&versionName=${this.state.searchParams.versionName || ''}`,).then((response) => {
      response.data.map((item, index) => {
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          pageSize: this.state.pageSize,
          current: this.state.page + 1
        }
      })
    }).catch(e => {
      message.error(`${e.response.data.message}`)
    });
  }

  //分页点击
  onChangePager = (page) => {
    if (page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, () => {
        this.getList();
      })
  };

  //搜索
  search = (result) => {
    let searchParams = {
      versionCode: result.versionCode,
      versionName: result.versionName,
    }

    this.setState({
      searchParams: searchParams,
      loading: true,
      page: 0,
      current: 1
    }, () => {
      this.getList();
    })

  }

  //清空搜索区域
  clear = () => {
    this.setState({
      searchParams: {
        versionCode: '',
        versionName: '',
      }
    })
  }

//策划新建页面
  handleCreate = () => {
    let slideFrame = {};
    slideFrame.title = this.props.intl.formatMessage({id:"budgetVersion.newVersion"});
    slideFrame.visible = true;
    slideFrame.params = {};
    this.setState({slideFrame})
  };

  //策划编辑页面
  handleUpdate = (record) => {
    let slideFrame = {};
    slideFrame.title = this.props.intl.formatMessage({id:"budgetVersion.updateVersion"});
    slideFrame.visible = true;
    slideFrame.params = record;
    this.setState({slideFrame})
  };


  render() {
    const {columns, data, pagination, searchForm, loading, slideFrame} = this.state
    return (
      <div className="budget-versions">
        <div className="search-from">
          <SearchArea
            searchForm={searchForm}
            submitHandle={this.search}
            clearHandle={this.clear}
            eventHandle={this.searchEventHandle}/>
        </div>

        <div className="table-header">
          <div
            className="table-header-title"> {this.props.intl.formatMessage({id: 'common.total'}, {total: `${pagination.total}`})}</div>
          <div className="table-header-buttons">
            <Button type="primary"
                    onClick={this.handleCreate}>{this.props.intl.formatMessage({id: "common.create"})}</Button>
          </div>
        </div>

        <div className="Table-div">
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            bordered
            size="middle"
            onRow={record => ({
            onClick: () => this.handleUpdate(record)
          })}
          />
        </div>

        <SlideFrame title={slideFrame.title}
                    show={slideFrame.visible}
                    content={NewBudgetVersion}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={slideFrame.params}/>
      </div>
    )
  }

}

BudgetVersions.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetVersions));
