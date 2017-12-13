/**
 * created by jsq on 2017/12/11
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Tabs, Button, Table, Form, Badge, Popconfirm, message } from 'antd'
import ListSelector from 'components/list-selector'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/setting/announcement-information/announcement-information.scss'

class AnnouncementInformation extends React.Component{
  constructor(props){
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: true,
      data:[],
      companyListSelector: false,
      batchCompany: true,
      selectedRowKeys: [],
      pagination: {
        current:0,
        page:0,
        total:0,
        pageSize:10,
        showSizeChanger:true,
        showQuickJumper:true,
      },
      columns: [
        {          /*序号*/
          title: formatMessage({id:"announcement-info.number"}), key: "number", dataIndex: 'number',width: '10%',
        },
        {          /*新建日期*/
          title: formatMessage({id:"announcement-info.createDate"}), key: "preferredDate", dataIndex: 'preferredDate'
        },
        {          /*标题*/
          title: formatMessage({id:"announcement-info.title"}), key: "title", dataIndex: 'title'
        },
        {           /*状态*/
          title: formatMessage({id:"common.column.status"}), key: 'status', width: '10%', dataIndex: 'enable',
          render: enable => (
            <Badge status={enable ? 'success' : 'error'}
                   text={enable ? formatMessage({id: "common.status.enable"}) : formatMessage({id: "common.status.disable"})} />
          )
        },
        {
          /*分配公司*/
          title: formatMessage({id: "announcement-info.deliveryCompany"}),
          key: "companyDistribute",
          dataIndex: 'companyDistribute',
          width: '15%',
          render: () => (<a target="#"  onClick={()=>this.showListSelector(true)}>{formatMessage({id: 'announcement-info.deliveryCompany'})}</a>)
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '10%', render: (text, record) => (
          <span>
            <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
              <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
            </Popconfirm>
          </span>)},  //操作
      ],
      selectedEntityOIDs: [],    //已选择的列表项的OIDs

      selectorItem:{
        title: '分配公司',
        url: `${config.baseUrl}/api/company/deploy/carousel`,
        searchForm: [
          {type: 'select', id: 'companyLevelId', label: '公司级别',defaultValue: '',options: [], getUrl: `${config.baseUrl}/api/companyLevel/selectByTenantId`},
          {type: 'select', id: 'legalEntityId', label: '法人实体',defaultValue: '',options: [], getUrl: `${config.budgetUrl}/api/all/legalentitys`},
          {type: 'input', id: 'companyCode', label: "公司代码",defaultValue: ''},
          {type: 'input', id: 'companyName', label: "公司名称",defaultValue: ''},
          {type: 'input', id: 'companyCodeFrom', label: "公司代码从",defaultValue: ''},
          {type: 'input', id: 'companyCodeTo', label: "公司代码至",defaultValue: ''},
        ],
        columns: [
          {title: "公司代码", dataIndex: 'companyCode'},
          {title: "公司名称",dataIndex:"companyName"},
          {title: "公司类型",dataIndex:"companyTypeName"},
        ],
        key: 'id'
      }
    }
  }

  deleteItem = (e, record) => {
    console.log(record)
    httpFetch.delete(`${config.baseUrl}/api/carousels/${record.carouselOID}`).then(response => {
      message.success(this.props.intl.formatMessage({id:"common.delete.success"}, {name: record.title})); // name删除成功
      this.getList();
    })
  };

  componentWillMount(){
    this.getList();
  }

  getList(){
    httpFetch.get(`${config.baseUrl}/api/carousels/enable/company?roleType=TENANT&companyOID=${this.props.company.companyOID}`).then((response)=>{
      console.log(response)
      let i = 1;
      response.data.map((item)=>{
        item.key = item.id;
        item.number = i++;
      });
      this.setState({
        loading: false,
        data: response.data
      })
    })
  }

  //控制是否弹出公司列表
  showListSelector = (flag) =>{
    this.setState({
      companyListSelector: flag
    })
  };

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.id);
    else
      temp.delete(record.id);
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //换页后根据OIDs刷新选择框
  refreshRowSelection(){
    let selectedRowKeys = [];
    this.state.selectedEntityOIDs.map(selectedEntityOID => {
      this.state.data.map((item, index) => {
        if(item.id === selectedEntityOID)
          selectedRowKeys.push(index);
      })
    });
    this.setState({ selectedRowKeys });
  }

  //清空选择框
  clearRowSelection(){
    this.setState({selectedEntityOIDs: [],selectedRowKeys: []});
  }

  //跳转详情页面
  handleRowClick = (record) =>{
    this.context.router.push(menuRoute.getMenuItemByAttr('announcement-information', 'key').children.announcementInformationDetail.url.replace(':id', record.id));
  };

  render(){
    const { loading, selectorItem, data, columns, pagination, selectedRowKeys, selectedEntityOIDs, companyListSelector, batchCompany} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };

    return (
      <div className="announcement-information">
        <div className="table-header">
          <span className="table-header-title">{this.props.intl.formatMessage({id:'common.total'},{total:`${pagination.total}`})}</span>  {/*共搜索到*条数据*/}
          <span>&nbsp;/&nbsp;已选{selectedEntityOIDs.length}</span>
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'common.create'})}</Button>  {/*新 建*/}
            <Button disabled={batchCompany} onClick={()=>this.showListSelector(true)}>{this.props.intl.formatMessage({id: 'announcement-info.deliveryCompany'})}</Button>
          </div>
        </div>
        <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            onRow={record => ({
              onClick: () => this.handleRowClick(record)
            })}
            bordered
            size="middle"/>
        <ListSelector
                      selectorItem={selectorItem}
                      visible={companyListSelector}
                      onOk={this.handleListOk}
                      extraParams={{setOfBooksId: this.props.company.setOfBooksId,isEnabled: true}}
                      onCancel={()=>this.showListSelector(false)}/>
      </div>)
  }
}


AnnouncementInformation.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}

export default connect(mapStateToProps)(injectIntl(AnnouncementInformation));
