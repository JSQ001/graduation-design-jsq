/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Form,Input,Switch,Icon} from 'antd';
const FormItem = Form.Item;

import Chooser from  'components/Chooser';
import ListSelector from 'components/list-selector.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import "styles/budget/budget-journal/new-budget-journal.scss"

class NewBudgetJournalFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled:false,
      showListSelector:false,
      organization:{},
      organizationId:{organizationId:''},
      listType:'',
      listExtraParams: {},
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail','key'),    //预算日记账详情
      structureGroup:[],
      fromData:{ periodYear:'',}


    };
  }



  //跳转到预算日记账详情
  handleLastStep=(value)=>{
    const data =value;
    console.log(value);
    let valueData ={
      ...value,
      'organizationId':this.state.organization.id,
      'organizationName':this.state.organization.organizationName,
      'employeeName':this.props.user.fullName,
      'employeeId':this.props.user.userOID,
      'companyOID':this.props.company.companyOID,
      'companyName':this.props.user.companyName,
      'journalTypeName':value.journalTypeName[0].value.journalTypeName,
      'journalTypeId':value.journalTypeName[0].value.journalTypeId,
      'structureId':value.structureId,
      'structureName':undefined,
      'versionId':value.versionName[0].value.versionName,
      'versionName':value.versionName[0].value.id,
      'scenarioId':value.scenarioName[0].value.scenarioName,
      'scenarioName':value.scenarioName[0].value.id,


    }
    console.log(valueData);
    console.log("123123")

    let userData ={
      "dto" :
        {
          "companyId":this.props.company.companyOID,
          "companyName":this.props.user.fullName,
          "organizationId":this.state.organization.id,
          "organizationName":this.state.organization.organizationName,
          "structureId":value.structureId,
          "structureName":"structureName",
          "periodYear": "2017",
          "periodQuarter": "1",
          "periodName": "11",
          "description": "1111",
          "reversedFlag":"N",
          "sourceBudgetHeaderId":undefined,
          "sourceType":undefined,
          "employeeId":this.state.organization.id,
          "employeeName":this.state.organization.organizationName,
          "periodNumber": "2",
          "unitId": "683edfba-4e52-489e-8ce4-6e820d5478b2",
          "unitName":"periodNumber",
          'versionId':value.versionName[0].value.id,
          'versionName':value.versionName[0].value.versionName,
          'scenarioId':value.scenarioName[0].value.id,
          'scenarioName':value.scenarioName[0].value.scenarioName,
          "status":"NEW",
          "journalTypeId":value.journalTypeName[0].value.journalTypeId,
          "journalTypeName":value.journalTypeName[0].value.journalTypeName,
          "versionNumber":"1"
        }
      ,
      "list":[]
    }
    console.log(userData)

    this.saveHeard(userData);





  }

  //保存日记账头
  saveHeard=(value)=>{
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`,value).then((request)=>{
      console.log(request.data)
      let path=this.state.budgetJournalDetailPage.url.replace(":journalCode",request.data.dto.journalCode);
      this.context.router.push(path);
    })
  }




  //处理表单数据
  handleFrom=(e)=>{
    e.preventDefault();
    let value =this.props.form.getFieldsValue();

    console.log("11111111111111111")
    console.log(value);

    this.handleLastStep(value);
  }




  //获得预算组织
  getOrganization=()=>{
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/organization/by/login`).then((request)=>{
      console.log(request.data)
      const data ={
        'organizationId':request.data.id
      }
      this.setState({
        organization:request.data,
        organizationId:data,
      })
    })
  }

  componentWillMount(){
    this.getOrganization()

  }

  handleFocus = (Type) => {
    this.refs.blur.focus();
    this.showList(Type)
    console.log(Type)
  };


  //list-selector取消
  handleListCancel=()=>{
    this.setState({
      showListSelector:false
    })
  }


  //选择预算日记账类型，设置对应的预算表选
  handleJournalTypeChange=(values)=>{
     console.log(values)
    let value = values[0].value

    this.getStructure(value.journalTypeId)

  }


  //根据账套类型，获得预算表
  getStructure(value){
    httpFetch.get(`${config.budgetUrl}/api/budget/journal/type/assign/structures/queryStructureId?journalTypeId=${value}`).then(req=>{
      console.log(req.data);
      this.setState(
        {structureGroup:req.data}
      )
    })
  }


  //选择预算表时，获得年度和期间段
  handleSelectChange=(values)=>{

    this.state.structureGroup.map((item)=>{
      if(item.id=values){
        this.props.form.setFieldsValue({
          periodYear:item.periodYear ,
          periodStrategy:item.periodStrategy

        });
      }
    });




  }


  scenarioChange=(value)=>{
    console.log(value);

  }



  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEnabled,organization, listSelectedData,showListSelector,listType,listExtraParams,selectorItem,structureGroup} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    let strategyOptions = structureGroup.map((item)=><Option key={item.id} >{item.structureName}</Option>);

    return (
      <div className="new-budget-journal">
        <Form onSubmit={this.handleFrom} style={{width:'55%',margin:'0 auto'}}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalCode"})} >
            {getFieldDecorator('journalCode', {
              rules: [{
              }],
              initialValue: '-'
            })(
              <Input  disabled={true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.employeeId"})} >
            {getFieldDecorator('employeeId', {
              rules: [{
                required: true,
                message: '',
              }],
              initialValue:this.props.user.fullName
            })(
              <Input  disabled={true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.organization"})} >
            {getFieldDecorator('organizationName', {
              rules: [{
                required: true,
                message: '',
              }],
              initialValue:organization.organizationName
            })(
              <Input  disabled={true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.companyId"})} >
            {getFieldDecorator('companyId', {
              rules: [{
                required: true,
                message: '',
              }],
              initialValue: this.props.company.name
            })(
              <Input  disabled={true} />
            )}
          </FormItem>

         <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalTypeId"})} >
            {getFieldDecorator('journalTypeName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"journalTypeName"})
              }],

            })(
              <Chooser
              type='budget_journal_type'
              labelKey='journalTypeName'
              valueKey='journalTypeId'
              listExtraParams={this.state.organizationId}
              onChange={this.handleJournalTypeChange}
              />

            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.structureId"})} >
            {getFieldDecorator('structureId', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"预算表"})
              }],

            })(

              <Select onSelect={this.handleSelectChange} >
                {strategyOptions}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.periodYear"})} >
            {getFieldDecorator('periodYear', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"年度"})
              }],

            })(

              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.periodStrategy"})} >
            {getFieldDecorator('periodStrategy', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"期段"})
              }],

            })(

              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.version"})} >
            {getFieldDecorator('versionName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"versionId"})
              }],

            })(
              <Chooser
                type='budget_versions'
                labelKey='versionName'
                valueKey='id'
                listExtraParams={this.state.organizationId}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.scenarios"})} >
            {getFieldDecorator('scenarioName', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"scenarioId"})
              }],

            })(

              <Chooser
              type='budget_scenarios'
              labelKey='scenarioName'
              valueKey='id'
              listExtraParams={this.state.organizationId}
             />

            )}
          </FormItem>


          <FormItem wrapperCol={{ offset: 7 }}>
            <Button type="primary" htmlType="submit" loading={this.state.loading} style={{marginRight:'10px'}}>下一步</Button>
            <Button>取消</Button>
          </FormItem>
        </Form>

        <div>

        </div>
      </div>
    )
  }

}


NewBudgetJournalFrom.contextTypes ={
  router: React.PropTypes.object
}


const NewBudgetJournal = Form.create()(NewBudgetJournalFrom);

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company,
  }

}

export default connect(mapStateToProps)(injectIntl(NewBudgetJournal));
