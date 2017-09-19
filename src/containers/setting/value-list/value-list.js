/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Tabs, Table, Button, Badge } from 'antd';
import { Link } from 'react-router'
const TabPane = Tabs.TabPane;

import menuRoute from 'share/menuRoute'

import 'styles/setting/value-list/value-list.scss'

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
        {title: '序号', dataIndex: 'index', width: '8%'},
        {title: '值列表名称', dataIndex: 'name', width: '77%'},
        {title: '状态', key: 'enabled', width: '15%', render: enabled => <Badge status={enabled ? 'success' : 'error'} text={enabled ? '启用' : '禁用'} />}
      ],
      pagination: {
        total: 0
      },
      valueListPage: menuRoute.getRouteItem('new-value-list','key')   //新建值列表的页面项
    };
  }

  componentWillMount(){
    this.getList();
  }

  //得到值列表数据
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
          onChange: this.onChangePager
        }
      })
    });
  }

  //分页点击
  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({
        page: page - 1,
        loading: true
      }, ()=>{
        this.getList();
      })
  };

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  //Tabs点击
  onChangeTabs = (key) => {
    this.setState({
      loading: true,
      page: 0,
      status: key
    },()=>{
      this.getList()
    });
  };

  render(){
    const { columns, data, loading,  pagination, status, valueListPage } = this.state;
    return (
      <div className="value-list">
        <Tabs type="card" onChange={this.onChangeTabs}>
          {this.renderTabs()}
        </Tabs>
        <div className="table-header">
          {status === 'SYSTEM' ? <div className="table-header-title">汇联易系统正常工作所必要的值列表，不可新增</div> : null}
          {status === 'CUSTOM' ?
            <div className="table-header-buttons">
              <Button type="primary">
                <Link to={valueListPage.url}>新增值列表</Link>
              </Button>
            </div> : null}
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               bordered
               size="middle"/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ValueList);
