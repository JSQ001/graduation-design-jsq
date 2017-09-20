/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Button, notification, Icon, Badge, Row, Col, Input, Switch, Dropdown, Alert, Modal, Upload} from 'antd';
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/budget/budget-versions/budget-versions-detail.scss'


class BudgetVersionsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [{
        title: '公司代码',
        dataIndex: 'companyCode',
        key: 'companyCode',
      }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      }, {
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
      edit: false,
      formData: {}
    }

  }

  componentWillMount(){
    this.setState ({
      formData:this.props.location.state.Data
    })

  }


  //修改
  putData(value){
    return httpFetch.put(`${config.budgetUrl}/api/budget/versions`,value).then((response)=>{
      this.setState({

      })
    });
  }

  versionNameChangHandle=(event)=>{
    let Name =event.target.value;
    this.state.formData.versionName =Name;
  }

  statusChangHandle=(value)=>{
    this.state.formData.status=value;
  }

  versionsDataChangHandle=(date)=>{
    console,log("333333333333333");
    console.log(date);
  }

  descriptionChangHandle=(event)=>{
    this.state.formData.description=event.target.value;
  }

  isEnabledChangHandle=(value)=>{
    this.state.formData.isEnabled=value
  }

  fff=(status)=>{
    console.log(status);
  }


  saverHandle=()=>{
    console.log(this.state.formData);
    let value = this.state.formData;
    this.putData(value)

  }

  renderPutForm=()=>{
    const fromData =this.props.location.state.Data;

    return (
      <Form >
        <Row gutter={40}>
          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              label="预算版本代码"
              labelCol={{span:8}}
              wrapperCol={{span:16}}
            >
              <Input  disabled={true} defaultValue={fromData.versionCode} />
            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem label="预算版本名称"
                      labelCol={{span:8}}
                      wrapperCol={{span:16}}
            >
              <Input defaultValue={fromData.versionName} onBlur={this.versionNameChangHandle}/>

            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              label="状态"
              labelCol={{span:8}}
              wrapperCol={{span:16}}
            >

              <Select
                placeholder=""
                defaultValue={fromData.status}
                onSelect={this.statusChangHandle}
                /*onChange={this.handleSelectChange}*/
              >
                <Select.Option value="NEW">新建</Select.Option>
                <Select.Option value="CURRENT">当前</Select.Option>
                <Select.Option value="HISTORY">历史</Select.Option>
              </Select >

            </FormItem>
          </Col>


          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem label="预算版本描述"
                      labelCol={{span:8}}
                      wrapperCol={{span:16}}
            >

              <Input type="textarea" defaultValue={fromData.description} onBlur={this.descriptionChangHandle} />
            </FormItem>
          </Col>


          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              labelCol={{span:8}}
              wrapperCol={{span:16}}
              label="是否启用"
            >
              <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={fromData.isEnabled} onChange={this.isEnabledChangHandle}/>

            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16}}
              label="版本日期"
            >

              <DatePicker  defaultValue={moment( fromData.versionDate, 'YYYY-MM-DD')} onOpenChange={this.fff} onChang={this.versionsDataChangHandle}/>

            </FormItem>
          </Col>

        </Row>


      </Form>

    );
  }


  renderForm=()=>{
    console.log(this.props.Location)
    console.log(this.props.location)
    const data = this.props.location.state.Data;
    return(
     this.state.edit? <div>
        this.renderPutForm();
      </div>:
      <div>
        <Row gutter={40} align="top">
          <Col span={8}>
            <div className="form-title">预算组织:</div>
            <div>{}</div>
          </Col>
          <Col span={8}>
            <div className="form-title">预算版本代码:</div>
            <div>{data.versionCode}</div>
          </Col >
          <Col span={8}>
            <div className="form-title">版本日期:</div>
            <div>{data.versionDate}</div>
          </Col>
        </Row>
        <Row gutter={40} align="top">
          <Col span={8}>
            <div className="form-title">版本状态:</div>
            <div>{ data.status=="NEW"?"新建":(data.status="CURRENT"?"当前":"历史")}</div>
          </Col>
          <Col span={8}>
            <div className="form-title">预算版本名称:</div>
            <div>{data.versionName}</div>
          </Col>
          <Col span={8}>
            <div className="form-title">预算版本描述:</div>
            <div>{data.description}</div>
          </Col>
        </Row>
        <Row gutter={40} align="top">
          <Col span={8}>

            <div className="form-title">状态:</div>
            <div> <Badge status={data.isEnabled?'success':'error'}/>{data.isEnabled?'启用':'禁用'}</div>
          </Col>

        </Row>

    </div>
    )

  }

  handleEdit = () => {
    this.setState({edit: true})
  };

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
