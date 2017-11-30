/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button, Table, Badge} from 'antd'

import config from 'config'
import httpFetch from 'share/httpFetch'


import SlideFrame from 'components/slide-frame'
import SearchArea from 'components/search-area'

import NewPaymentCompanySetting from 'containers/pay/payment-company-setting/new-payment-company-setting.js'
import WrappedNewBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/new-budget-item-type'
import WrappedPutBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/put-budget-item-type'

import 'styles/pay/payment-method/payment-method.scss'


class PaymentCompanySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {/*优先级*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.priorty"}),
          dataIndex: 'priorty',
          key: 'priorty',

        },
        {/*单据公司代码*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.companyCode"}),
          dataIndex: 'companyCode',
          key: 'companyCode',
        },
        {/*单据公司名称*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.companyName"}),
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {/*单据类别*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.ducumentCategory"}),
          dataIndex: 'ducumentCategory',
          key: 'ducumentCategory',
        },
        {/*单据类型*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.ducumentType"}),
          dataIndex: 'ducumentType',
          key: 'ducumentType',
        },
        {/*付款公司代码*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.paymentCompanyCode"}),
          dataIndex: 'paymentCompanyCode',
          key: 'paymentCompanyCode',
        },
        {/*付款公司名称*/
          title: this.props.intl.formatMessage({id: "paymentCompanySetting.paymentCompanyName"}),
          dataIndex: 'paymentCompanyName',
          key: 'paymentCompanyName',
        },

      ],
      searchForm: [
        {type: 'input', id: 'companyCode', label: this.props.intl.formatMessage({id: "paymentCompanySetting.companyCode"})},
        {type: 'input', id: 'companyName', label: this.props.intl.formatMessage({id: "paymentCompanySetting.companyName"})},
      ],
      pageSize: 10,
      page: 0,
      pagination: {
        total: 0
      },
      searchParams: {
        companyCode: '',
        companyName: '',
        ducumentCategory:'',
      },
      updateParams: {
        paymentMethodCategory: '',
        paymentMethodCode: '',
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
    let url = `${config.baseUrl}/api/paymentCompanyConfig/selectByInput?companyCode=${this.state.searchParams.companyCode}&companyName=${this.state.searchParams.companyName}&ducumentCategory=${this.state.searchParams.ducumentCategory}&size=${this.state.pageSize}&page=${this.state.page}`;
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
      <div className="payment-method">
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
            rowKey={recode=>{return recode.id}}
            bordered
            onRowClick={this.putItemTypeShowSlide}
            size="middle"
          />
        </div>

        <SlideFrame title="新建公司付款配置"
                    show={showSlideFrameNew}
                    content={NewPaymentCompanySetting}
                    afterClose={this.handleCloseNewSlide}
                    onClose={() => this.showSlideNew(false)}
                    params={{}}/>

      </div>
    );
  }

}

function mapStateToProps() {
  return {
  }
}

export default connect(mapStateToProps)(injectIntl(PaymentCompanySetting));
