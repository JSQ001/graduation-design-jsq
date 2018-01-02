/**
 * created by jsq on 2017/12/27
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateScenariosSystem from 'containers/financial-accounting-setting/accounting-scenarios-system/new-update-scenarios-system'
import SearchArea from 'components/search-area';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-scenarios-system/accounting-scenarios-system.scss'

class AccountingScenariosSystem extends React.Component {
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
        {                                                                        //核算场景代码
          type: 'input', id: 'scenariosCode', label: formatMessage({id: 'accounting.scenarios.code'})
        },
        {                                                                        //核算场景名称
          type: 'input', id: 'scenariosName', label: formatMessage({id: 'accounting.scenarios.name'})
        },
      ],
      columns: [
        {          /*核算场景代码*/
          title: formatMessage({id:"accounting.scenarios.code"}), key: "scenariosCode", dataIndex: 'scenariosCode'
        },
        {          /*核算场景名称*/
          title: formatMessage({id:"accounting.scenarios.name"}), key: "scenariosName", dataIndex: 'scenariosName'
        },
        {           /*状态*/
          title: formatMessage({id:"common.column.status"}), key: 'status', width: '10%', dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        },
        {title: formatMessage({id:"accounting.scenarios.elements"}), key: 'elements', width: '10%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.handleLinkElement(e, record,index)}>{formatMessage({id: "accounting.scenarios.elements"})}</a>   {/*编辑*/}
          </span>)
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '8%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "common.edit"})}</a>   {/*编辑*/}
          </span>)
        },
      ],
    };
  }

  handleLinkElement = (e, record,index)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('accounting-scenarios-system', 'key').children.accountingElements.url.replace(':id', record.id))
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
      title: this.props.intl.formatMessage({id:"accounting.scenarios.new"}),
      visible: true,
      params: {}
    };
    this.setState({
      lov
    })
  };

  handleUpdate = (e,record,index)=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"accounting.scenarios.update"}),
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
      <div className="accounting-scenarios-system">
        <div className="accounting-scenarios-head-tips">
          {formatMessage({id:"accounting.scenarios.system.tips"})}
        </div>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
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
                    content={NewUpdateScenariosSystem}
                    afterClose={this.handleAfterClose}
                    onClose={()=>this.handleShowSlide(false)}
                    params={lov.params}/>
      </div>
    )
  }
}


AccountingScenariosSystem.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(AccountingScenariosSystem));
