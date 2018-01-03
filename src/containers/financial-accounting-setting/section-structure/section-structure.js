/**
 * created by jsq on 2017/12/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateSectionStructure from 'containers/financial-accounting-setting/section-structure/new-update-section-structure.js'
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'routes/menuRoute'
import 'styles/financial-accounting-setting/section-structure/section-structure.scss'

class SectionStructure extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [{id:1}],
      lov:{
        visible: false
      },
      pagination: {
        current: 1,
        page: 0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      searchForm: [                                                             //账套
        { type: 'select', id: 'setOfBook', label: formatMessage({id: 'section.setOfBook'}), options:[],labelKey: 'setOfBooksName',valueKey: 'id',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get', getParams: {roleType: 'TENANT'},
        },
        {                                                                        //科目段结构代码
          type: 'input', id: 'sectionStructureCode', label: formatMessage({id: 'section.structure.code'})
        },
        {                                                                        //科目段结构名称
          type: 'input', id: 'sectionStructureCName', label: formatMessage({id: 'section.structure.name'})
        }
      ],
      columns:[
        {          /*账套*/
          title: formatMessage({id:"section.setOfBook"}), key: "setOfBook", dataIndex: 'setOfBook'
        },
        {          /*科目段结构代码*/
          title: formatMessage({id:"section.structure.code"}), key: "sectionCode", dataIndex: 'sectionCode'
        },
        {          /*科目段结构名称*/
          title: formatMessage({id:"section.structure.name"}), key: "sectionName", dataIndex: 'sectionName'
        },
        {          /*状态*/
          title: formatMessage({id:"common.column.status"}), key: "isEnabled", dataIndex: 'isEnabled',width:'8%'
        },

        {          /*操作*/
          title: formatMessage({id:"common.operation"}), key: "operate", dataIndex: 'operate',width:'14%',
          render: (text, record, index) => (
            <span>
            <a href="#" onClick={(e) => this.handleUpdate(e, record,index)}>{formatMessage({id: "common.edit"})}</a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkSetting(e, record,index)}>{formatMessage({id: "section.setting"})}</a>
          </span>)
        },
      ]
    }
  };

  handleLinkSetting = (e,record,index)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('section-structure', 'key').children.sectionSetting.url.replace(':id', record.id))
  };

  componentWillMount() {
    this.getList();
  }

  getList(){};

  handleSearch = (params)=>{
    console.log(params)
  };

  handleCreate = ()=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"section.structure.new"}),
      visible: true,
      params: {}
    };
    this.setState({
      lov
    })
  };

  handleUpdate = (e,record,index)=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"section.structure.update"}),
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
    const { loading, data, columns, searchForm, pagination, lov } = this.state;
    return(
      <div className="section-structure">
        <div className="section-structure-header">
          {formatMessage({id:"section.structure.header"})}
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
                    content={NewUpdateSectionStructure}
                    afterClose={this.handleAfterClose}
                    onClose={()=>this.handleShowSlide(false)}
                    params={lov.params}/>
      </div>
    )
  }
}

SectionStructure.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(injectIntl(SectionStructure));
