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
import NewPayRequisitionType from 'containers/setting/pay-requisition-type/new-pay-requisition-type.js'
import 'styles/pay/payment-method/payment-method.scss'


class PayRequisitionType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isNew:null,
      columns: [
        {/*预付款类型代码*/
          title:"预付款类型代码",
          dataIndex: 'typeCode',
          key: 'typeCode',

        },
        {/*预付款类型名称*/
          title:"预付款类型名称",
          dataIndex: 'typeName',
          key: 'typeName',
        },
        {/*付款方式*/
          title: "付款方式",
          dataIndex: 'paymentMethodCategory',
          key: 'paymentMethodCategory',
        },
        {/*必须关联申请*/
          title:"必须关联申请",
          dataIndex: 'reqRequiredFlag',
          key: 'reqRequiredFlag',
          render(coder){
            if(coder){
              return "必需"
            }else{
              return "非必需"
            }
          }

        },
        {/*账套*/
          title:"账套",
          dataIndex: 'setOfBookId',
          key: 'setOfBookId',
        },
        {/*状态*/
          title: "状态",
          dataIndex: 'isEnabled',
          key: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? this.props.intl.formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />)
        },
        {/*操作*/
          title:"操作",
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => (
            <span>
              <a href="#" onClick={(e) => this.putItemTypeShowSlide(e, record)}>{this.props.intl.formatMessage({id: "common.edit"})}|</a>
              <a href="#" onClick={(e) => this.distributionCompany(e, record)}>{this.props.intl.formatMessage({id: "common.edit"})}</a>
          </span>)
        },

      ],
      searchForm: [
        {type: 'input', id: 'typeCode', label:"预付款类型代码"},
        {type: 'input', id: 'typeName', label:"预付款类型名称"},
      ],
      pageSize: 10,
      page: 0,
      pagination: {
        total: 0
      },
      searchParams: {
        setOfBookId: '',
        typeCode: '',
        typeName:'',
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
    let url = `${config.localUrl}/api/cash/setofbooks/pay/requisition/types/query?setOfBookId=${this.state.searchParams.setOfBookId}&typeCode=${this.state.searchParams.typeCode}&typeName=${this.state.searchParams.typeName}&size=${this.state.pageSize}&page=${this.state.page}`;
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

  distributionCompany=(e,coder)=>{

  }

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

  putItemTypeShowSlide = (e,recode) => {
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
            size="middle"
          />
        </div>

        <SlideFrame title="新建公司付款配置"
                    show={showSlideFrameNew}
                    content={NewPayRequisitionType}
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

export default connect(mapStateToProps)(injectIntl(PayRequisitionType));
