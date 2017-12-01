/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button, Col, Row, Select, Form, Input, message, Card} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import Chooser from  'components/Chooser';
import UploadFile from 'components/upload.js'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import "styles/budget/budget-journal/new-budget-journal.scss"

class NewBudgetJournalFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail', 'key'),    //预算日记账详情
      budgetJournalPage: menuRoute.getRouteItem('budget-journal', 'key'),    //预算日记账
      idSelectJournal: false,
      isStructureIn: false,
      defaultValueList:{},
      defaultDataList:[
        {type:'chooser',event:'versionName',defaultValueKey:'versionName',
          url:`${config.budgetUrl}/api/budget/versions/query?status=CURRENT&organizationId=${this.props.organization.id}`},
        {type:'chooser',event:'scenarioName',defaultValueKey:'scenarioName',
          url:`${config.budgetUrl}/api/budget/scenarios/query?defaultFlag=true&organizationId=${this.props.organization.id}`}
      ],
      structureGroup: [],
      periodStrategy: [],
      periodPeriodQuarter: [],
      periodPeriod: [],
      structureFlag: true,
      periodFlag: true,
      periodYearFlag: true,
      periodQuarterFlag: true,
      periodStrategyFlag: true,
      journalTypeIdFlag:true,
      file: {},
      attachmentOID: [],
      formOid:null,
      documentOid:null
    };
  }



  componentWillMount() {
    this.getPeriodStrategy();
    this.getDefaultValue();
  }

  //获取表单默认值
  getDefaultValue(){
    let defaultValueList =  this.state.defaultValueList;
    let defaultDataList = this.state.defaultDataList;
    defaultDataList.map((item)=>{
      console.log(item);
      httpFetch.get(item.url).then((res)=>{
        let data=res.data;
        console.log(data);
        if(item.type === "chooser"){
          defaultValueList[item.defaultValueKey]=data;
          console.log(defaultDataList);
          this.props.from.setFieldsValue(
            defaultValueList
          )
        }
      }).catch((e)=>{

      })
    })
    console.log(defaultValueList);
  }



  //获取编制期段
  getPeriodStrategy = () => {
    this.getSystemValueList(2002).then((response) => {
      console.log(response.data);
      let periodStrategy = [];
      response.data.values.map((item) => {
        let option = {
          key: item.code,
          label: item.messageKey
        };
        periodStrategy.push(option);
      });
      this.setState({
        periodStrategy: periodStrategy,
      })
    });
  };


  //保存日记账头
  saveHeard = (value) => {
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`, value).then((response) => {
      let path = this.state.budgetJournalDetailPage.url.replace(":journalCode", response.data.dto.journalCode);
      this.context.router.push(path);
    })
  };


  //处理表单数据
  handleFrom = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        let formOid =null;
        let documentType =null;
   /*     httpFetch.get(`${config.budgetUrl}/api/budget/journal/types/${value.journalTypeName[0].id}`).then((res)=>{
          console.log(123);
          console.log(res.data);
            formOid = res.data.formOid;
            documentOid =res.data.documentOid;
        })*/
        //${config.budgetUrl}/api/budget/journals/journalType/selectByInput
        ///api/budget/journal/types/query

        let userData = {
          "dto": {

             "companyId": this.props.company.id,
             "companyName": this.props.company.name,
             "organizationId": this.props.organization.id,
             "organizationName": this.props.organization.organizationName,
             "structureId": value.structureId,
             "structureName": "structureName",
             "description": "",
             "reversedFlag": "N",
             "sourceBudgetHeaderId": undefined,
             "sourceType": undefined,
             "employeeId": this.props.user.id,
             "employeeName": this.props.user.fullName,
             "unitName": "periodNumber",
             'versionId': value.versionName[0].id,
             'versionName': value.versionName[0].versionName,
             'scenarioId': value.scenarioName[0].id,
             'scenarioName': value.scenarioName[0].scenarioName,
             "status": "NEW",
             "journalTypeId": value.journalTypeName[0].id,
             "journalTypeName": value.journalTypeName[0].journalTypeName,
             "periodStrategy": value.periodStrategy,
             "versionNumber": "1",
             "attachmentOID": this.state.attachmentOID,
             "formOid":this.state.formOid,
             "documentType":this.state.documentOid
          }
          ,
          "list": []
        };
        console.log(userData);
        this.saveHeard(userData);
      }
    })
  };


  //根据预算日记账类型，获得预算表
  getStructure(value) {
    console.log(value);

    console.log(666);
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/selectByJournalTypeAndCompany?companyId=${this.props.company.id}&journalTypeId=${value}`).then(response => {
      console.log(response.data);
      response.data.map((item)=>{
        item.key=item.id;
      })
      console.log(response.data);
      this.setState(
        {"structureGroup": response.data},()=>{
          console.log(this.state.structureGroup);
        }
      )
    })
    let structureId = null;
    httpFetch.get(`${config.budgetUrl}/api/budget/journal/type/assign/structures/queryDefaultStructure?journalTypeId=${value}`).then(response => {
      console.log(response.data);
        if(response.data){
          structureId =  response.data.id;
          console.log(structureId);
          this.props.form.setFieldsValue({
            "structureId":structureId,
            "periodStrategy":response.data.periodStrategy
          })
        }
    })

    this.getFormOid(value);

  }

  getFormOid(value){
    let formOid =null;
    let documentOid =null;
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/journalType/selectByInput?&page=0&size=50&organizationId=${this.props.organization.id}`).then((res)=>{

      res.data.map((item)=>{
        if(item.id == value){
          console.log(555);
          formOid = item.form0id;
          documentOid = item.formType;
          console.log(formOid);
          console.log(documentOid);
          this.setState({
            formOid,
            documentOid
          })
        }
      })
    })
  }


  //选择预算表时，获得期间段
  handleSelectChange = (values) => {
    console.log(values);
    this.state.structureGroup.map((item) => {
      if (item.id == values) {
        const periodStrategy = item.periodStrategy;
        this.props.form.setFieldsValue({
          periodStrategy: periodStrategy,
        });
      }
    });

  };

  //取消
  HandleClear = () => {
    let path = this.state.budgetJournalPage.url;
    this.context.router.push(path);
  };


  //选择预算日记账类型，设置对应的预算表选
  handleJournalType = (value) => {

    console.log(value);
    if (value.length > 0) {
      console.log(value);
     let valueData = value[0];
      this.setState({
        idSelectJournal: true,
        structureFlag: false
      });
      this.props.form.setFieldsValue({
        structureId: ''
      });

      this.getStructure(valueData.id);
    }

  };

  getjournalTypes(value){
    httpFetch.get(`${config.budgetUrl}/api/budget/journal/types/${value}`).then((res)=>{
          console.log(res.data);
          let formOid = res.data.formOid;
          let documentOid =res.data.documentOid;
      })
  }


  //上传附件，获取OID
  uploadHandle = (value) => {
    console.log(value);
    this.setState({
      attachmentOID: value
    })
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const organization = this.props.organization;
    const {structureGroup, periodStrategy, structureFlag, periodStrategyFlag, uploading} = this.state;
    const formItemLayout = {};


    const strategyOptions = structureGroup.map((item) => <Option value={String(item.id)}>{item.structureName}</Option>);
    const periodStrategyOptions = periodStrategy.map((item) => <Option key={item.key} value={item.key}>{item.label}</Option>);

    return (
      <div className="new-budget-journal">
        <div className="budget-journal-title">
          <div><h1>预算日记账</h1></div>
          <div className="budget-journal-title-detail">用于预算录入，提交审批</div>
        </div>
        <div className="divider"> </div>
        <Form onSubmit={this.handleFrom} style={{}}>
          <Card title="基本信息"  style={{with: "100%"}}>
            <Row gutter={40} type="flex" align="top">
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.journalCode"})}>
                  {getFieldDecorator('journalCode', {
                    rules: [{}],
                    initialValue: '-'
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.employeeId"})}>
                  {getFieldDecorator('employeeId', {
                    rules: [{
                      required: true,
                      message: '',
                    }],
                    initialValue: this.props.user.fullName
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.organization"})}>
                  {getFieldDecorator('organizationName', {
                    rules: [{
                      required: true,
                      message: '',
                    }],
                    initialValue: organization.organizationName
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.companyId"})}>
                  {getFieldDecorator('companyId',{
                    rules: [{
                      required: true,
                      message: 'this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"journalTypeName"}',
                    }],
                    initialValue: this.props.company.name
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.unitId"})}>
                  {getFieldDecorator('departmentName',{
                    rules: [{
                      required: true,
                      message: '',
                    }],
                    initialValue: this.props.user.departmentName
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="divider"> </div>
          <Card title="预算信息"  style={{with: "100%"}}>
            <Row gutter={40} type="flex" align="top">
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.journalTypeId"})}>
                  {getFieldDecorator('journalTypeName', {
                    rules: [{
                      required: true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "journalTypeName"})
                    }]
                  })(
                    <Chooser
                      type='budget_journal_type'
                      labelKey='journalTypeName'
                      valueKey='id'
                      single={true}
                      listExtraParams={{"organizationId": this.props.organization.id}}
                      onChange={this.handleJournalType}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.structureId"})}
                >
                  {getFieldDecorator('structureId', {
                    rules: [{
                      required: true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "预算表"})
                    }],

                  })(
                    <Select onSelect={this.handleSelectChange} disabled={structureFlag}>
                      {strategyOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.periodStrategy"})}>
                  {getFieldDecorator('periodStrategy', {
                    rules: [{
                      required: true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "编制期段"})
                    }],

                  })(
                    <Select disabled={periodStrategyFlag}>
                      {periodStrategyOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>


              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.version"})}>
                  {getFieldDecorator('versionName', {
                    rules: [{
                      required:true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "预算版本"})
                    }],
                    valuePropName:"value",
                    initialValue:this.state.defaultValueList["versionName"],
                  })(
                   <Chooser
                      type='budget_versions'
                      labelKey='versionName'
                      valueKey='id'
                      single={true}
                      listExtraParams={{"organizationId": this.props.organization.id,"isEnabled":true}}
                    />
                  )}
                </FormItem>
              </Col>

              {/*${config.budgetUrl}/api/budget/scenarios/query*/}
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.scenarios"})}>
                  {getFieldDecorator('scenarioName', {
                    rules: [{
                      required:true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "预算场景"})
                    }],
                    valuePropsName:"value",
                    initialValue:this.state.defaultValueList["scenarioName"],


                  })(
                    <Chooser
                      type='budget_scenarios'
                      labelKey='scenarioName'
                      valueKey='id'
                      single={true}
                      listExtraParams={{"organizationId": this.props.organization.id}
                  }

                    />
                  )}
                </FormItem>
              </Col>

            </Row>
          </Card>
          <div className="divider" style={{height:16}}> </div>
          <Card title="附件信息" style={{with: "100%"}}>
            <Row gutter={40} type="flex" align="top">
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="附件"
                >
                  <div className="dropbox">
                    {getFieldDecorator('file', {})(
                      <UploadFile
                        attachmentType="BUDGET_JOURNAL"
                        fileNum={5}
                        uploadHandle={this.uploadHandle}
                      />
                    )}
                  </div>

                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="divider" style={{height:16}}> </div>

          <div className="footer-operate">
            <Button type="primary" htmlType="submit" loading={this.state.loading}
                    style={{marginRight: '10px'}}>下一步</Button>
            <Button style={{marginRight: '10px'}} onClick={this.HandleClear}>取消</Button>

          </div>
        </Form>
      </div>
    )
  }

}


NewBudgetJournalFrom.contextTypes = {
  router: React.PropTypes.object
};


const NewBudgetJournal = Form.create()(NewBudgetJournalFrom);

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company,
    organization: state.login.organization

  }

}

export default connect(mapStateToProps)(injectIntl(NewBudgetJournal));
