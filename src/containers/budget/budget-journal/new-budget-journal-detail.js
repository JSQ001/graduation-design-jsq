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
      dimensionList:{},
      params:{},
      periodStrategyFlag:true,
      structureIdFlag:true,
      journalTypeIdFlag:true,
      journalTypeId:null,

    };

  }

  //表单的联动事件处理
  handleEvent(event,e){
    console.log(event);
    console.log(e);
    switch (e){
      case 'periodName':{
        const eventData = JSON.parse(event);
        console.log(eventData);
        this.props.form.setFieldsValue({
          periodYear:eventData.periodYear
        });
        this.props.form.setFieldsValue({
          periodQuarter:eventData.quarterNum,
        });

        return;
      }
      case 'currency':{
        const eventData = JSON.parse(event);
        rateData =eventData.attribute11;
        let rate =eventData.attribute11;
        this.setState({ rate })
        this.props.form.setFieldsValue({
          rate:eventData.attribute11
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

  chooserChangeHandle(value,e){
    if(value.length>0){
      if(e === "company"){
        let searchFrom =this.state.searchForm;
        searchFrom.map((item)=>{
          if(item.id === "item" ){
            let listExtraParams = item["listExtraParams"];
            console.log(listExtraParams);
            listExtraParams.companyId = value[0].id;
            item["listExtraParams"]=listExtraParams;
            item["disable"]=false
            console.log(item);
            return
          }
        })
        this.setState({
          searchFrom:searchFrom
        })
        this.props.form.setFieldsValue({
          unit: ''
        });
      }
    }
  }

  getStrategyControl=()=>{
    let searchFrom =this.state.searchForm;
    searchFrom.map((item)=>{
      if(item.id === "periodYear"){
        item["disabled"]=this.props.params.periodStrategy=="MONTH"?true:false
        item["isRequired"]=true
      }
      if(item.id === "periodQuarter"){
        item["disabled"]=this.props.params.periodStrategy=="QUARTER"?false:true
        item["isRequired"]=this.props.params.periodStrategy=="QUARTER"?true:false
      }
      if(item.id === "periodName"){
        item["disabled"]=this.props.params.periodStrategy=="MONTH"?false:true
        item["isRequired"]=this.props.params.periodStrategy=="MONTH"?true:false
      }
    })

    this.setState({
      searchFrom:searchFrom
    })
  }

  componentWillMount(){
    let queryLineListTypeOptions = [];
    this.getSystemValueList(2021).then(res => {
      console.log(res.data.values);
      res.data.values.map(data => {
        queryLineListTypeOptions.push({label: data.messageKey, value: data.code})
      });
      console.log(queryLineListTypeOptions);
    });
    let nowYear = new Date().getFullYear();
    let yearOptions = [];
    for(let i = nowYear - 20; i <= nowYear + 20; i++)
      yearOptions.push({label: i, value: String(i)})
    let searchForm =[
      {type: 'list', id: 'company', listType: 'company',label:this.props.intl.formatMessage({id: 'budget.companyId'}), labelKey: 'name',
        valueKey: 'id',single:true,event:'company',isRequired: true, listExtraParams:{setOfBooksId:this.props.company.setOfBooksId},
        columnLabel: 'companyName', columnValue: 'companyId'
      },//公司
      {type: 'list', id: 'unit', listType: 'journal_line_department',  label:this.props.intl.formatMessage({id: 'budget.unitId'}),
        labelKey: 'name',valueKey: 'id',single:true,event:'unit',isRequired: false,disabled:false,
        listExtraParams:{"companyId":''},
        columnLabel: 'departmentName',columnValue: 'unitId'
      },//部门
      {type: 'list', id:'item',listType:'journal_item',label:  this.props.intl.formatMessage({id:"budget.item"}), isRequired: true, options: [],
        labelKey:'itemName',valueKey:'id',disabled:false,single:true, listExtraParams:{"journalTypeId":'',"companyId":''},
        columnLabel: 'itemName',columnValue: 'itemId'
      },//预算项目
      {type: 'select', id:'periodName', method:'get',label:  this.props.intl.formatMessage({id:"budget.periodName"}), isRequired: true,options: [],
        labelKey:'periodName',valueKey:'periodName',event:'periodName',
        getUrl:`${config.baseUrl}/api/company/group/assign/query/budget/periods?setOfBooksId=${this.props.company.setOfBooksId}`,
        columnLabel:'periodName',columnValue:'periodName'
      }, //期间
      {type: 'select_year', id: 'periodQuarter', label: this.props.intl.formatMessage({id: "budget.periodQuarter"}), isRequired: true,
        options: queryLineListTypeOptions, disabled:true,
        columnLabel:'periodQuarterName',columnValue:'periodQuarter'
      }, //季度
      {type: 'select_year', id:'periodYear', label:this.props.intl.formatMessage({id:"budget.periodYear"}), isRequired: true,
        disabled:true, options: yearOptions,event: 'YEAR_CHANGE',
        columnLabel:'periodYear',columnValue:'periodYear'
      }, //年度
      {type: 'select', id:'currency',method:'get',label:  this.props.intl.formatMessage({id:"budget.currency"}), isRequired: true, options: [],event:'currency',
        labelKey:'attribute5',valueKey:'attribute4', getUrl:`${config.budgetUrl}/api/budget/journals/getCurrencyByBase?base=CNY`,
        columnLabel: 'currency', columnValue: 'currency'
      }, //币种
      {type: 'input', id:'rate', label:  this.props.intl.formatMessage({id:"budget.rate"}), isRequired: true,event:'rate',disabled: true},  //汇率
      {type: 'inputNumber', id:'amount',precision:2, label:  this.props.intl.formatMessage({id:"budget.amount"}), isRequired: true,
        step:10.00, defaultValue:0, event:'amount'},  //金额
      {type: 'inputNumber', id:'functionalAmount', precision:2,label:  this.props.intl.formatMessage({id:"budget.functionalAmount"}),
        step:10.00, isRequired: true, defaultValue:0, disabled: true}, //本位金额
      {type: 'inputNumber', id:'quantity', precision:0,label:  this.props.intl.formatMessage({id:"budget.quantity"}), isRequired: true,step:1,defaultValue:0}, //数量
      {type: 'input', id:'remark', label:  this.props.intl.formatMessage({id:"budget.remark"})}  //备注
    ];
    this.setState({ searchForm })
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.params && nextProps.params!=={} ){
      if(nextProps.params.isNew === false){
        this.state.rate=nextProps.params.rate;
        rateData=nextProps.params.rate;
      }
      //获取编制期段的控制
      if(nextProps.params.periodStrategy && this.state.periodStrategyFlag){
        this.setState({
          periodStrategyFlag:false,
        },()=>{
          this.getStrategyControl();
        })
      }
      //获取维度表单,
      if(nextProps.params.structureId  && this.state.structureIdFlag ){
        this.setState({
          structureIdFlag:false,
        },()=>{
          this.getDimensionByStructureId();
        })
      }
      if(nextProps.params.journalTypeId && this.state.journalTypeIdFlag){
        this.setState({
          journalTypeIdFlag:false,
        },()=>{
          this.getItemUrl();
        })
      }
      if(nextProps.params.id !== this.state.params.id){
        this.setState({ params: nextProps.params },() => {
          let params = this.props.form.getFieldsValue();
          //this.setValues(nextProps.params);
          for(let name in params){
            let result = {};
            result[name] = nextProps.params[name];
            this.props.form.setFieldsValue(result)
          }
        });
      }
    }
    else
      this.setState({ params : {}});
  };

  getItemUrl(){
    let searchForm = this.state.searchForm;
      searchForm.map(searchItem => {
      if(searchItem.id === "item"){
          console.log(searchItem.id)
          console.log(this.props.params.journalTypeId);
        searchItem.listExtraParams ={"journalTypeId":this.props.params.journalTypeId,"companyId":''};
      }
    });
    console.log(searchForm);
    this.setState({ searchForm });
  }


  //给select增加options
  getOptions = (item) => {
    console.log(item);
    console.log(12);
    if(item.options.length === 0 ){
      let url = item.getUrl;
      if(item.method === 'get' && item.getParams){
        url += '?';
        let keys = Object.keys(item.getParams);
        keys.map(paramName => {
          url += `&${paramName}=${item.getParams[paramName]}`
        })
      }
      httpFetch[item.method](url, item.getParams).then((res) => {
        console.log(res.data);
        let options = [];
        res.data.map(data => {
          options.push({label: data[item.labelKey], value: data[item.valueKey], data: data})
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
    }
  };


  //得到值列表的值增加options
  getValueListOptions = (item) => {
    console.log(item);
    if(item.options.length === 0){
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
    }
  };

  //渲染搜索表单组件
  renderFormItem(item){
    let handle = item.event ? (event) => this.handleEvent(event,item.event) : ()=>{};
    let chooserHandle = item.event ? (event) => this.chooserChangeHandle(event,item.event) : ()=>{};
    switch(item.type){
      //输入组件
      case 'input':{
        return <Input  placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} formatter={value => `${value}`}  onChange={handle} disabled={item.disabled}/>
      }
      //选择组件
      case 'select':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  allowClear
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={item.getUrl ? () => this.getOptions(item) : () => {}}
          >
            {item.options.map((option)=>{
              return <Option value={option.data?JSON.stringify(option.data) : ''} lable={option.label} title={option.data?JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }
      case 'select_dimension':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  allowClear
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
          >
            {item.options.map((option)=>{
              return <Option  key={option.value} lable={option.lable} value={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //值列表选择组件
      case 'value_list':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  allowClear
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={() => this.getValueListOptions(item)}>
            {item.options.map((option)=>{
              return <Option key={option.value} title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }

      case 'select_year':{
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})} onChange={handle} disabled={item.disabled}>
            {item.options.map((option)=>{
              return <Option value={option.value} >{option.label}</Option>
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
                        single={item.single}
                        onChange={chooserHandle}
        />
      }
      //switch状态切换组件
      //数字选择InputNumber
      case 'inputNumber':{
        return <InputNumber disabled={item.disabled}  min={0} step={item.step} precision={item.precision} onChange={handle} style={{width:200}}/>
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

  handleSearch = (e) => {
    let valuesData={
      ...this.state.dimensionList
    };
    let oldData ={};
    let dimensionDTO =[];
    if(!this.state.params.isNew){
      oldData = this.props.params.oldData;
    }
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    console.log(values);
    let searchForm = [].concat(this.state.searchForm);
    searchForm.map((item) => {
      if(( item.type === 'select'  || item.type === 'select_dimension')) {
        if( values[item.id]) {
          const value =values[item.id];
          if( typeof value === 'string'){
            if (value.indexOf(`":"`) > 1) {
              console.log("indexOf");
              console.log(value.indexOf(`":"`));
              const valueObject = JSON.parse(value);
              valuesData[item.columnLabel] = valueObject[item.labelKey];
              valuesData[item.columnValue] = valueObject[item.valueKey];
              if(item.type === 'select_dimension'){
                dimensionDTO.push({
                  "dimensionId":item.dimensionId,
                  "dimensionValueId":Number(valueObject[item.valueKey]),
                })
              }
              if(item.id === 'periodName'){
                valuesData["periodYear"] = valueObject["periodYear"];
                valuesData["periodQuarter"] = valueObject["quarterNum"];
              }
            } else {
              if(item.type!='select_dimension'){
                valuesData[item.columnLabel] = oldData[item.columnLabel];
                valuesData[item.columnValue] = oldData[item.columnValue];
              }else {
                valuesData[item.columnLabel] = item.defindLable?item.defindLable:null;
                valuesData[item.columnValue] = item.defindValue?item.defindValue:null;
                dimensionDTO.push({
                  "dimensionId":item.dimensionId,
                  "dimensionValueId":null
                })
              }
            }
          }else if (typeof value === 'number'){
            valuesData[item.columnLabel]=value;
          }
        }else {
          valuesData[item.columnLabel] =null;
          valuesData[item.columnValue] =null;
          if(item.type === "select_dimension"){
            dimensionDTO.push({
              "dimensionId":item.dimensionId,
              "dimensionValueId":null
            })
          }
        }
      }
      if( item.type === 'select_year'){
        if(values[item.id]){
          valuesData[item.columnValue] =values[item.id];
          valuesData[item.columnLabel] =values[item.id];
        }else {
          valuesData[item.columnValue] =null;
          valuesData[item.columnLabel] =null;
        }
      }
      if(item.type === 'list'){
        console.log(values[item.id]);
        if(values[item.id]) {
          if (values[item.id].length > 0) {
            const value = values[item.id][0];
            valuesData[item.columnLabel] = value[item.labelKey];
            valuesData[item.columnValue] = value[item.valueKey];
          } else {
            valuesData[item.columnLabel] = oldData[item.columnLabel];
            valuesData[item.columnValue] = oldData[item.columnValue];
          }
        }else {
          valuesData[item.columnLabel] =null;
          valuesData[item.columnValue] =null;
        }
      }
      if((item.type === 'input'|| item.type === 'inputNumber' )){
        if(values[item.id]){
          valuesData[item.id]=values[item.id];
        }

      }

    });
    console.log(valuesData);
    console.log("valuesData");
    console.log(this.props.params.isNew);
    console.log(this.props.oldData);
    let valuesDataClose ={};
    if(this.props.params.isNew){
      valuesDataClose={
        ...valuesData,
        versionNumber:1,
        dimensionDTO:dimensionDTO,
        isNew:true,
      }
    }else {
      valuesDataClose={
        ...this.props.params.oldData,
        ...valuesData,
        dimensionDTO:dimensionDTO,
        isNew:false
      }
    }

    console.log(valuesDataClose);
    this.props.close(valuesDataClose);
    this.props.form.resetFields();
  };



  //根据预算表id，获得维度
  getDimensionByStructureId = () =>{
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getLayoutsByStructureId?structureId=${this.props.params.structureId}`).then((resp)=>{
      this.getSearchForm(resp.data);
      console.log(resp.data);
    }).catch(e=>{
      message.error(`获得维度失败,${e.response.data.message}`);
    })
  }

  //根据预算表,set维度表单
  getSearchForm(dimension){
    console.log("getSearchForm");
    let searchForm=this.state.searchForm;
    let dimensionList ={};
    for(let i=0;i<dimension.length;i++){
      const item =dimension[i];
      const priority =i+1;
      //const priority = item.priority;
      let dimensionListKey = ["dimension"+priority+"Id","dimension"+priority+"Name","dimension"+priority+"ValueId","dimension"+priority+"ValueName"];
      dimensionList[dimensionListKey[0]]=item.dimensionId;
      dimensionList[dimensionListKey[1]]=item.dimensionName;
      dimensionList[dimensionListKey[2]]=item.defaultDimValueId?item.defaultDimValueId:null;
      dimensionList[dimensionListKey[3]]=item.defaultDimValueName?item.defaultDimValueName:null;
      console.log(item);
      let options=[];
      httpFetch.get(`${config.baseUrl}/api/my/cost/center/items/by/costcenterid?costCenterId=${item.dimensionId}`).then((res)=>{
        console.log(res.data);
        const data =res.data;
        data.map((item)=>{
          options.push({label: item.name, value: item.id, data:item})
        })

      })

      console.log(options);

      const searchFormItem=  {type: 'select_dimension', label:`${item.dimensionName}`, options:options,
        labelKey:'name',valueKey:'id',defaultValue:dimensionList[dimensionListKey[3]],
        columnLabel:`dimensionValue${priority}Name`,columnValue:`dimensionValue${priority}Id`
      };
      searchFormItem["id"]="dimension"+priority,
        searchFormItem["dimensionId"]=item.id;
      searchForm.push(
        searchFormItem
      )
    }
    this.setState({searchForm,dimensionList});
  }

  onCancel = () =>{
    this.props.form.resetFields();
    this.props.close();
  }
  render(){
    return (
      <div className="new-budget-journal-detail">
        <Form onSubmit={this.handleSearch}>
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
