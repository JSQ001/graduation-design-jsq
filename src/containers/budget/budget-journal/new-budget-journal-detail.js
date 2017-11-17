/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import { Button,Form,Row,Col,Input,Select,InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce';

import 'styles/budget/budget-journal/new-budget-journal-detail.scss'
import httpFetch from 'share/httpFetch';
import config from 'config'
import Chooser from 'components/chooser'
let rateData=1;

class NewBudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate:0,
      loading:false,
      searchForm:[],
      params:{},
    };

  }

  //表单的联动事件处理
  handleEvent(event,e){
    switch (e){
      case 'company':{
      }
      case 'periodName':{
        event =JSON.parse(event);
        let searchForm =this.state.searchForm;
        this.props.form.setFieldsValue({
          periodYear:event.periodYear
        });

        this.props.form.setFieldsValue({
          periodQuarter:event.quarterNum,
        });

        return;
      }
      case 'currency':{
        event =JSON.parse(event);
        rateData =event.attribute11;
        let rate =event.attribute11;
        this.setState({ rate })
        this.props.form.setFieldsValue({
          rate:event.attribute11
        });

        return;
      }
      case 'amount':{
        let functionalAmount = event*rateData;
        this.props.form.setFieldsValue({
          functionalAmount:functionalAmount,
        });
        return;
      }

    }
  }

  getStrategyControl=()=>{
    let searchFrom =this.state.searchForm;
    searchFrom.map((item)=>{
      if(item.id=="periodYear"){
        item["disabled"]=this.props.params.periodStrategy=="MONTH"?true:false
        item["isRequired"]=true
      }
      if(item.id=="periodQuarter"){
        item["disabled"]=this.props.params.periodStrategy=="QUARTER"?false:true
        item["isRequired"]=this.props.params.periodStrategy=="QUARTER"?true:false
      }
      if(item.id =="periodName"){
       item["disabled"]=this.props.params.periodStrategy=="MONTH"?false:true
        item["isRequired"]=this.props.params.periodStrategy=="MONTH"?true:false
      }
    })

    this.setState({
      searchFrom:searchFrom
    })
  }

  chooserChangeHandle(value,e){
    if(value.length>0){
      if(e=="company"){
        let searchFrom =this.state.searchForm;
        searchFrom.map((item)=>{
          if(item.id=="unitId"){
            item["listExtraParams"]={companyId:value[0].id}
            item["disabled"]=false
            return
          }

        })

        this.setState({
          searchFrom:searchFrom
        })

        this.props.form.setFieldsValue({
          unitId: ''
        });
      }

    }
  }

  componentWillMount(){

    let nowYear = new Date().getFullYear();
    let yearOptions = [];
    for(let i = nowYear - 20; i <= nowYear + 20; i++)
      yearOptions.push({label: i, key: String(i)})
    let searchForm =[
      {type: 'list', id: 'company', listType: 'company',label:this.props.intl.formatMessage({id: 'budget.companyId'}), labelKey: 'name',
        valueKey: 'id',single:'true',event:'company',isRequired: true, listExtraParams:{setOfBooksId:this.props.company.setOfBooksId}},//公司
      {type: 'list', id: 'unitId', listType: 'journal_line_department',  label:this.props.intl.formatMessage({id: 'budget.unitId'}),
        labelKey: 'name',valueKey: 'id',single:'true',event:'unitId',isRequired: true,disabled:true, listExtraParams:{companyId: ''}},//部门
      {type: 'select', id:'item', label:  this.props.intl.formatMessage({id:"budget.item"}), isRequired: true, options: [],
        labelKey:'itemName',valueKey:'id', url:`${config.budgetUrl}/api/budget/items/find/all`},
      {type: 'select', id:'periodName', label:  this.props.intl.formatMessage({id:"budget.periodName"}), isRequired: true,options: [],
        labelKey:'periodName',valueKey:'periodName',event:'periodName', disabled:true,
        url:`${config.baseUrl}/api/company/group/assign/query/budget/periods?setOfBooksId=${this.props.company.setOfBooksId}`}, //期间
      {type: 'value_list', id: 'periodQuarter', label: this.props.intl.formatMessage({id: "budget.periodQuarter"}), isRequired: true,
        options: [], valueListCode: 2021, disabled:true}, //季度
      {type: 'select_year', id:'periodYear', label:this.props.intl.formatMessage({id:"budget.periodYear"}), isRequired: true,
        disabled:true, options: yearOptions,event: 'YEAR_CHANGE'}, //年度
      {type: 'select', id:'currency', label:  this.props.intl.formatMessage({id:"budget.currency"}), isRequired: true, options: [],event:'currency',
        labelKey:'attribute5',valueKey:'attribute4', url:`${config.budgetUrl}/api/budget/journals/getCurrencyByBase?base=CNY`}, //币种
      {type: 'input', id:'rate', label:  this.props.intl.formatMessage({id:"budget.rate"}), isRequired: true,event:'rate',disabled: true},  //汇率
      {type: 'inputNumber', id:'amount', label:  this.props.intl.formatMessage({id:"budget.amount"}), isRequired: true,
        step:10.00, defaultValue:0, event:'amount'},  //金额
      {type: 'inputNumber', id:'functionalAmount', label:  this.props.intl.formatMessage({id:"budget.functionalAmount"}),
        step:10.00, isRequired: true, defaultValue:0, disabled: true}, //本位金额
      {type: 'inputNumber', id:'quantity', label:  this.props.intl.formatMessage({id:"budget.quantity"}), isRequired: true,step:1,defaultValue:0}, //数量
      {type: 'input', id:'remark', label:  this.props.intl.formatMessage({id:"budget.remark"})}  //备注
    ];
    this.setState({ searchForm })
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.params && nextProps.params!=={} ){
      if(nextProps.params.isNew===false){
          this.state.rate=nextProps.params.rate;
          rateData=nextProps.params.rate;
      }
      this.getStrategyControl();
      if(nextProps.params.id !== this.state.params.id){
        this.setState({ params: nextProps.params },() => {
          let params = this.props.form.getFieldsValue();
          for(let name in params){
            let result = {};
            result[name] = nextProps.params[name];
            this.props.form.setFieldsValue(result)
          }
        });
      }
    }
    else
      this.setState({ params : {} });
  };

  clear = () => {
    this.props.form.resetFields();
  };
  //根据接口返回数据重新设置options
  setOptionsToFormItem = (item, url, key) => {
    let params = {};
    if(key){
      params[item.searchKey] = key;
      if(item.method === 'get')
        url += `?${item.searchKey}=${key}`;
    }
    if( (key !== undefined && key !== '') || key === undefined){
      httpFetch[item.method](url, params).then((res) => {
        let options = [];
        res.data.map(data => {
          options.push({label: data[item.labelKey], key: data[item.valueKey], value: data})
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map(searchItem => {
          if(searchItem.id === item.id)
            searchItem.options = options;
          return searchItem;
        });
        this.setState({ searchForm });
      })
    }
  };
  //获select得值列表里面的数据
  setOptionsToFormItemSelect=(item,url)=>{
    let params = {};
    let path = item.url;
    let organizationId ;
    if(item.id=="item"){
      path = path+`?organizationId=${this.props.organization.id}`;
     // path = path+`?organizationId=1`
    }
    url=path;
    httpFetch.get(url, params).then((res) => {
      let options = [];
      res.data.map(data => {
        options.push({label: data[item.labelKey], key: data[item.valueKey], value: data})
      });
      let searchForm = this.state.searchForm;
      searchForm = searchForm.map(searchItem => {
        if(searchItem.id === item.id)
          searchItem.options = options;
        return searchItem;
      });
      this.setState({ searchForm });
    })
  }
  //得到值列表的值增加options
  getValueListOptions = (item) => {
    this.getSystemValueList(item.valueListCode).then(res => {
      let options = [];
      res.data.values.map(data => {
        options.push({label: data.messageKey, value: data.code, data: data})
      });
      let searchForm = this.state.searchForm;
      searchForm = searchForm.map(searchItem => {
        if(searchItem.id === item.id)
          searchItem.options = options;
        if(searchItem.type === 'items')
          searchItem.items.map(subItem => {
            if(subItem.id === item.id)
              subItem.options = options;
          });
        return searchItem;
      });
      this.setState({ searchForm });
    })
  };
  //渲染搜索表单组件
  renderFormItem(item){
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    let chooserHandle = item.event ? (event) => this.chooserChangeHandle(event,item.event) : ()=>{};
    switch(item.type){
      //输入组件
      case 'input':{
        return <Input  placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle} disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
      return (
        <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})} onChange={handle} disabled={item.disabled}
                onFocus={item.url ? () => this.setOptionsToFormItemSelect(item, item.getUrl) : () => {}} >
          {item.options.map((option)=>{
            return <Option key={option.key} value={JSON.stringify(option.value)} >{option.label}</Option>
          })}
        </Select>
      )
    }

      case 'select_year':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})} onChange={handle} disabled={item.disabled}>
            {item.options.map((option)=>{
              return <Option key={option.key} value={option.key}>{option.label}</Option>
            })}
          </Select>
        )
      }

      //值列表选择组件
      case 'value_list':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={() => this.getValueListOptions(item)}>
            {item.options.map((option)=>{
              return <Option key={option.value} title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }
      case 'list':{
        return <Chooser placeholder={item.placeholder}
                        disabled={item.disabled}
                        type={item.listType}
                        labelKey={item.labelKey}
                        valueKey={item.valueKey}
                        listExtraParams={item.listExtraParams}
                        selectorItem={item.selectorItem}
                        single={Boolean(item.single)}
                        onChange={chooserHandle}
        />
      }
      //数字选择InputNumber
      case 'inputNumber':{
        return <InputNumber disabled={item.disabled}  min={0} step={item.step} onChange={handle} style={{width:200}}/>
      }
    }
  }
  getFields(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6},
      wrapperCol: { span: 14, offset: 1 },
    };

    const children = [];
    this.state.searchForm.map((item, i)=>{
      children.push(
        <Col span={20} key={item.id}>
          {item.type === 'items' ? this.renderFormItem(item) :
            <FormItem {...formItemLayout} label={item.label} colon={false}>
              {getFieldDecorator(item.id, {
                initialValue:this.props.params[item.id],
                rules: [{
                  required: item.isRequired,
                  message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: item.label}),  //name 不可为空
                }]
              })(
                this.renderFormItem(item)
              )}
            </FormItem>
          }
        </Col>
      );
    });
    return children;
  }
  //提交保存
  HandleSubmit=(e)=>{
    const params =this.props.params;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,value) => {
      let companyId;
      let companyName;
      let itemId;
      let itemName;
      let unitId;
      let departmentName;
      let periodNameData;
      let currencyData;

      if(value.company.length>0){
        let company = value.company[0];
        companyId=company.id;
        companyName=company.name;
      }
      else {
        companyId=params.companyId;
        companyName=params.companyName;
      }

      if(value.unitId.length>0){
        let unit =value.unitId[0];
        unitId = unit.id;
        departmentName=unit.name;
      }else {
        unitId = params.unitId;
        departmentName = params.departmentName;
      }

      if(value.item.indexOf(":")>1 ){
        let item = JSON.parse(value.item);
        itemId=item.id;
        itemName=item.itemName;
      }
      else {
        itemId=params.itemId;
        itemName=params.itemName;
      }

      if(value.currency.indexOf(":")>1){
        let currency = JSON.parse(value.currency);
        currencyData=currency.attribute4;
      }
      else {
        currencyData=params.currency;
      }

      if(value.periodName.indexOf(":")>1 ){
        let periodNameFromData = JSON.parse(value.periodName);
        periodNameData=periodNameFromData.periodName;
      }
      else {
        periodNameData=params.periodName;
      }
      let  valueData = {
          "companyId": companyId,
          "companyName":companyName,
          "unitId":unitId,
           "departmentName":departmentName,
          "departmentCode": "",
          "costCenter": "",
          "itemId": itemId,
          "itemName": itemName,
          "currency":currencyData,
          "rateType": "1",
          "rateQuotation":'',
          "rate": value.rate,
          "amount": value.amount,
          "functionalAmount": value.functionalAmount,
          "quantity": value.quantity,
          "unit": "1",
          "remark": value.remark,
          "periodYear": value.periodYear,
          "periodQuarter": value.periodQuarter,
          "periodName":periodNameData,
          "dimension1Id": null,
          "dimension2Id": null,
          "dimension3Id": null,
          "dimension4Id": null,
          "dimension5Id": null,
          "dimension6Id": null,
          "dimension7Id": null,
          "dimension8Id": null,
          "dimension9Id": null,
          "dimension10Id": null,
          "dimension11Id": null,
          "dimension12Id": null,
          "dimension13Id": null,
          "dimension14Id": null,
          "dimension15Id": null,
          "dimension16Id": null,
          "dimension17Id": null,
          "dimension18Id": null,
          "dimension19Id": null,
          "dimension20Id": null,
          "versionNumber": params.versionNumber||"1",
          "createdBy": "1",
          "lastUpdatedBy": "1",
          "isNew":params.isNew

      }
      let data;
      if(params.isNew){
        data={
          ...valueData,
        }
      }else {
        data={
          ...valueData,
          "id":params.id,
        }
      }
      console.log(data);
      this.props.close(data);
    })
    this.props.form.resetFields();
  }
  onCancel=()=>{
    this.props.form.resetFields();
    this.props.close();
  }

  render(){
    return (
      <div className="new-budget-journal-detail">
        <Form onSubmit={this.HandleSubmit}>
          <div className="base-condition">
            <Row gutter={40} className="base-condition-content">
              {this.getFields()}
              </Row>
          </div>
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={this.state.loading}>{this.props.intl.formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{this.props.intl.formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}
const WrappedNewBudgetJournalDetail = Form.create()(NewBudgetJournalDetail);
function mapStateToProps(state) {
  return {
    organization: state.login.organization,
    company: state.login.company,
    user: state.login.user,
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetJournalDetail));
