/**
 * created by jsq on 2017/12/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateAccountingSource from 'containers/financial-accounting-setting/accounting-source/new-update-accounting-source'
import DataStructure from 'containers/financial-accounting-setting/accounting-source/data-structure'
import SearchArea from 'components/search-area';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-source/accounting-source.scss'

class AccountingSource extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      dataVisible: false,
      data: [{id: 1}],
      lov:{
        visible: false
      },
      pagination: {
        current: 1,
        page: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      searchForm: [
        {                                                                        //来源事物代码
          type: 'input', id: 'accountingSourceCode', label: formatMessage({id: 'accounting.source.code'})
        },
        {                                                                        //来源事物名称
          type: 'input', id: 'accountingSourceName', label: formatMessage({id: 'section.structure.name'})
        },
      ],
      columns: [
        {          /*来源事物代码*/
          title: formatMessage({id:"accounting.source.code"}), key: "accountingSourceCode", dataIndex: 'accountingSourceCode'
        },
        {          /*来源事物名称*/
          title: formatMessage({id:"accounting.source.name"}), key: "accountingSourceName", dataIndex: 'accountingSourceName'
        },
        {           /*状态*/
          title: formatMessage({id:"common.column.status"}), key: 'status', width: '10%', dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '25%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "common.edit"})}</a>   {/*编辑*/}
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkDataStructure(e, record,index)}>{formatMessage({id: "accounting.source.data.setting"})}</a>  {/*数据结构设置*/}
           <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkTemplate(e, record,index)}>{formatMessage({id: "accounting.source.template"})}</a>  {/*凭证模板设置*/}
          </span>)
        },
      ],
    };
  }

  handleLinkDataStructure = (e, record,index)=>{
    this.setState({dataVisible: true})
  };

  handleLinkTemplate = (e, record,index)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('accounting-source', 'key').children.voucherTemplate.url.replace(':id', record.id))
  };

  componentWillMount() {
    this.getList();
  }

  getList(){}

  handleSearch = (params)=>{
    console.log(params)
  };

  handleCreate = ()=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"accounting.source.add"}),
      visible: true,
      params: {}
    };
    this.setState({
      lov
    })
  };

  handleUpdate = (e,record,index)=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"accounting.source.update"}),
      visible: true,
      params: record
    };
    this.setState({
      lov
    })
  };

  handleAfterClose = ()=>{
    this.setState({
      lov:{
        visible: false
      }
    })
  };

  handleShowSlide = ()=>{
    this.setState({
      lov:{
        visible: false
      }
    })
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      loading: true,
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  render(){
    const { formatMessage} = this.props.intl;
    const { loading, data, columns, searchForm, pagination, lov, dataVisible } = this.state;
    return(
      <div className="accounting-source">
        <div className="accounting-source-head-tips">
          {formatMessage({id:"accounting.source.headTips"})}
        </div>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.add'})}</Button>  {/*新 建*/}
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          onChange={this.onChangePager}
          bordered
          size="middle"/>
        <SlideFrame title= {lov.title}
                    show={lov.visible}
                    content={NewUpdateAccountingSource}
                    afterClose={this.handleAfterClose}
                    onClose={()=>this.handleShowSlide(false)}
                    params={lov.params}/>
        <SlideFrame title= {formatMessage({id:"data.structure"})}
                    show={dataVisible}
                    content={DataStructure}
                    afterClose={(value)=>{console.log(value)}}
                    onClose={()=>this.setState({dataVisible:false})}
                    params={lov.params}/>
      </div>
    )
  }
}


AccountingSource.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(injectIntl(AccountingSource));
