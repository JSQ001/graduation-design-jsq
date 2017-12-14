/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import { Button,Form,Row,Col,Input,Select,InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

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
      dimensionDataLists:{},
      params:{},
      periodStrategyFlag:true,
      structureIdFlag:true,
      journalTypeIdFlag:true,
      companyIdFlag:true,
      journalTypeId:null,
    };

  }

  //表单的联动事件处理
  handleEvent(event,e){
    switch (e){
      case 'periodName':{
        const eventData = JSON.parse(event);
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
          rate:eventData.attribute11,
          amount:'',
          functionalAmount:''
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
        this.setItemCompanyId(value[0].id);
        this.props.form.setFieldsValue({
          item: []
        });
      }
    }
  }

  //给预算项目公司ID
  setItemCompanyId(companyId){
    let searchFrom =this.state.searchForm;
    searchFrom.map((item)=>{
      if(item.id === "item" ){
        let listExtraParams = item["listExtraParams"];
        listExtraParams.companyId = companyId;
        item["listExtraParams"]=listExtraParams;
        item["disabled"]=false;
        return item;
      }
    })
    this.setState({
      searchFrom:searchFrom
    })
  }

  //预算项目是否可以选
  getItemAbled(value,companyId){
    let searchFrom =this.state.searchForm;
    searchFrom.map((item)=>{
      if(item.id === "item" ){
        item["disabled"]=value;
        if(!value){
          let listExtraParams = item["listExtraParams"];
          listExtraParams.companyId = companyId;
          item["listExtraParams"]=listExtraParams;
        }
        return item;
      }
    })
    this.setState({
      searchFrom:searchFrom
    })
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
      res.data.values.map(data => {
        queryLineListTypeOptions.push({label: data.messageKey, value: data.code,key:data.code})
      });
    });
    let currencyOptions = [];
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getCurrencyByBase?base=CNY`).then((res)=>{
      res.data.map(data => {
        currencyOptions.push({label: data.attribute5,data: data,key:data.id})
      });
    })
    let nowYear = new Date().getFullYear();
    let yearOptions = [];
    for(let i = nowYear - 20; i <= nowYear + 20; i++)
      yearOptions.push({label: i, value: String(i)})
    let searchForm =[
      {type: 'list', id: 'company', listType: 'company',label:this.props.intl.formatMessage({id: 'budget.companyId'}),
        labelKey: 'name', valueKey: 'id',single:true,event:'company',isRequired: true,disabled:false,
        listExtraParams:{setOfBooksId:this.props.company.setOfBooksId},
        columnLabel: 'companyName', columnValue: 'companyId'
      },//公司
      {type: 'list', id: 'unit', listType: 'journal_line_department',  label:this.props.intl.formatMessage({id: 'budget.unitId'}),
        labelKey: 'name',valueKey: 'id',single:true,event:'unit',isRequired: false,disabled:false,
        listExtraParams:{"companyId":''},
        columnLabel: 'departmentName',columnValue: 'unitId'
      },//部门
      {type: 'list', id:'item',listType:'journal_item',label:  this.props.intl.formatMessage({id:"budget.item"}), isRequired: true, options: [],
        labelKey:'itemName',valueKey:'id',disabled:true,single:true, listExtraParams:{"journalTypeId":'',"companyId":''},
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
      {type: 'select', id:'currency',label:  this.props.intl.formatMessage({id:"budget.currency"}), isRequired: true, options:currencyOptions,event:'currency',
        labelKey:'attribute5',valueKey:'attribute4',
        columnLabel: 'currency', columnValue: 'currency'
      }, //币种
      {type: 'inputNumber', id:'rate', precision:2,label:this.props.intl.formatMessage({id:"budget.rate"}), isRequired: true,event:'rate',disabled: true},  //汇率
      {type: 'inputNumber', id:'amount',precision:2, label:  this.props.intl.formatMessage({id:"budget.amount"}), isRequired: true,
        step:10, defaultValue:0, event:'amount'},  //金额
      {type: 'inputNumber', id:'functionalAmount', precision:2,label:  this.props.intl.formatMessage({id:"budget.functionalAmount"}),
        step:10, isRequired: true, defaultValue:0, disabled: true}, //本位金额
      {type: 'inputNumber', id:'quantity', precision:0,label:  this.props.intl.formatMessage({id:"budget.quantity"}),step:1,defaultValue:0,min:0}, //数量
      {type: 'input', id:'remark', label:  this.props.intl.formatMessage({id:"budget.remark"})}  //备注
    ];
    this.setState({ searchForm })
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.params && JSON.stringify(nextProps.params) !== "{}" ){
      if(nextProps.params.isNew === false){
        this.state.rate=nextProps.params.rate;
        rateData=nextProps.params.rate;
      }else {}
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
      //预算项目控制
      if(nextProps.params.journalTypeId && this.state.journalTypeIdFlag){
        this.setState({
          journalTypeIdFlag:false,
        },()=>{
          this.getItemUrl(nextProps.params.company[0].id);
        })
      }

      if(nextProps.params.id !== this.props.params.id){

        if(nextProps.params.journalTypeId && !this.state.journalTypeIdFlag){
           if(nextProps.params.isNew){
               this.getItemAbled(true,'');
             }else {
               this.getItemAbled(false,nextProps.params.company[0].id);
             }
        }

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
    else{
      this.setState({ params : {}});
    }
  };

  getItemUrl(value){
    let searchForm = this.state.searchForm;
    let companyId = this.props.params.isNew?'':value;
      searchForm.map(searchItem => {
      if(searchItem.id === "item"){
        searchItem.listExtraParams ={"journalTypeId":this.props.params.journalTypeId,"companyId":companyId};
        if(this.props.params.isNew === true){
          searchItem["disabled"]=true;
        }else {
          searchItem["disabled"]=false;
        }
      }
    });
    this.setState({ searchForm });
  }


  //给select增加options
  getOptions = (item) => {
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
        return <Input  placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle} disabled={item.disabled}/>
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
        return <InputNumber disabled={item.disabled}  min={item.min?item.min:-Infinity} step={item.step} precision={item.precision} onChange={handle} style={{width:200}}/>
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
        <Col span={20} key={i}>
          {item.type === 'items' ? this.renderFormItem(item) :
            <FormItem {...formItemLayout} label={item.label} colon={false}>
              {getFieldDecorator(item.id, {
                initialValue:item.defaultValue,
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
    if(!this.state.params.isNew){
      oldData = this.props.params.oldData;
    }
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      let searchForm = [].concat(this.state.searchForm);
      searchForm.map((item) => {
        if (( item.type === 'select' || item.type === 'select_dimension')) {
          if (values[item.id]) {
            const value = values[item.id];
            if (typeof value === 'string') {
              if (value.indexOf(`":"`) > 1) {
                const valueObject = JSON.parse(value);
                valuesData[item.columnLabel] = valueObject[item.labelKey];
                valuesData[item.columnValue] = valueObject[item.valueKey];
                if (item.type == 'select_dimension') {
                }
                if (item.id === 'periodName') {
                  valuesData["periodYear"] = valueObject["periodYear"];
                  valuesData["periodQuarter"] = valueObject["quarterNum"];
                }
              } else {
                if (item.type == 'select_dimension') {
                  if (!this.props.params.isNew) {
                    valuesData[item.columnLabel] = oldData[item.columnLabel];
                    valuesData[item.columnValue] = oldData[item.columnValue];
                  } else {
                    let name = (this.state.dimensionDataLists[item.id]).defaultDimValueName ? (this.state.dimensionDataLists[item.id]).defaultDimValueName : null;
                    let value = (this.state.dimensionDataLists[item.id]).defaultDimValueId ? (this.state.dimensionDataLists[item.id]).defaultDimValueId : null;
                    valuesData[item.columnLabel] = name;
                    valuesData[item.columnValue] = value;
                  }
                } else {
                  valuesData[item.columnLabel] = oldData[item.columnLabel];
                  valuesData[item.columnValue] = oldData[item.columnValue];

                }
              }
            } else if (typeof value === 'number') {
              valuesData[item.columnLabel] = value;
            }
          } else {
            valuesData[item.columnLabel] = null;
            valuesData[item.columnValue] = null;
            if (item.type === "select_dimension") {

            }
          }
        }
        if (item.type === 'select_year') {
          if (values[item.id]) {
            valuesData[item.columnValue] = values[item.id];
            valuesData[item.columnLabel] = values[item.id];
          } else {
            valuesData[item.columnValue] = null;
            valuesData[item.columnLabel] = null;
          }
        }
        if (item.type === 'list') {
          if (values[item.id]) {
            if (values[item.id].length > 0) {
              const value = values[item.id][0];
              valuesData[item.columnLabel] = value[item.labelKey];
              valuesData[item.columnValue] = value[item.valueKey];
            } else {
              valuesData[item.columnLabel] = oldData[item.columnLabel];
              valuesData[item.columnValue] = oldData[item.columnValue];
            }
          } else {
            valuesData[item.columnLabel] = null;
            valuesData[item.columnValue] = null;
          }
        }
        if ((item.type === 'input' || item.type === 'inputNumber' )) {
          if (values[item.id]) {
            valuesData[item.id] = values[item.id];
          }

        }
      });
      let valuesDataClose = {};
      if (this.props.params.isNew) {
        valuesDataClose = {
          ...valuesData,
          versionNumber: 1,
          isNew: true,
        }
      } else {
        valuesDataClose = {
          ...this.props.params.oldData,
          ...valuesData,
          isNew: false
        }
      }
      this.props.close(valuesDataClose);
      this.props.form.resetFields();
      }
    })
  };



  //根据预算表id，获得维度
  getDimensionByStructureId = () =>{
    httpFetch.get(`${config.budgetUrl}/api/budget/journals/getLayoutsByStructureId?isEnabled=true&structureId=${this.props.params.structureId}`).then((resp)=>{
      this.getSearchForm(resp.data);
    }).catch(e=>{
      message.error(`获得维度失败,${e.response.data.message}`);
    })
  }

  //根据预算表,set维度表单
  getSearchForm(dimension){
    let searchForm=this.state.searchForm;
    let dimensionList ={};
    let dimensionDataLists ={};
    for(let i=0;i<dimension.length;i++){
      const item =dimension[i];
      const priority = item.sequenceNumber;
      let dimensionListKey = ["dimension"+priority+"Id","dimension"+priority+"Name","dimension"+priority+"ValueId","dimension"+priority+"ValueName","dimension"+priority];
      dimensionList[dimensionListKey[0]]=item.dimensionId;
      dimensionList[dimensionListKey[1]]=item.dimensionName;
      dimensionList[dimensionListKey[2]]=item.defaultDimValueId?item.defaultDimValueId:null;
      dimensionList[dimensionListKey[3]]=item.defaultDimValueName?item.defaultDimValueName:null;
      dimensionDataLists[dimensionListKey[4]]={
        defaultDimValueId:item.defaultDimValueId?item.defaultDimValueId:null,
        defaultDimValueName:item.defaultDimValueName?item.defaultDimValueName:null
      }
      let options=[];
      httpFetch.get(`${config.baseUrl}/api/my/cost/center/items/by/costcenterid?costCenterId=${item.dimensionId}`).then((res)=>{
        const data =res.data;
        data.map((item)=>{
          options.push({label: item.name, value: item.id, data:item})
        })
      })
      const searchFormItem={type: 'select_dimension', label:`${item.dimensionName}`, options:options,
        labelKey:'name',valueKey:'id',defaultValue:item.defaultDimValueName,
        columnLabel:`dimension${priority}ValueName`,columnValue:`dimension${priority}ValueId`
      };
      searchFormItem["id"]="dimension"+priority,
        searchFormItem["dimensionId"]=item.id;
      searchForm.push(
        searchFormItem
      )
    }
    this.setState({searchForm,dimensionDataLists,dimensionList});
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
            <Button type="primary" htmlType="submit">{this.props.intl.formatMessage({id:"common.save"})}</Button>
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
