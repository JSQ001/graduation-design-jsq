/**
 * Created by fudebao on 2017/12/05.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import config from 'config'
import {Table, Badge, Button, Popover, message} from 'antd';
import menuRoute from 'routes/menuRoute'
import httpFetch from 'share/httpFetch'

import UpdateBudgetOrganization from 'containers/budget-setting/budget-organization/update-budget-organization'
import SearchArea from 'components/search-area'
import SlideFrame from 'components/slide-frame'

import NewSubjectSheet from 'containers/setting/subject-sheet/new-subject-sheet'
import SubjectSheetDetail from 'containers/setting/subject-sheet/subject-sheet-detail'

class SubjectSheet extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: true,
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: formatMessage({id: "subject.sheet.code"}), dataIndex: 'accountSetCode', width: '20%'},
        {
          title: formatMessage({id: "subject.sheet.describe"}), dataIndex: 'accountSetDesc', width: '30%',
          render: accountSetDesc => (
            <Popover content={accountSetDesc}>
              {accountSetDesc}
            </Popover>)
        },
        {
          title: formatMessage({id: "common.column.status"}), dataIndex: 'enabled', width: '6%',"align":"center",
          render: enabled => (
            <Badge status={enabled ? 'success' : 'error'}
                   text={enabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})}/>
          )
        },
        {
          title: "操作", dataIndex: 'operation', width: '10%', dataIndex: "id", key: "id","align":"center",
          render: (text, record) => (
            <div>
             <span>
                <a onClick={(e) => this.editItem(record)}>编辑</a>
                <span className="ant-divider"/>
                <a style={{marginRight: 10}} onClick={(e) => this.handleRowClick(e, record)}>查看详情</a>
              </span>
            </div>)
        }
      ],
      pagination: {
        total: 0
      },
      searchForm: [
        //科目表代码
        {type: 'input', id: 'accountSetCode', label: formatMessage({id: "subject.sheet.code"})},
        ////科目表描述
        {type: 'input', id: 'accountSetDesc', label: formatMessage({id: "subject.sheet.describe"})}
      ],
      searchParams: {
        accountSetCode: '',
        accountSetDesc: ''
      },
      updateParams: {},
      showSlideFrame: false,
      showSlideFrameNew: false,
      SubjectSheetDetail: menuRoute.getRouteItem('subject-sheet-detail', 'key'),
    };
  }

  componentWillMount() {
    this.getList();
  }

  editItem = (record) => {
    this.setState({
      updateParams: record,
      showSlideFrame: true
    })
    this.showSlideNew(true);
  };

  //得到列表数据
  getList() {
    this.setState({loading: true});
    let params = this.state.searchParams;
    let url = `${config.baseUrl}/api/account/set/query?&page=${this.state.page}&size=${this.state.pageSize}`;
    for (let paramsName in params) {
      url += params[paramsName] ? `&${paramsName}=${params[paramsName]}` : '';
    }
    return httpFetch.get(url).then((response) => {
      response.data.map((item) => {
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']) ? Number(response.headers['x-total-count']) : 0,
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
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
  //跳转到详情
  handleRowClick = (e,value) => {
    let path = this.state.SubjectSheetDetail.url.replace(":accountSetId", value.id);
    this.context.router.push(path);
  }


  search = (result) => {
    this.setState({
      page: 0,
      searchParams: {
        accountSetCode: result.accountSetCode ? result.accountSetCode : '',
        accountSetDesc: result.accountSetDesc ? result.accountSetDesc : ''
      }
    }, () => {
      this.getList();
    })
  };

  clear = () => {
    this.setState({
      searchParams: {
        accountSetCode: '',
        accountSetDesc: ''
      }
    })
  };

  searchEventHandle = (event, value) => {
    //console.log(event, value)
  };

  handleCloseNewSlide = (params) => {
    if (params) {
      this.getList();
    }
    this.setState({
      showSlideFrameNew: false
    })
  };

  showSlideNew = (flag) => {
    this.setState({
      showSlideFrameNew: flag
    })
  };

  newItemShowSlide = () => {
    this.setState({
      updateParams: {},
    }, () => {
      this.showSlideNew(true)
    })
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {columns, data, loading, pagination, searchForm, updateParams, showSlideFrame, showSlideFrameNew} = this.state;
    return (
      <div className="budget-organization">
        <h3 className="header-title">{formatMessage({id: "menu.subject-sheet"})}</h3> {/* 预算组织定义 */}
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>

        <div className="table-header">
          <div
            className="table-header-title">{formatMessage({id: "common.total"}, {total: pagination.total ? pagination.total : '0'})}</div>
          {/* 共total条数据 */}
          <div className="table-header-buttons">
            <Button type="primary"
                    onClick={this.newItemShowSlide}>{formatMessage({id: "common.create"})}</Button> {/* 新建 */}
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               /*onRowClick={this.editItem}*/
               size="middle"/>
        {/* 编辑科目表 */}
        <SlideFrame title={JSON.stringify(updateParams) === "{}" ? "新建科目表" : "编辑科目表"}
                    show={showSlideFrameNew}
                    content={NewSubjectSheet}
                    afterClose={this.handleCloseNewSlide}
                    onClose={() => this.setState({showSlideFrameNew: false})}
                    params={updateParams}/>
      </div>
    )
  }

}

SubjectSheet.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SubjectSheet));
