/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Button, notification, Icon, Badge, Row, Col, Input, Switch, Dropdown, Alert, Modal, Upload } from 'antd';
import config from 'config'
import 'styles/budget/budget-versions/budget-versions-detail.scss'


class BudgetVersionsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      columns :[{
        title: '公司代码',
        dataIndex: 'companyCode',
        key: 'companyCode',
      },  {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },{
        title: '公司类型',
        dataIndex: 'companyType',
        key: 'companyType',
      },
        {
          title: '启用',
          dataIndex: 'isEnabled',
          key: 'isEnabled',
        }],

      pagination: {
        total: 0
      },
      showImportFrame: false,
      form: {
        name: '',
        enabled: '',
      },
      edit:false
    }
  }

  renderForm=()=>{
    const data =this.props.location.state.Date;
    console.log(data)
    return(
      <div>
        <Row gutter={40}>
          <Col>
            <div className="form-title">预算组织</div>
            <div>{}</div>
          </Col>
          <Col>
            <div className="form-title">预算版本代码</div>
            <div>{}</div>
          </Col>
          <Col>
            <div className="form-title">预算版本名称</div>
            <div>{}</div>
          </Col>

        </Row>
    </div>
    )

  }

  handleEdit=()=>{

  }

  render(){
    const {  edit, data, columns, pagination, showImportFrame, form } = this.state;
    return (
      <div>
        <div className="budget-versions-detail">
          <div className="common-help">
            <Alert
              message="帮助提示"
              description="一个预算组织下的版本代码不可重复，一个预算组织下只能有一个当前版本，一个预算组织下允许多个预算版本同时生效。"
              type=""
              showIcon
            />
          </div>

          <div className="common-top-area">
            <div className="common-top-area-title">
              基本信息
              {!edit ? <span className="title-edit" onClick={this.handleEdit}>编辑</span> : null}
            </div>
            <div className="common-top-area-content form-title-area">
              {this.renderForm()}
            </div>
          </div>

          <div className="table-header">
            <div className="table-header-title">{`共 ${data.length} 条数据`}</div>
            <div className="table-header-buttons">
              <Button>分配公司</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered/>


          <Modal visible={showImportFrame} title="值导入" onCancel={() => this.showImport(false)} onOk={this.handleImport}>
            <Upload.Dragger name="files" className="uploader">
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或拖拽文件上传</p>
            </Upload.Dragger>
          </Modal>

        </div>
      </div>
    )
  }

}



function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetVersionsDetail));
