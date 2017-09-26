/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Button, notification, Icon,Checkbox, Badge, Row, Col, Input, Switch, Dropdown, Alert, Modal, Upload,Select,DatePicker,message} from 'antd';
import moment from 'moment'
import config from 'config'
import httpFetch from 'share/httpFetch'
import CompanySelect from 'components/selector/company-selector'
import 'styles/budget/budget-versions/budget-versions-detail.scss'
const FormItem =Form.Item;

class BudgetVersionsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [{
        title: '公司代码', dataIndex: 'companyCode', key: 'companyCode',},
        {title: '公司名称', dataIndex: 'companyName', key: 'companyName',},
        {title: '公司类型', dataIndex: 'companyType', key: 'companyType',},
        {title: '启用', dataIndex: 'isEnabled', key: 'isEnabled',
          render:(text,recode)=>{return <Checkbox defaultChecked={recode?true:false} onChange={this.isEnabledEditHandle(text,recode)}  />}

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
      formData:this.props.location.state.Data,
      loading:true,
      newAssignCompanyDate:[],
      putAssignCompanyDate:[],
      page:0,
      pageSize:10

    }

  }

//编辑启用
  isEnabledEditHandle=(text,recode)=>{
    if(text.id){}

  }

  componentWillMount(){
    this.getAssignCompanyList();
    console.log(this.state.formData.id)
  }


  AssignCompanyHandle=()=>{

  }


  //查询分配公司表
  getAssignCompanyList=()=>{
    httpFetch.get(`${config.budgetUrl}/api/budget/version/assign/companies/query?versionId=${this.state.formData.id}&page=${this.state.page}&size=${this.state.pageSize}`).then((res)=>{
      this.setState({loading: false ,data:res.data});
    }).catch((e)=>{
      if(e.response){
        message.error(`查询失败,${e.response.data.validationErrors[0].message}`);
        this.setState({loading: false});
      } else {
        console.log(e)
      }
    })

  }



  //修改预算版本
  putData(value){
    return httpFetch.put(`${config.budgetUrl}/api/budget/versions`,value).then((response)=>{
      this.setState({
        formData:response.data,
        edit:false,
      })

      message.success("编辑成功");
    }).catch((e)=>{
      if(e.response){
        console.log(e.response.data);
        message.success(`编辑失败,${e.response.data.validationErrors[0].message}`);
      }
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
    console.log(date);
  }

  descriptionChangHandle=(event)=>{
    this.state.formData.description=event.target.value;
  }

  isEnabledChangHandle=(value)=>{
    this.state.formData.isEnabled=value
  }


  saveHandle=()=>{
    console.log(this.state.formData);
    let value = this.state.formData;
    this.putData(value)

  }


  renderPutForm=()=>{
    const fromData =this.props.location.state.Data;
    this.getAssignCompanyList();
    return (
      <Form >
        <Row gutter={40}>
          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              label="预算组织"
              labelCol={{span:24}}
              wrapperCol={{span:24}}
            >
              <Input  disabled={true} defaultValue={this.props.organization.organizationName} />
            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              label="预算版本代码"
              labelCol={{span:24}}
              wrapperCol={{span:24}}
            >
              <Input  disabled={true} defaultValue={fromData.versionCode} />
            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem label="预算版本名称"
                      labelCol={{span:24}}
                      wrapperCol={{span:24}}
            >
              <Input defaultValue={fromData.versionName} onBlur={this.versionNameChangHandle}/>

            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              label="状态"
              labelCol={{span:24}}
              wrapperCol={{span:24}}
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
                      labelCol={{span:24}}
                      wrapperCol={{span:24}}
            >

              <Input  defaultValue={fromData.description} onBlur={this.descriptionChangHandle} />
            </FormItem>
          </Col>

          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24}}
              label="版本日期"
            >

              <DatePicker  style={{width:315}} defaultValue={moment( fromData.versionDate, 'YYYY-MM-DD')}  onChang={this.versionsDataChangHandle}/>

            </FormItem>
          </Col>



          <Col span={8} style={{ display: 'inline-block'}}>
            <FormItem
              labelCol={{span:24}}
              wrapperCol={{span:24}}
              label="是否启用"
            >
              <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={fromData.isEnabled} onChange={this.isEnabledChangHandle}/>

            </FormItem>
          </Col>


        </Row>

        <Row gutter={24}>
          <Col span={8} style={{ display: 'inline-block'}}>
            <Button type="primary" onClick={this.saveHandle}>保 存</Button>
          </Col>
        </Row>


      </Form>

    );
  }


  renderForm=()=>{
    const data = this.state.formData;
    return(
     this.state.edit? <div>
       {this.renderPutForm()}
      </div>:
      <div>
        <Row gutter={40} align="top">
          <Col span={8}>
            <div className="form-title">预算组织:</div>
            <div>{this.props.organization.organizationName}</div>
          </Col>
          <Col span={8}>
            <div className="form-title">预算版本代码:</div>
            <div>{data.versionCode}</div>
          </Col >
          <Col span={8}>
            <div className="form-title">版本日期:</div>
            <div>{data.versionDate?data.versionDate:"-"}</div>
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
            <div>{data.description?data.description:'-'}</div>
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

  showImport=(value)=>{
    this.setState({showImportFrame:value})
  }


  versionDateChangeHandle=()=>{
    this.versionAssignCompany(this.state.newAssignCompanyDate);
  }

  //保存新建分配公司
  versionAssignCompany=(values)=>{
    httpFetch.post(`${config.budgetUrl}/api/budget/version/assign/companies/batch`, values).then((res)=>{
      message.success(`分配公司成功`);
    }).catch((e)=>{
      if(e.response){
        message.error(`分配公司失败,${e.response.data.validationErrors[0].message}`);
      } else {
        console.log(e)
      }
    })
  }


//分配公司确定
  submitHandle=(value)=>{
    const data = this.props.location.state.Data;
    const isEnabled = true;
    value.versionId=data.id;
    value.isEnabled=isEnabled;
    console.log(value)
    this.setState({
      data:value,
      newAssignCompanyDate:value

    })

    this.showImport(false)
  }

  CancelHandle=()=>{
    this.showImport(false)
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
              <Button type="primary" onClick={() => this.showImport(true)}>分配公司</Button>
              <Button onClick={this.versionDateChangeHandle}>保 存</Button>
            </div>
          </div>
          <Table columns={columns}
                 dataSource={data}
                 pagination={pagination}
                 bordered
                 size="middle"
          />

            <CompanySelect  visible={this.state.showImportFrame} submitHandle={this.submitHandle} onCancel={this.CancelHandle}/>

        </div>
      </div>
    )
  }

}



function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(BudgetVersionsDetail));
