/**
 * Created by zaranengap on 2017/9/1.
 */
import React from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'
import { connect } from 'react-redux'
import menuRoute from 'routes/menuRoute'
import { Form, Table, Button, Icon, Badge, Row, Col, Input, Switch, Dropdown, Menu, Modal, Upload, message, Checkbox, Tooltip } from 'antd';
const FormItem = Form.Item;

import SlideFrame from 'components/slide-frame'
import NewValue from 'containers/setting/value-list/new-value'

import 'styles/setting/value-list/new-value-list.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableLoading: false,
      data: [],
      page: 1,
      pagination: {},
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render: (value, record, index) => index + 1 + 10 * (this.state.page - 1)},
        {title: '值名称', dataIndex: 'messageKey'},
        {title: '编码', dataIndex: 'value'},
        {title: '数据权限', dataIndex: 'common', render: common => common ? '全员' : '部分'},
        {title: '备注', dataIndex: 'remark', render: remark =>
          remark ? <Tooltip title={remark}>{remark}</Tooltip> : '-'},
        {title: '状态', dataIndex: 'enabled', width: '7%', render: enabled =>
          <Badge status={enabled ? 'success' : 'error'} text={enabled ? '启用' : '禁用'} />},
        {title: '默认', dataIndex: 'customEnumerationItemOID', width: '7%', render: (value, record) =>
          <Checkbox checked={value === this.state.defaultCustomEnumerationItemOID} onChange={(e) => this.setDefault(e, record)}/>}
      ],
      showSlideFrame: false,
      showImportFrame: false,
      form: {
        name: '',
        enabled: true
      },
      edit: true,
      customEnumerationOID: null,
      defaultCustomEnumerationItemOID: null,
      isCustom: '',
      valueList: menuRoute.getRouteItem('value-list','key')   //值列表页
    };
  }

  componentWillMount(){
    if(this.props.params.customEnumerationOID) {
      this.setState({
        customEnumerationOID: this.props.params.customEnumerationOID,
        edit: false
      },() => {
        this.getList()
      })
    }
  }

  getList = () => {
    this.setState({ tableLoading: true });
    let url = `${config.baseUrl}/api/custom/enumerations/${this.state.customEnumerationOID}`;
    let form = this.state.form;
    httpFetch.get(url).then(res => {
      form.name = res.data.name;
      form.enabled = res.data.enabled;
      form.defaultCustomEnumerationItemOID = res.data.defaultCustomEnumerationItemOID;
      form.defaultCustomEnumerationItemValue = res.data.defaultCustomEnumerationItemValue;
      this.setState({
        tableLoading: false,
        data: res.data.values,
        isCustom: res.data.isCustom,
        defaultCustomEnumerationItemOID: res.data.defaultCustomEnumerationItemOID,
        form,
        pagination: { onChange: this.onChangePage }
      })
    }).catch(() => {
      this.setState({ tableLoading: false });
      message.error('数据加载失败，请重试')
    })
  };

  //点击页码
  onChangePage = (page) => {
    this.setState({ page })
  };

  //设置默认值内容
  setDefault = (e, record) => {
    let { data, form } = this.state;
    data.map(item => {
      if(e.target.checked) {
        item.isDefault = (item.id === record.id);
        form.defaultCustomEnumerationItemOID = record.customEnumerationItemOID;
        form.defaultCustomEnumerationItemValue = record.messageKey
      } else {
        item.isDefault = false;
        form.defaultCustomEnumerationItemOID = null;
        form.defaultCustomEnumerationItemValue = null
      }
    });
    this.setState({ data, form, tableLoading: true }, () => {
      this.handleSave()
    })
  };

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
    let params = {
      isCustom: this.state.isCustom,
      //TODO: 以下字段需确定
      fieldType: "TEXT",
      values: [],
      dataFrom: "101"
    };
    Object.keys(this.state.form).map(key => {
      params[key] = this.state.form[key]
    });
    if(this.state.customEnumerationOID) {
      params.customEnumerationOID = this.state.customEnumerationOID
    }
    this.setState({ loading: true });
    let url = `${config.baseUrl}/api/v2/custom/enumerations?roleType=TENANT`;
    httpFetch[this.state.customEnumerationOID ? 'put' : 'post'](url, params).then(res => {
      if(res.status === 200) {
        this.setState({
          loading: false,
          edit: false,
          customEnumerationOID: res.data.customEnumerationOID
        }, () => {
          this.getList()
        });
        message.success('保存成功');
      }
    }).catch(e => {
      this.setState({ loading: false });
      message.error(`保存失败，${e.response.data.message}`)
    })
  };

  handleEdit = () => {
    this.setState({edit: true})
  };

  handleCancel = () => {
    if(this.state.customEnumerationOID) {
      this.setState({ edit: false })
    } else {
      this.context.router.push(`${this.state.valueList.url}?tab=CUSTOM`)
    }
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
    if(params) {
      this.setState({
        showSlideFrame: false
      }, () => {
        this.getList()
      })
    }
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
            <Switch defaultChecked={this.state.form.enabled} onChange={this.handleEnabled} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
          </FormItem>
        </Col>
        <Col span={24}>
          <Button type="primary"
                  htmlType="submit"
                  loading={this.state.loading}
                  onClick={this.handleSave}
                  disabled={length === 0 || length > 15}>保存</Button>
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

  handleBack = () => {
    this.context.router.push(`${this.state.valueList.url}?tab=${this.state.isCustom}`)
  };

  render(){
    const { tableLoading, showSlideFrame, edit, data, columns, pagination, showImportFrame, form, customEnumerationOID, isCustom } = this.state;
    return (
      <div className="new-value-list">
        <div className="common-top-area">
          <div className="common-top-area-title">
            {!edit ? <Icon type={form.enabled ? "check-circle" : "minus-circle"} className={form.enabled ? "title-icon" : "title-icon not"} /> : null}
            基本信息
            {(!edit && isCustom === 'CUSTOM') ? <span className="title-edit" onClick={this.handleEdit}>编辑</span> : null}
          </div>
          <div className="common-top-area-content form-title-area">
            {this.renderForm()}
          </div>
        </div>

        {customEnumerationOID && (
          <div>
            <div className="table-header">
              <div className="table-header-title">{`共${data.length}条数据`}</div>
              <div className="table-header-buttons">
                <Dropdown.Button overlay={this.renderDropDown()} type="primary" onClick={() => this.showSlide(true)}>
                  新建值内容
                </Dropdown.Button>
                <Button>值导出</Button>
              </div>
            </div>
            <Table rowKey="id"
                   columns={columns}
                   dataSource={data}
                   pagination={pagination}
                   loading={tableLoading}
                   size="middle"
                   bordered/>
            <a style={{fontSize:'14px',paddingBottom:'20px'}} onClick={this.handleBack}>
              <Icon type="rollback" style={{marginRight:'5px'}}/>返回
            </a>
          </div>
        )}

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

ValueList.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ValueList);
