/**
 * Created by zaranengap on 2017/9/1.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Tabs, Table, Button, notification, Icon, Badge } from 'antd';
const TabPane = Tabs.TabPane;

import SlideFrame from 'components/slide-frame'

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
      },
      showSlideFrame: false
    };
  }

  componentWillMount(){

  }

  showSlide(){
    this.setState({
      showSlideFrame: true
    })
  }

  render(){
    return (
      <div className="new-value-list">
        <Button type="primary" onClick={this.showSlide.bind(this)}>新建值内容</Button>
        <SlideFrame title="新建值内容" show={this.state.showSlideFrame}>
          this is content
        </SlideFrame>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ValueList);
