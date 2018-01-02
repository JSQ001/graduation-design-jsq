/**
 * created by jsq on 2018/01/02
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, Popconfirm} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateScenariosSystem from 'containers/financial-accounting-setting/accounting-scenarios-system/new-update-scenarios-system'
import SearchArea from 'components/search-area';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-scenarios/accounting-scenarios.scss'
import ListSelector from 'components/list-selector'

class subjectsMatchingSetting extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      scenariosVisible: false,
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
        { type: 'select', id: 'setOfBook', label: formatMessage({id: 'section.setOfBook'}), options:[],labelKey: 'setOfBooksName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', getParams: {roleType: 'TENANT'},
        },
        {                                                                        //核算场景代码
          type: 'input', id: 'scenariosCode', label: formatMessage({id: 'accounting.scenarios.code'})
        },
        {                                                                        //核算场景名称
          type: 'input', id: 'scenariosName', label: formatMessage({id: 'accounting.scenarios.name'})
        },
      ],
      columns: [
        {          /*科目代码*/
          title: formatMessage({id:"accounting.subject.code"}), key: "setOfBook", dataIndex: 'setOfBook'
        },
        {          /*科目名称*/
          title: formatMessage({id:"accounting.subject.name"}), key: "scenariosCode", dataIndex: 'scenariosCode'
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
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '12%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "common.edit"})}</a>   {/*编辑*/}
            <span className="ant-divider" />
             <Popconfirm onConfirm={(e) => this.deleteItem(e, record,index)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
               <a href="#" style={{marginLeft: 12}}>{ formatMessage({id: "common.delete"})}</a>
              </Popconfirm>
          </span>)
        },
      ],
    };
  }

  deleteItem = (e, record,index)=>{
    alert(1)
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

  handleListOk = (result) => {
    console.log(123)
    this.setState({
      scenariosVisible: false
    })
  };

  render(){
    const { formatMessage} = this.props.intl;
    const { loading, data, columns, searchForm, pagination, lov, dataVisible, scenariosVisible } = this.state;
    return(
      <div className="subject-matching-setting">
        <div className="accounting-scenarios-head-tips">
          <span>
            {formatMessage({id:"section.setOfBook"})}: 假账套
          </span>
          <span style={{marginLeft:10}}>
            {formatMessage({id:"accounting.scenarios"},{name:""})+":vd"}
          </span>
          <span style={{marginLeft:10}}>
            {formatMessage({id:"accounting.subject.setting"},{name:"ffff"})}
          </span>
        </div>
        <SearchArea searchForm={searchForm} submitHandle={this.handleSearch}/>
        <div>设置核算场景下，不同核算要素组合时匹配的科目。</div>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={()=>this.setState({scenariosVisible: true})}>{formatMessage({id: 'common.add'})}</Button>  {/*添加*/}
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
        <ListSelector type="accounting_scenarios"
                      visible={scenariosVisible}
                      onOk={this.handleListOk}
                      extraParams={{itemId: this.props.params.itemId}}
                      onCancel={()=>this.setState({scenariosVisible: false})}/>
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


subjectsMatchingSetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(subjectsMatchingSetting));

