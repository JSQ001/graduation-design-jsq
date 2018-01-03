/**
 * created by jsq on 2017/12/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Checkbox} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateAccountingSource from 'containers/financial-accounting-setting/accounting-source/new-update-accounting-source'
import DataStructure from 'containers/financial-accounting-setting/accounting-source/data-structure'
import SearchArea from 'components/search-area';
import ListSelector from 'components/list-selector'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'routes/menuRoute'
import 'styles/financial-accounting-setting/accounting-source/accounting-source.scss'

class AccountingSource extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      dataVisible: false,
      data: [{id: 1}],
      lovVisible: false,
      lov:{
        title: formatMessage({id:"accounting.source.lovTitle"})+this.props.company.setOfBooksName,
        url: `${config.baseUrl}/api/users/v2/search`,
        searchForm: [
          {type: 'input', id: 'code', label: formatMessage({id:"accounting.source.code"})},
          {type: 'input', id: 'name', label: formatMessage({id:"accounting.source.name"})}
        ],
        columns: [
          {title: formatMessage({id:"accounting.source.code"}), dataIndex: 'code', width: '25%'},
          {title: formatMessage({id:"accounting.source.name"}), dataIndex: 'name', width: '25%'},
        ],
        key: 'id'
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
        { type: 'select', id: 'setOfBook', label: formatMessage({id: 'section.setOfBook'}), options:[],labelKey: 'setOfBooksName',valueKey: 'id',
          defaultValue: this.props.company.setOfBooksName,
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', getParams: {roleType: 'TENANT'},
        },
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
        {                        /*自动过账*/
          title:formatMessage({id:"accounting.auto.checked"}), key: "autoChecked", dataIndex: 'autoChecked',width:'10%',
          render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>
        },
        {                        /*启用*/
          title:formatMessage({id:"common.status.enable"}), key: "doneRegisterLead", dataIndex: 'doneRegisterLead',width:'10%',
          render: (isEnabled, record) => <Checkbox onChange={(e) => this.onChangeEnabled(e, record)} checked={record.isEnabled}/>
        },
        {title: formatMessage({id:"accounting.source.setting"}), key: 'operation', width: '25%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "accounting.source.setting"})}</a>   {/*编辑*/}
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkDataStructure(e, record,index)}>{formatMessage({id: "accounting.source.data.setting"})}</a>  {/*数据结构设置*/}
           <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkTemplate(e, record,index)}>{formatMessage({id: "accounting.source.setOfBook.template"})}</a>  {/*凭证模板*/}
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
    this.setState({lovVisible:true})
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

  handleListOk = (result) => {
    this.setState({})
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
    const { loading, data, columns, searchForm, pagination, lovVisible, lov, dataVisible } = this.state;
    return(
      <div className="accounting-source">
        <div className="accounting-source-head-tips">
          {formatMessage({id:"accounting.source.setOfBook.headTips"})}
        </div>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.add'})}</Button>  {/*添加*/}
            <Button onClick={this.handleCreate}>{formatMessage({id: 'common.save'})}</Button>  {/*保存*/}
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
        <ListSelector
            visible={lovVisible}
            onOk={this.handleListOk}
            selectorItem={lov}
            //extraParams={{setOfBooksId: this.props.company.setOfBooksId,isEnabled: true}}
            onCancel={()=>this.setState({lovVisible:false})}/>
      </div>
    )
  }
}


AccountingSource.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company
  }
}

export default connect(mapStateToProps)(injectIntl(AccountingSource));
