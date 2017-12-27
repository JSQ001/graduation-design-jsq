/**
 * created by jsq on 2017/12/25
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table} from 'antd'
import SlideFrame from 'components/slide-frame'
import NewUpdateSection from 'containers/financial-accounting-setting/section-structure/new-update-section.js'
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'

class SectionSetting extends React.Component{
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
      searchForm: [
        {                                                    //科目段代码
          type: 'input', id: 'sectionCode', label: formatMessage({id: 'section.code'}),
        },
        {                                                                        //科目段名称
          type: 'input', id: 'sectionName', label: formatMessage({id: 'section.name'})
        },
        {                                                                        //科目段字段代码
          type: 'input', id: 'sectionFieldCode', label: formatMessage({id: 'section.field.code'})
        },
        {                                                                        //科目段字段名称
          type: 'input', id: 'sectionFieldName', label: formatMessage({id: 'section.field.name'})
        }
      ],
      columns:[
        {          /*科目段代码*/
          title: formatMessage({id:"section.code"}), key: "sectionCode", dataIndex: 'sectionCode'
        },
        {          /*科目段名称*/
          title: formatMessage({id:"section.name"}), key: "sectionName", dataIndex: 'sectionName'
        },
        {          /*科目段字段代码*/
          title: formatMessage({id:"section.field.code"}), key: "sectionFieldCode", dataIndex: 'sectionFieldCode'
        },
        {          /*科目段字段名称*/
          title: formatMessage({id:"section.field.name"}), key: "sectionFieldName", dataIndex: 'sectionFieldName'
        },
        {          /*状态*/
          title: formatMessage({id:"common.column.status"}), key: "isEnabled", dataIndex: 'isEnabled',width:'8%'
        },

        {          /*操作*/
          title: formatMessage({id:"common.operation"}), key: "operate", dataIndex: 'operate',
          render: (text, record, index) => (
            <span>
            <a href="#" onClick={(e) => this.editItem(e, record,index)}>{formatMessage({id: "common.edit"})}</a>
            <span className="ant-divider" />
            <a href="#" onClick={(e) => this.handleLinkMapping(e, record,index)}>{formatMessage({id: "section.mapping.setting"})}</a>
          </span>)
        },
      ]
    };
  }

  handleLinkMapping = (e,record,index)=>{
    alert(1)
    let lov = {
      title: this.props.intl.formatMessage({id:"section.mapping"}),
      visible: true,
      params: {}
    };
    this.setState({lov})
  };

  componentWillMount() {
    this.getList();
  }

  getList(){};

  handleSearch = (values)=>{
    console.log(values)
  };

  handleCreate = ()=>{
    let lov = {
      title: this.props.intl.formatMessage({id:"section.new"}),
      visible: true,
      params: {}
    };
    this.setState({
      lov
    })
  };

  handleUpdate = (record)=>{
    if(!this.state.lov.visible){
      alert(2)
      let lov = {
        title: this.props.intl.formatMessage({id:"section.update"}),
        visible: true,
        params: record
      };
      this.setState({
        lov
      })
    }
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

  render(){
    const { formatMessage} = this.props.intl;
    const { loading, data, columns, searchForm, pagination, lov } = this.state;
    return (
      <div className="section-setting">
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
          onRow={record => ({
            onClick: () => this.handleUpdate(record)
          })}
          bordered
          size="middle"/>
        <SlideFrame title= {lov.title}
                    show={lov.visible}
                    content={NewUpdateSection}
                    afterClose={this.handleAfterClose}
                    onClose={()=>this.handleShowSlide(false)}
                    params={lov.params}/>
      </div>
    )
  }
}


SectionSetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(SectionSetting));
