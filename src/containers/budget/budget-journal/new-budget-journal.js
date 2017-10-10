/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Form,Input,Switch,Icon} from 'antd';
const FormItem = Form.Item;

import ListSelector from 'components/list-selector'
import SearchArea from 'components/search-area.js';
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
      listType:'',
      listExtraParams: {},
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail','key'),    //预算日记账详情
      fieldsValueData:[
        {listType:'budget_journal_type',listExtraParams:{},valueKey:'journalTypeId',  labelKey: 'journalTypeName'},
        {listType:'budget_versions',listExtraParams:{},valueKey:'versionName', labelKey: 'versionName'},
        {listType:'budget_scenarios',listExtraParams:{},valueKey:'scenarioName', labelKey: 'scenarioName'},
      ],
      structureGroup:[],
      fromData:{ periodYear:'',}


    };
  }



  //跳转到预算日记账详情
  handleLastStep=()=>{


  let path=this.state.budgetJournalDetailPage.url.replace(":budgetJournalHeaderId",undefined);
    this.context.router.push(path);
  }

  //处理表单数据
  handleFrom=(e)=>{
    e.preventDefault();
    let value =this.props.form.getFieldsValue();

    console.log("11111111111111111")
    console.log(value);
  }




  //获得预算组织
  getOrganization=()=>{
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/organization/by/login`).then((request)=>{
      console.log(request.data)
      this.setState({
        organization:request.data
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

  //控制list-selector的
  showList=(Type,key)=>{
    let listSelectedData = [];
    let values = this.props.form.getFieldValue(key);
    if(values && values.length > 0){
      values.map(value => {
        listSelectedData.push(value.value)
      });
    }
    const organizationId = this.state.organization.id;
        this.setState({
          listType:Type,
          listExtraParams:{organizationId:organizationId},
          showListSelector:true,
          listSelectedData
        })
  }

  handleListOk=(result)=>{
    console.log(result);
   console.log(result.type);
    let fieldItem = [];
    let value;
    let items = this.state.fieldsValueData;
    items.map((item)=>{
      if(item.listType==result.type){
        fieldItem = item;
      }
    })

   let values = [];
    result.result.map(item => {
      values.push({
        key: item.id,
        label: item[fieldItem.labelKey],
        value: item
      })
    });
    let valueOf = {};
    valueOf[fieldItem.valueKey] = values;
    console.log(valueOf)
   this.props.form.setFieldsValue(valueOf);
    this.setState({
      showListSelector:false
    })
  }

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


  //获得预算表
  getStructure(value){
    httpFetch.get(`${config.budgetUrl}/api/budget/structures/query?organizationId=${this.state.organization.id}`).then(req=>{
      this.setState(
        {
          structureGroup:req.data
        }
      )
    })
  }


  //选择预算表时，获得年度和期间段
  handleSelectChange=(value)=>{
    console.log(value);
    

    this.props.form.setFieldsValue({
      periodYear: '',
      periodStrategy:''
    });
  }

  //根据预算表获取，年和编制期间
  getStructureDate(id){
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/structure/selectBysStructureId/${id}`).then(req=>{
      this.setState(
        {

        }
      )
    })
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
              <Select
                labelInValue
                mode="multiple"
                onFocus={() => this.handleFocus('budget_journal_type')}
                onSelect={this.handleJournalTypeChange}
                dropdownStyle={{ display: 'none' }}
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
              <Select
                mode="multiple"
                labelInValue
                onFocus={() => this.handleFocus('budget_versions','versionId')}
                dropdownStyle={{ display: 'none' }}
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
              <Select
                mode="multiple"
                labelInValue
                onFocus={() => this.handleFocus('budget_scenarios','scenarioId')}
                dropdownStyle={{ display: 'none' }}
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
