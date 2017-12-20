import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button, Table, Badge} from 'antd'

import config from 'config'
import httpFetch from 'share/httpFetch'


import SlideFrame from 'components/slide-frame'
import SearchArea from 'components/search-area'
import WrappedNewBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/new-budget-item-type'
import WrappedPutBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/put-budget-item-type'

import 'styles/budget-setting/budget-organization/buget-item-type/budget-item-type.scss'


class BudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {
          title: this.props.intl.formatMessage({id: "budget.itemTypeCode"}),
          dataIndex: 'itemTypeCode',
          key: 'itemTypeCode',
        },
        {
          title: this.props.intl.formatMessage({id: "budget.itemTypeName"}),
          dataIndex: 'itemTypeName',
          key: 'itemTypeName',
        },
        {
          title: this.props.intl.formatMessage({id: "budget.isEnabled"}),
          dataIndex: 'isEnabled',
          key: 'isEnabled',
          render: (recode, text) => {
            return (<div ><Badge status={ recode ? "success" : "error"}/>
              {recode ? this.props.intl.formatMessage({id: "common.status.enable"}) : this.props.intl.formatMessage({id: "common.status.disable"})}
              </div>);
          }
        },
      ],
      searchForm: [
        {type: 'input', id: 'itemTypeCode', label: this.props.intl.formatMessage({id: "budget.itemTypeCode"})},
        {type: 'input', id: 'itemTypeName', label: this.props.intl.formatMessage({id: "budget.itemTypeName"})},
      ],
      pageSize: 10,
      page: 0,
      pagination: {
        total: 0
      },
      searchParams: {
        itemTypeCode: '',
        itemTypeName: '',
      },
      updateParams: {
        itemTypeCode: '',
        itemTypeName: '',
      },
      showSlideFrameNew: false,
      showSlideFramePut: false,
      loading: true

    };
  }


  componentWillMount() {
    this.getList();
  }


//获得数据
  getList() {
    let url = `${config.budgetUrl}/api/budget/itemType/query?organizationId=${this.props.organization.id}&size=${this.state.pageSize}&page=${this.state.page}&itemTypeCode=${this.state.searchParams.itemTypeCode || ''}&itemTypeName=${this.state.searchParams.itemTypeName || ''}`;
    return httpFetch.get(url).then((response) => {
      response.data.map((item) => {
        item.key = item.id;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      })
    }).catch((e)=>{

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


  //清空搜索区域
  clear = () => {
    this.setState({
      searchParams: {
        itemTypeCode: '',
        itemTypeName: '',
      }
    })
  }

  //搜索
  search = (result) => {
    let searchParams = {
      itemTypeCode: result.itemTypeCode,
      itemTypeName: result.itemTypeName
    };
    this.setState({
      searchParams: searchParams,
      loading: true,
      page: 0,
      current: 1
    }, () => {
      this.getList();
    })
  };

  handleCloseNewSlide = (params) => {
    this.getList();
    this.setState({
      showSlideFrameNew: false
    })
  };


  handleCloseUpdateSlide = (params) => {
    this.getList();

    this.setState({
      showSlideFramePut: false
    })
  };


  showSlidePut = (flag) => {
    this.setState({
      showSlideFramePut: flag
    })
  };

  showSlideNew = (flag) => {
    this.setState({
      showSlideFrameNew: flag
    })
  };

  newItemTypeShowSlide = () => {
    this.setState({
      updateParams: {},
    }, () => {
      this.showSlideNew(true)
    })
  }

  putItemTypeShowSlide = (recode) => {
    this.setState({
      updateParams: recode,
    }, () => {
      this.showSlidePut(true)
    })

  }


  render() {
    const {columns, data, pagination, searchForm, showSlideFramePut, showSlideFrameNew, loading, updateParams, isPut} = this.state
    return (
      <div className="versionsDefine">
        <div className="searchFrom">
          <SearchArea
        searchForm={searchForm}
        submitHandle={this.search}
        clearHandle={this.clear}
        eventHandle={this.searchEventHandle}/>
      </div>

        <div className="table-header">
          <div
            className="table-header-title">{this.props.intl.formatMessage({id: 'common.total'}, {total: `${pagination.total}`})}</div>
          <div className="table-header-buttons">
            <Button type="primary"
                    onClick={this.newItemTypeShowSlide}>{this.props.intl.formatMessage({id: "common.create"}) }</Button>
          </div>
        </div>

        <div className="Table_div" style={{backgroundColor: 111}}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            bordered
            onRow={record => ({
              onClick: () => this.putItemTypeShowSlide(record)
            })}
            size="middle"
          />
        </div>

        <SlideFrame title={this.props.intl.formatMessage({id: "budget.newItemType"})}
                    show={showSlideFrameNew}
                    content={WrappedNewBudgetItemType}
                    afterClose={this.handleCloseNewSlide}
                    onClose={() => this.showSlideNew(false)}
                    params={{}}/>

        <SlideFrame title={this.props.intl.formatMessage({id: "budget.editItemType"})}
                    show={showSlideFramePut}
                    content={WrappedPutBudgetItemType}
                    afterClose={this.handleCloseUpdateSlide}
                    onClose={() => this.showSlidePut(false)}
                    params={updateParams}/>


      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(BudgetItemType));
