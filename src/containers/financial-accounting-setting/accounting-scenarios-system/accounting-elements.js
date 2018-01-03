/**
 * created by jsq on 2017/12/28
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, Input} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateAccountingElements from 'containers/financial-accounting-setting/accounting-scenarios-system/new-update-accounting-elements'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-scenarios-system/accounting-elements.scss'
import debounce from 'lodash.debounce';
const Search = Input.Search;

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
      columns: [
        {          /*核算要素代码*/
          title: formatMessage({id:"accounting.elements.code"}), key: "elementsCode", dataIndex: 'elementsCode'
        },
        {          /*核算要素名称*/
          title: formatMessage({id:"accounting.elements.name"}), key: "elementsName", dataIndex: 'elementsName'
        },
        {          /*核算要素性质*/
          title: formatMessage({id:"accounting.elements.nature"}), key: "nature", dataIndex: 'nature'
        },
        {          /*匹配组字段*/
          title: formatMessage({id:"accounting.matching.group.field"}), key: "groupField", dataIndex: 'groupField'
        },
        {           /*状态*/
          title: formatMessage({id:"common.column.status"}), key: 'status', width: '10%', dataIndex: 'isEnabled',
          render: isEnabled => (
            <Badge status={isEnabled ? 'success' : 'error'}
                   text={isEnabled ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '8%', render: (text, record, index) => (
          <span>
            <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "common.edit"})}</a>   {/*编辑*/}
          </span>)
        },
      ],
    };
  }

  handleLinkDataStructure = (e, record,index)=>{
    this.setState({dataVisible: true})
  };

  handleLinkElement = (e, record,index)=>{
    console.log(menuRoute.getMenuItemByAttr('accounting-source', 'key').children.voucherTemplate.url.replace('id', record.id))
    this.context.router.push(menuRoute.getMenuItemByAttr('accounting-source', 'key').children.voucherTemplate.url.replace('id', record.id))
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
      title: this.props.intl.formatMessage({id:"accounting.elements.add"}),
      visible: true,
      params: {}
    };
    this.setState({
      lov
    })
  };

  handleUpdate = (e,record,index)=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"accounting.elements.update"}),
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
    const { loading, data, columns, pagination, lov, dataVisible , scenarios} = this.state;
    return(
      <div className="accounting-elements">
        <div className="accounting-elements-header">
          <h2>{formatMessage({id:"accounting.scenarios"},{name:"123-假场景"})}</h2>
        </div>
        <div className="accounting-elements-header-tips">
          {formatMessage({id:"accounting.elements.headTips"},{name:"假场景"})}
        </div>
        <div className="table-header">
          <div className="table-header-title">{formatMessage({id:'common.total'},{total:`${pagination.total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{formatMessage({id: 'common.add'})}</Button>  {/*添加*/}
            <Search
              className="table-header-search"
              placeholder={formatMessage({id:"accounting.placeholder.tips"})}
              onSearch={value => console.log(value)}
              style={{ width: 300 }}
            />
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
                    content={NewUpdateAccountingElements}
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
