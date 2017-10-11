/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Form,Input,Switch,Icon} from 'antd';
const FormItem = Form.Item;

import Chooser from  'components/Chooser'
import ListSelector from 'components/list-selector.js'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import "styles/budget-setting/budget-organization/budget-item/new-budget-item.scss"

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
    let path=this.state.budgetJournalDetailPage.url.replace(":budgetJournalHeaderId",undefined);
    let location ={
        pathname:path,
        state:{
          fromData:value
        }
    }

    this.context.router.push(location);
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
        organizationId:data
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
  handleJournalTypeChange=(value)=>{
     console.log(value)
    this.getStructure()

  }


  //根据账套类型，获得预算表
  getStructure(journalTypeId){
    httpFetch.get(`${config.budgetUrl}/api/budget/journal/type/assign/structures/queryStructureId?journalTypeId=${journalTypeId}`).then(req=>{
      this.setState(
        {structureGroup:req.data}
      )
    })
  }


  //选择预算表时，获得年度和期间段
  handleSelectChange=(value)=>{
    console.log(value);
      let id=123;
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/structure/selectBysStructureId/${id}`).then(req=>{
      let data =req.data;
      this.props.form.setFieldsValue({
        periodYear: '',
        periodStrategy:''
      });
    })


  }

  //根据预算表获取，年和编制期间
/*
  getStructureDate(id){
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/structure/selectBysStructureId/${id}`).then(req=>{
      this.setState(
        {

        }
      )
    })
  }
*/

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

    let strategyOptions = structureGroup.map((item)=><Option key={item.key} >{item.value}</Option>);

    return (
      <div className="new-budget-journal">
        <Form onSubmit={this.handleFrom} style={{width:'55%',margin:'0 auto'}}>
          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalNumber"})} >
            {getFieldDecorator('journalNumber', {
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
              valueKey='id'
              listExtraParams={this.state.organizationId}
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

              <Input/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.periodStrategy"})} >
            {getFieldDecorator('periodStrategy', {
              rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"期段"})
              }],

            })(

              <Input/>
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
                type='budget_scenarios'
                labelKey='scenarioName'
                valueKey='scenariosName'
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
              type='budget_versions'
              labelKey='versionsName'
              valueKey='versionsName'
              listExtraParams={this.state.organizationId}
              onChange={this.scenarioChange}
             />

            )}
          </FormItem>


          <FormItem wrapperCol={{ offset: 7 }}>
            <Button type="primary" htmlType="submit" loading={this.state.loading} style={{marginRight:'10px'}}>下一步</Button>
            <Button>取消</Button>
          </FormItem>
        </Form>

        <div>

          <ListSelector visible={showListSelector}
                        type={listType}
                        onCancel={this.handleListCancel}
                        onOk={this.handleListOk}
                        selectedData={listSelectedData}
                        extraParams={listExtraParams}
                        selectorItem={selectorItem}/>
          <input ref="blur" style={{ position: 'absolute', top: '-100vh' }}/> {/* 隐藏的input标签，用来取消list控件的focus事件  */}
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
