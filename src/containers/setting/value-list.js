/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon, Badge } from 'antd';
const TabPane = Tabs.TabPane;

import 'styles/setting/value-list.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tabs: [
        {key: 'SYSTEM', name:'系统值列表'},
        {key: 'CUSTOM', name:'自定义值列表'}],
      status: 'SYSTEM',
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '序号', dataIndex: 'index', width: '15%'},
        {title: '值列表名称', dataIndex: 'name', width: '70%'},
        {title: '状态', key: 'enabled', width: '15%', render: enabled => <Badge status={enabled ? 'success' : 'error'} text={enabled ? '启用' : '禁用'} />}
      ],
      pagination: {
        total: 0
      }
    };
  }

  componentWillMount(){
    this.getList();
  }

  getList(){
    return httpFetch.get(`${config.baseUrl}/api/v2/custom/enumerations?isCustom=${this.state.status}&page=${this.state.page}&size=${this.state.pageSize}`,
      this.state.searchParams).then((response)=>{
      response.data.map((item, index)=>{
        item.index = this.state.page * this.state.pageSize + index + 1;
        item.key = item.index;
      });
      this.setState({
        data: response.data,
        loading: false,
        pagination: {
          total: Number(response.headers['x-total-count']),
          onChange: this.onChangePager.bind(this)
        }
      })
    });
  }

  onChangePager(page){
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  }

  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  onChangeTabs(key){
    this.setState({
      loading: true,
      page: 0,
      status: key
    },()=>{
      this.getList()
    });
  }

  render(){
    const { columns, data, loading,  pagination, status } = this.state;
    return (
      <div className="value-list">
        <Tabs type="card" onChange={this.onChangeTabs.bind(this)}>
          {this.renderTabs()}
        </Tabs>
        <div className="table-header">
          {status === 'SYSTEM' ? <div className="table-header-title">汇联易系统正常工作所必要的值列表，不可新增</div> : null}
          {status === 'CUSTOM' ? <div className="table-header-buttons"><Button type="primary">新增值列表</Button></div> : null}
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ValueList);
