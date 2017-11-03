/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import { Button,Form,Row,Col,Input,Select,DatePicker,Switch,Icon,Table,Popconfirm,InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce';
import Chooser from  'components/Chooser'
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
let companyId ='';
let rateData=1;


class NewBudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      companyId:'',
      searchForm: [
        /*公司*/
        {type: 'select', id:'company', label: this.props.intl.formatMessage({id:"budget.companyId"}),isRequired: true, options: [],
          labelKey: 'name', valueKey: 'id',event:'company',
          url: `${config.baseUrl}/api/company/available`
        },
        /*部门*/
        {type: 'select', id:'unitId', label:this.props.intl.formatMessage({id:"budget.unitId"}), isRequired: true, options: [],
          labelKey: 'name', valueKey: 'id',event:'unitId',
          url: `${config.budgetUrl}/api/budget/journals/selectDepartmentsByCompanyAndTenant?companyId=`
        },
        /*预算项目*/
        {type: 'select', id:'item', label:  this.props.intl.formatMessage({id:"budget.item"}), isRequired: true, options: [],
          labelKey:'itemName',valueKey:'id',
          url:`${config.budgetUrl}/api/budget/items/find/all`,
        },
        /*期间*/
        {type: 'select', id:'periodName', label:  this.props.intl.formatMessage({id:"budget.periodName"}), isRequired: true, options: [],
          labelKey:'periodName',valueKey:'periodName',event:'periodName',
          url:`http://139.224.220.217:9084/api/company/group/assign/query/budget/periods?setOfBooksId=910833336382156802`
        },
        /*季度*/
        {type: 'value_list', id: 'periodQuarter', label: this.props.intl.formatMessage({id:"budget.periodQuarter"}), isRequired: true, options: [], valueListCode: 2021},
        /*年度*/
        {type: 'input', id:'periodYear', label:this.props.intl.formatMessage({id:"budget.periodYear"}), isRequired: true,},
        /*币种*/
        {type: 'select', id:'currency', label:  this.props.intl.formatMessage({id:"budget.currency"}), isRequired: true, options: [],event:'currency',
          labelKey:'attribute5',valueKey:'attribute4',
          url:`${config.budgetUrl}/api/budget/journals/getCurrencyByBase?base=CNY`
        },
        /*汇率类型*/
       /* {type: 'value_list', id:'rateType', label:  this.props.intl.formatMessage({id:"budget.rateType"}),  options: [],valueListCode:2101},*/
        /*标价方法*/
        /*{type: 'select', id:'rateQuotation', label:  this.props.intl.formatMessage({id:"budget.rateQuotation"}), options: []},*/
        /*汇率*/
        {type: 'input', id:'rate', label:  this.props.intl.formatMessage({id:"budget.rate"}), isRequired: true,event:'rate'},
        /*金额*/
        {type: 'inputNumber', id:'amount', label:  this.props.intl.formatMessage({id:"budget.amount"}), isRequired: true, step:10.00,defaultValue:0,event:'amount'},
        /*本位金额*/
        {type: 'inputNumber', id:'functionalAmount', label:  this.props.intl.formatMessage({id:"budget.functionalAmount"}), step:10.00,isRequired: true,defaultValue:0},
        /*数量*/
        {type: 'inputNumber', id:'quantity', label:  this.props.intl.formatMessage({id:"budget.quantity"}), isRequired: true,step:1,defaultValue:0},
        /*单位*/
       /* {type: 'select', id:'unit', label:  this.props.intl.formatMessage({id:"budget.unit"}), isRequired: true, options: []},*/
        /*备注*/
        {type: 'input', id:'remark', label:  this.props.intl.formatMessage({id:"budget.remark"}), isRequired: true, options: []},
        /*维度*/
      ],
      typeOptions: [],
      params:{},
      rate:12,
    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);
  }
  //表单的联动事件处理
  handleEvent(event,e){
    console.log(event);
    switch (e){
      case 'company':{
        event =JSON.parse(event);
        console.log(event);
        companyId = event.id;
        let url=`${config.budgetUrl}/api/budget/journals/selectDepartmentsByCompanyAndTenant?companyId=${event.id}` ;
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map(searchItem => {
          if(searchItem.id === 'unitId')
            searchItem.url = url;
          return searchItem;
        });
        return;
      }
      case 'periodName':{
        event =JSON.parse(event);
        let searchForm =this.state.searchForm;
        console.log(searchForm);
        this.props.form.setFieldsValue({
          periodYear:event.periodYear
        });

        this.props.form.setFieldsValue({
          periodQuarter:event.quarterNum,
        });

        return;
      }
      case 'currency':{
        console.log(event)
        event =JSON.parse(event);
        rateData =event.attribute11;
        this.props.form.setFieldsValue({
          rate:event.attribute11
        });
        return;
      }
      case 'amount':{

        let functionalAmount =  event*rateData;

        this.props.form.setFieldsValue({
          functionalAmount:functionalAmount,
        });
        return;
      }
      case 'rate':{
        this.setState({
          rate:String(event)
        })
        return;
      }
    }
  }
  getParams(){
    console.log(this.state.params);
    console.log(this.props.params);
  }
  componentWillMount(){
    this.setState({
      params:this.props.params
    })
    console.log(this.props.params);
  }
  componentWillReceiveProps = (nextProps) => {

    if(nextProps.params && nextProps.params!=={} )
      this.setState({ params : nextProps.params });
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
    console.log(item);
    let params = {};
    let path = item.url;
    let organizationId ;
    if(item.id=="item"){
      // path = path+`?organizationId=${this.props.organization.id}`    //真实的代码
      path = path+`?organizationId=1`  //暂时写死
    }
    url=path;
    httpFetch.get(url, params).then((res) => {
      let options = [];
      res.data.map(data => {
        options.push({label: data[item.labelKey], key: data[item.valueKey], value: data})
      });
      console.log(options)
      let searchForm = this.state.searchForm;
      searchForm = searchForm.map(searchItem => {
        if(searchItem.id === item.id)
          searchItem.options = options;
        return searchItem;
      });
      console.log(searchForm);
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
    switch(item.type){
      //输入组件
      case 'input':{
        return <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle} disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})} onChange={handle} disabled={item.disabled}
                  onFocus={item.url ? () => this.setOptionsToFormItemSelect(item, item.getUrl) : () => {}} >
            {item.options.map((option)=>{
              // let a  = [option.key,option.label]
              return <Option key={option.key} value={JSON.stringify(option.value)} >{option.label}</Option>
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
      //数字选择InputNumber
      case 'inputNumber':{
        return <InputNumber disabled={item.disabled} onChange={handle} min={0} step={item.step}/>
      }
    }
  }
  getFields(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6,offset:1 },
      wrapperCol: { span: 14, offset: 1 },
    };
    const children = [];
    this.state.searchForm.map((item, i)=>{
      children.push(
        <Col span={24} key={item.id}>
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
    const params =this.state.params;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {

      console.log(value);
      let companyId;
      let companyName;
      let itemId;
      let itemName;
      let unitId;
      let departmentName;
      let periodNameData;
      let currencyData;

      if(value.company.indexOf(":")>1){
        let company = JSON.parse(value.company);
        companyId=company.id;
        companyName=company.name;
      }
      else {
        companyId=params.companyId;
        companyName=params.companyName;
      }
      console.log(companyId+companyName);


      if(value.currency.indexOf(":")>1){
        let currency = JSON.parse(value.currency);
        currencyData=currency.attribute4;
      }
      else {
        currencyData=params.currency;
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


      if(value.periodName.indexOf(":")>1 ){
        let periodNameFromData = JSON.parse(value.periodName);
       let periodName=periodNameFromData.periodName;

        //处理期间
       if(periodName!=''&& periodName!=null && periodName!=undefined) {
          const periodNameArray = periodName.split("-");
          for (let i = 0; i < periodNameArray.length; i++) {
            console.log(periodNameArray[i])
            if (periodNameArray[i].length==4 &&  Number(periodNameArray[i])) {
              if(i==0){
                periodNameData = periodNameArray[0]+""+periodNameArray[1];
              }else {
                periodNameData = periodNameArray[1]+""+periodNameArray[0];
              }
              console.log(periodName.periodYear);
            }
          }
        }else {
          periodNameData='';
        }

      }
      else {
        periodNameData=params.periodName;
      }

      if(value.unitId.indexOf(":">1)){
        let unit =JSON.parse(value.unitId);
        unitId = unit.id;
        departmentName=unit.name
      }else {
        unitId = params.unitId;
        departmentName = params.departmentName;
      }
      // let currency =JSON.parse(value.currency);
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
          "lastUpdatedBy": "1"

      }
      let data;
      if(params=={}){
        data={
          ...valueData

        }
      }else {
        data={
          ...valueData,
          "id":params.id
        }
      }
      this.props.close(data);
    })
    this.props.form.resetFields();
  }
  onCancel=()=>{
    this.props.form.resetFields();
    this.props.close();
  }
  componentWillMount(){
    this.getCurrency
  }
  //获得币种
  getCurrency=()=>{
    httpFetch.get(`http://uat.huilianyi.com/api/company/standard/currency?language=chineseName&page=0&size=30`).then((req)=>{
      console.log(req.data);
      console.log(121321312)
    })
  }
  render(){
    return (
      <div>
        <Form onSubmit={this.HandleSubmit}>
          <div className="base-condition">
            <Row gutter={40} className="base-condition-content">{this.getFields()}</Row>
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
    organization: state.login.organization
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetJournalDetail));
