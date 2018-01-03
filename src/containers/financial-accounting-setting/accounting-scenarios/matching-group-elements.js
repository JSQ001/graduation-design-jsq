/**
 * created by jsq on 2018/1/2
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateMatchingGroup from 'containers/financial-accounting-setting/accounting-scenarios/new-update-matching-group'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-scenarios/matchingGroupElements.scss'

class MatchingGroupElements extends React.Component {
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
      columns: [
        {          /*优先级*/
          title: formatMessage({id:"accounting.priority"}), key: "setOfBook", dataIndex: 'setOfBook'
        },
        {          /*匹配组代码s*/
          title: formatMessage({id:"matching.group.code"}), key: "scenariosCode", dataIndex: 'scenariosCode'
        },
        {          /*匹配组名称*/
          title: formatMessage({id:"matching.group.name"}), key: "groupName", dataIndex: 'groupName'
        },
        {          /*核算要素*/
          title: formatMessage({id:"accounting.scenarios.elements"}), key: "elements", dataIndex: 'elements'
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
            <a href="#" onClick={(e) => this.handleLinkSubject(e, record,index)}>{formatMessage({id: "accounting.subjects.matching"})}</a>
          </span>)
        },
      ],
    };
  }

  handleLinkSubject = (e, record,index)=>{
    this.context.router.push(menuRoute.getRouteItem('accounting-scenarios', 'key').children.subjectMatchingSetting.url.replace(':id', this.props.params.id).replace(':groupId',record.id))
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
      title: this.props.intl.formatMessage({id:"accounting.matching.group.new"}),
      visible: true,
      params: {}
    };
    this.setState({
      lov
    })
  };

  handleUpdate = (e,record,index)=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"accounting.matching.group.update"}),
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
      <div className="accounting-scenarios">
        <div className="accounting-scenarios-head-tips">
          {formatMessage({id:"section.setOfBook"})}: 假账套  {   formatMessage({id:"accounting.scenarios"},{name:""})+":vd"}
        </div>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.create'})}</Button>  {/*添加*/}
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
                    content={NewUpdateMatchingGroup}
                    afterClose={this.handleAfterClose}
                    onClose={()=>this.handleShowSlide(false)}
                    params={lov.params}/>
      </div>
    )
  }
}


MatchingGroupElements.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(MatchingGroupElements));
