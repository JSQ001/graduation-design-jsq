/**
 * Created by zaranengap on 2017/9/1.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Form, Table, Button, notification, Icon, Badge, Row, Col, Input, Switch } from 'antd';
const FormItem = Form.Item;

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
      showSlideFrame: false,
      form: {
        name: '',
        enabled: true
      }
    };
  }

  componentWillMount(){

  }

  showSlide(){
    this.setState({
      showSlideFrame: true
    })
  }

  handleNameChange(evt){
    let form = this.state.form;
    form.name = evt.target.value;
    this.setState({
      form: form
    })
  }

  handleEnabled(enabled){
    let form = this.state.form;
    form.enabled = enabled;
    this.setState({
      form: form
    })
  }

  handleSave(){

  }

  handleCancel(){

  }

  renderForm(){
    return (
      <Row gutter={80}>
        <Col span={8}>
          <FormItem label="值列表名称" colon={false} required>
            <Input placeholder="请输入" onChange={this.handleNameChange.bind(this)}/>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="状态" colon={false}>
            <Switch defaultChecked={true} onChange={this.handleEnabled.bind(this)} checkedChildren="启用" unCheckedChildren="禁用"/>
          </FormItem>
        </Col>
        <Col span={24}>
          <Button type="primary" htmlType="submit" onClick={this.handleSave.bind(this)}>保存</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleCancel.bind(this)}>取消</Button>
        </Col>
      </Row>
    )
  }

  render(){
    return (
      <div className="new-value-list">
        <div className="common-top-area">
          <div className="common-top-area-title">基本信息</div>
          <div className="common-top-area-content">
            {this.renderForm()}
          </div>
        </div>
        <Button type="primary" onClick={this.showSlide.bind(this)}>新建值内容</Button>
        <SlideFrame title="this is title" show={this.state.showSlideFrame}>
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
