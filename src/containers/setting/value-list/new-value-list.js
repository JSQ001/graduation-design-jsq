/**
 * Created by zaranengap on 2017/9/1.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import { Form, Table, Button, notification, Icon, Badge, Row, Col, Input, Switch, Dropdown, Menu, Modal, Upload } from 'antd';
const FormItem = Form.Item;

import SlideFrame from 'components/slide-frame'
import NewValue from 'containers/setting/value-list/new-value'

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
      showImportFrame: false,
      form: {
        name: '',
        enabled: true
      },
      edit: true
    };
  }

  componentWillMount(){

  }

  showSlide = (flag) => {
    this.setState({
      showSlideFrame: flag
    })
  };

  handleNameChange = (evt) => {
    let form = this.state.form;
    form.name = evt.target.value;
    this.setState({
      form: form
    })
  };

  handleEnabled = (enabled) => {
    let form = this.state.form;
    form.enabled = enabled;
    this.setState({
      form: form
    })
  };

  handleSave = () => {
    this.setState({edit: false})
  };

  handleEdit = () => {
    this.setState({edit: true})
  };

  handleCancel = () => {

  };

  showImport = (flag) => {
    this.setState({
      showImportFrame: flag
    })
  };

  handleImport = () => {
    this.showImport(false);
  };

  /**
   * 关闭侧栏的方法，判断是否有内部参数传出
   * @param params
   */
  handleCloseSlide = (params) => {
    console.log(params);
    this.setState({
      showSlideFrame: false
    })
  };

  renderForm(){
    let length = this.state.form.name.length;
    let validateStatus = length > 15 ? "error" : null;
    let help = length > 15 ? "字符请控制在15个之内" : null;
    return (
      this.state.edit ?
      <Row gutter={80}>
        <Col span={8}>
          <FormItem label="值列表名称" colon={false} required
                    validateStatus={validateStatus}
                    help={help}>
            <Input placeholder="请输入最多15个字符" defaultValue={this.state.form.name}
                   onChange={this.handleNameChange}/>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="状态" colon={false}>
            <Switch defaultChecked={this.state.form.enabled} onChange={this.handleEnabled} checkedChildren="启用" unCheckedChildren="禁用"/>
          </FormItem>
        </Col>
        <Col span={24}>
          <Button type="primary" htmlType="submit" onClick={this.handleSave} disabled={length === 0 || length > 15}>保存</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>取消</Button>
        </Col>
      </Row> :
      <div>
        <div className="form-title">值列表名称</div>
        <div>{this.state.form.name}</div>
      </div>
    )
  }

  renderDropDown(){
    return (
      <Menu onClick={() => this.showImport(true)}>
        <Menu.Item key="1">值导入</Menu.Item>
      </Menu>
    )
  }

  render(){
    const { showSlideFrame, edit, data, columns, pagination, showImportFrame, form } = this.state;
    return (
      <div className="new-value-list">
        <div className="common-top-area">
          <div className="common-top-area-title">
            {!edit ? <Icon type={form.enabled ? "check-circle" : "minus-circle"} className={form.enabled ? "title-icon" : "title-icon not"} /> : null}
            基本信息
            {!edit ? <span className="title-edit" onClick={this.handleEdit}>编辑</span> : null}
          </div>
          <div className="common-top-area-content form-title-area">
            {this.renderForm()}
          </div>
        </div>

        <div className="table-header">
          <div className="table-header-title">{`共${data.length}条数据`}</div>
          <div className="table-header-buttons">
            <Dropdown.Button overlay={this.renderDropDown()} type="primary" onClick={() => this.showSlide(true)}>
              新建值内容
            </Dropdown.Button>
            <Button>值导出</Button>
          </div>
        </div>
        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               bordered/>

        <SlideFrame title="新建值内容"
                    show={showSlideFrame}
                    content={NewValue}
                    afterClose={this.handleCloseSlide}
                    onClose={() => this.showSlide(false)}
                    params={{}}/>

        <Modal visible={showImportFrame} title="值导入" onCancel={() => this.showImport(false)} onOk={this.handleImport}>
          <Upload.Dragger name="files" className="uploader">
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或拖拽文件上传</p>
          </Upload.Dragger>
        </Modal>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ValueList);
