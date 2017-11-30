/**
 * Created by 13576 on 2017/11/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button, Table, Badge} from 'antd'

import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'


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
          title: "付款方式",width: '10%',
          dataIndex: 'paymentMethodCategoryName',
          key: 'paymentMethodCategoryName',
        },
        {/*必须关联申请*/
          title:"必须关联申请",
          dataIndex: 'reqRequiredFlag',
          key: 'reqRequiredFlag',width: '10%',
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
          dataIndex: 'setOfBookName',
          key: 'setOfBookName',
          render(text,recode){
            return `${recode.setOfBookCode}—${text}`
          }
        },
        {/*状态*/
          title: "状态",
          dataIndex: 'isEnabled',
          key: 'isEnabled', width: '6%',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? this.props.intl.formatMessage({id: "common.status.enable"}) :this.props.intl.formatMessage({id: "common.status.disable"})} />)
        },
        {/*操作*/
          title:"操作",
          dataIndex: 'operation',
          key: 'operation', width: '18%',
          render: (text, record) => (
            <span>
              <a href="#" onClick={(e) => this.putItemTypeShowSlide(e, record)}>{this.props.intl.formatMessage({id: "common.edit"})} | </a>
              <a href="#" onClick={(e) => this.distributionCompany(e, record)}>现金事务分配 | </a>
               <a href="#" onClick={(e) => this.distributionCompany(e, record)}>公司分配</a>
          </span>)
        },

      ],
      searchForm: [
        {type: 'select', id:'setOfBookId', label: '账套', isRequired: true, options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksName', valueKey: 'id',defaultValue:this.props.company.setOfBooksId},
        {type: 'input', id: 'typeCode', label:"预付款类型代码"},
        {type: 'input', id: 'typeName', label:"预付款类型名称"},
      ],
      pageSize: 10,
      page: 0,
      pagination: {
        total: 0
      },
      searchParams: {
        setOfBookId:this.props.company.setOfBooksId,
        typeCode: '',
        typeName:'',
      },
      updateParams: {
        paymentMethodCategory: '',
        paymentMethodCode: '',
      },
      showSlideFrameNew: false,
      showSlideFramePut: false,
      loading: true,
      payRequisitionTypeDetailPage:menuRoute.getRouteItem("pay-requisition-type-detail","key")

    };
  }


  componentWillMount() {
    this.getList();
  }


//获得数据
  getList() {
    this.setState({
      loading:true,
    })
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

  //分配公司
  distributionCompany=(e,coder)=>{
    const path = this.state.payRequisitionTypeDetailPage.url.replace(":requisitionTypeId",coder.id);
    this.context.router.push(path)
  }

  //清空搜索区域
  clear = () => {
    this.setState({
      searchParams: {
        setOfBookId:this.props.company.setOfBookId,
        typeCode: '',
        typeName:'',
      }
    })
  }

  //搜索
  search = (result) => {
    let searchParams = {
      setOfBookId:result.setOfBookId,
      typeCode: result.typeCode||'',
      typeName:result.typeName||''
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
                    params={updateParams}/>
      </div>
    );
  }
}

PayRequisitionType.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}
export default connect(mapStateToProps)(injectIntl(PayRequisitionType));
