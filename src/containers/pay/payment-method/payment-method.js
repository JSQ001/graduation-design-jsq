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

import WrappedPaymentMethod from 'containers/pay/payment-method/new-payment-method'
import WrappedNewBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/new-budget-item-type'
import WrappedPutBudgetItemType from 'containers/budget-setting/budget-organization/budget-item-type/put-budget-item-type'

import 'styles/pay/payment-method/payment-method.scss'


class PaymentMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {/*付款方式类型*/
          title: this.props.intl.formatMessage({id: "paymentMethod.paymentMethodCategory"}),
          dataIndex: 'paymentMethodCategory',
          key: 'paymentMethodCategory',
          render(recode){
            if(recode === "ONLINE_PAYMENT"){
              return "线上"
            }else if(recode === "OFFLINE_PAYMENT"){
              return "线下"
            }else if(recode === "EBANK_PAYMENT"){
              return "落地文件"
            }
          }
        },
        {/*付款方式代码*/
          title: this.props.intl.formatMessage({id: "paymentMethod.paymentMethodCode"}),
          dataIndex: 'paymentMethodCode',
          key: 'paymentMethodCode',
        },
        {/*付款方式名称*/
          title: this.props.intl.formatMessage({id: "paymentMethod.description"}),
          dataIndex: 'description',
          key: 'description',
        },

        {/*状态*/
          title: this.props.intl.formatMessage({id: "budget.isEnabled"}),
          dataIndex: 'isEnabled',
          key: 'isEnabled',
          render: (recode, text) => {
            return (<div ><Badge status={ recode ? "success" : "error"}/>{recode ? "启用" : "禁用"}</div>);
          }
        },
      ],
      searchForm: [
        {type: 'input', id: 'paymentMethodCode', label: this.props.intl.formatMessage({id: "paymentMethod.paymentMethodCode"})},
        {type: 'input', id: 'description', label: this.props.intl.formatMessage({id: "paymentMethod.description"})},
      ],
      pageSize: 10,
      page: 0,
      pagination: {
        total: 0
      },
      searchParams: {
        paymentMethodCategory: '',
        paymentMethodCode: '',
        description:'',
        isEnabled:null,

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
    let url = `${config.payUrl}/api/Cash/PaymentMethod/query?description=${this.state.searchParams.description}&paymentMethodCode=${this.state.searchParams.paymentMethodCategory}&size=${this.state.pageSize}&page=${this.state.page}`;
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
      this.showSlideNew(true)
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
            bordered
            onRowClick={this.putItemTypeShowSlide}
            size="middle"
          />
        </div>

        <SlideFrame title="新建付款方式"
                    show={showSlideFrameNew}
                    content={WrappedPaymentMethod}
                    afterClose={this.handleCloseNewSlide}
                    onClose={() => this.showSlideNew(false)}
                    params={updateParams}/>

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

function mapStateToProps() {
  return {
  }
}

export default connect(mapStateToProps)(injectIntl(PaymentMethod));
