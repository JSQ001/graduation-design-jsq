import React from 'react'
import { injectIntl } from 'react-intl'
import {connect} from 'react-redux'
import menuRoute from 'share/menuRoute'
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, Card, Row, Col, Input, Affix, Button, Table, message } from 'antd'
const FormItem = Form.Item;

import Importer from 'components/importer'

class NewBudgetOccupancy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableLoading: false,
      user: {},
      columns: [
        {title: '序号', dataIndex: 'index', width: '7%', render: (value, record, index) => index + 1},
        {title: '公司', dataIndex: 'companyCodeName'},
        {title: '预算期间', dataIndex: 'periodName'},
        {title: '部门', dataIndex: 'unitCodeName'},
        {title: '预算项目', dataIndex: 'itemCodeName'},
        {title: '成本中心1', dataIndex: '5'},
        {title: '成本中心2', dataIndex: '6'},
        {title: '成本中心3', dataIndex: '7'}
      ],
      data: [],
      page: 0,
      pageSize: 10,
      pagination: {
        total: 0
      },
      budgetOccupancy:  menuRoute.getRouteItem('budget-occupancy','key'),    //预算占用调整
    }
  }

  componentWillMount() {
    this.setState({ user: this.props.user });
  }

  //获取导入数据
  getList = () => {
    const { page, pageSize } = this.state;
    let url = `${config.budgetUrl}/api/budget/reserve/adjust/import/data?page=${page}&size=${pageSize}`;
    this.setState({ tableLoading: true });
    httpFetch.get(url).then(res => {
      if (res.status === 200) {
        this.setState({
          data: res.data,
          tableLoading: false
        })
      }
    })
  };

  //最终确认
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {
          reserveAdjustInfo: {
            batchNumber: 1,
            remark: values.remark
          },
          reserveAdjustImports: this.state.data
        };
        let url = `${config.budgetUrl}/api/budget/reserve/adjust/import/final/confirmation`;
        this.setState({ loading: true });
        httpFetch.post(url, params).then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
            message.success('保存成功');
            this.handleBack()
          }
        }).catch(e => {
          this.setState({ loading: false });
          message.success(`保存失败，${e.response.data.message}`);
        })
      }
    })
  };

  //导入成功回调
  handleImportOk = () => {
    this.getList()
  };

  //返回
  handleBack = () => {
    this.context.router.replace(this.state.budgetOccupancy.url);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, tableLoading, user, pagination, columns, data } = this.state;
    return (
      <div className="new-budget-occupancy background-transparent" style={{marginBottom:40}}>
        <Form onSubmit={this.handleSave}>
          <Card title="基本信息" hoverable={false} style={{marginBottom:'20px'}}>
            <Row>
              <Col span={7}>
                <div style={{lineHeight: '32px'}}>导入批次号：</div>
                <Input value="-" disabled />
              </Col>
              <Col span={7} offset={1}>
                <div style={{lineHeight: '32px'}}>创建人：</div>
                <Input value={user.fullName + ' - ' + user.employeeID} disabled />
              </Col>
              <Col span={7} offset={1}>
                <div style={{lineHeight: '32px'}}>导入日期：</div>
                <Input value={new Date().format('yyyy-MM-dd')} disabled />
              </Col>
            </Row>
            <Row>
              <Col span={15} style={{marginTop:20}}>
                <FormItem label="导入说明">
                  {getFieldDecorator('remark', {
                    rules: [{
                      required: true,
                      message: '请输入'
                    }]
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="导入数据" hoverable={false}>
            <div style={{marginBottom:10}}>共搜索到 {pagination.total} 条数据</div>
            <Table rowKey={record => record.id}
                   columns={columns}
                   dataSource={data}
                   loading={tableLoading}
                   bordered
                   size="middle"/>
          </Card>
          <Affix offsetBottom={0}
                 style={{position:'fixed',bottom:0,marginLeft:'-35px', width:'100%', height:50, zIndex:1,
                   boxShadow:'0px -5px 5px rgba(0, 0, 0, 0.067)', background:'#fff',lineHeight:'50px', paddingLeft:20}}>
            <Importer title="预算导入"
                      templateUrl={`${config.budgetUrl}/api/budget/reserve/adjust/import`}
                      // uploadUrl={`${config.budgetUrl}/api/budget/reserve/adjust/import`}
                      uploadUrl={`${config.budgetUrl}/api/budget/reserve/adjust/import?employeeId=174342`}
                      fileName="预算占用调整导入文件"
                      onOk={this.handleImportOk}/>
            <Button htmlType="submit" loading={loading} style={{marginLeft:20}}>最终确认</Button>
            <Button onClick={this.handleBack} style={{marginLeft:50}}>返 回</Button>
          </Affix>
        </Form>
      </div>
    )
  }
}

NewBudgetOccupancy.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

const wrappedNewBudgetOccupancy = Form.create()(injectIntl(NewBudgetOccupancy));

export default connect(mapStateToProps)(wrappedNewBudgetOccupancy)
