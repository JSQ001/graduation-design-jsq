/**
 * Created by zaranengap on 2017/9/1.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon, Badge } from 'antd';
const TabPane = Tabs.TabPane;

import 'styles/setting/value-list/new-value-list.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      pageSize: 10,
      columns: [
        {title: '序号', dataIndex: 'index'},
        {title: '值名称', dataIndex: 'messageKey'},
        {title: '编码', dataIndex: 'value'},
        {title: '数据权限', key: 'common', render: common => common ? '全员' : '部分'},
        {title: '备注', key: 'remark', render: remark => remark ? remark : '-'},
        {title: '状态', key: 'enabled', render: enabled => <Badge status={enabled ? 'success' : 'error'} text={enabled ? '启用' : '禁用'} />},
      ],
      pagination: {
        total: 0
      }
    };
  }

  componentWillMount(){

  }


  render(){
    return (
      <div className="new-value-list">
        new-value-list
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ValueList);
