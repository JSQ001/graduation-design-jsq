import React from 'react'
import { connect } from 'react-redux'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Input, Switch, Button, Icon, Table, message } from 'antd'
const FormItem = Form.Item;

import 'styles/setting/value-list/new-value.scss'

class ValueList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      item: {
        allChoice: false,
        common: false,
        corporationOIDs: [],
        customEnumerationOID: "",
        departmentOIDs: [],
        enabled: true,
        keyword: "",
        messageKey: "",
        patientia: false,
        remark: "",
        returnChoiceUserOIDs: [],
        userOIDs: [""],
        userSummaryDTOs: [],
        value: "",
      },
      loading: false,
      //TODO: 以下dataIndex待确认
      columns: [
        {title: '序号', dataIndex: 'id', render: (value, record, index) => index + 1 + this.state.pageSize * this.state.page},
        {title: '工号', dataIndex: 'employeeID'},
        {title: '姓名', dataIndex: 'fullName'},
        {title: '法人实体', dataIndex: 'corporationName'},
        {title: '部门', dataIndex: 'department'},
        {title: '职务', dataIndex: 'title'}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      allCanSee: true, //全员可见
    };
  }

  componentWillMount(){

  }

  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.setState({ loading: true });
        let url = `${config.baseUrl}/api/custom/enumerations/items`;
        httpFetch.post(url, values).then(res => {
          if(res.status === 200) {
            this.setState({ loading: false });
            message.success('保存成功');
            this.props.close(true);
          }
        }).catch(e => {
          this.setState({ loading: false });
          message.error(`保存失败，${e.response.data.message}`)
        })
      }
    })
  };

  onCancel = () =>{
    this.props.close();
  };

  //全员是否可见修改
  handleRightChange = (checked) => {
    this.setState({ allCanSee: checked })
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { loading, columns, data, allCanSee } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="new-value">
        <Form onSubmit={this.handleSave}>
          <div className="common-item-title">基本信息</div>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('enabled', {
              initialValue: true
            })(
              <Switch defaultChecked={true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="值名称">
            {getFieldDecorator('messageKey', {
              rules: [{
                required: true,
                message: '请输入值名称',
              },{
                max: 100,
                message: '值名称最多100个字符',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入值名称，最多100个字符" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="编码">
            {getFieldDecorator('value', {
              rules: [{
                required: true,
                message: '请输入值编码',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              rules: [{
                max: 200,
                message: '值名称最多200个字符',
              }],
              initialValue: ''
            })(
              <Input placeholder="请输入，最多200个字符" />
            )}
          </FormItem>
          <div className="common-item-title">数据权限</div>
          <FormItem {...formItemLayout} label="全员可见">
            {getFieldDecorator('common', {
              initialValue: true
            })(
              <Switch defaultChecked={true}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      onChange={this.handleRightChange}/>
            )}
          </FormItem>
          {!allCanSee && (
            <div>
              <div className="table-header">
                <div className="table-header-buttons">
                  <Button type="primary">按组织添加员工</Button>
                  <Button type="primary">按条件添加员工</Button>
                </div>
              </div>
              <Table rowKey="id"
                     dataSource={data}
                     columns={columns}
                     bordered
                     size="middle" />
            </div>
          )}
          <div className="slide-footer">
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedValueList = Form.create()(ValueList);

export default connect(mapStateToProps)(WrappedValueList);
