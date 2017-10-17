/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Input, Select, DatePicker, Switch, Icon, Table, Popconfirm,InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import debounce from 'lodash.debounce';

import Chooser from  'components/Chooser'
import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'



class NewBudgetJournalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      organization:{},
      searchForm: [

        /*公司*/
        {type: 'list', id:'company', label: this.props.intl.formatMessage({id:"budget.companyId"}), listType: 'company',isRequired: true, labelKey: 'companyName', valueKey: 'companyCode'},
        /*部门*/
        {type: 'select', id:'unitId', label:  this.props.intl.formatMessage({id:"budget.unitId"}), isRequired: true, options: []},
        /*预算项目*/
        {type: 'select', id:'item', label:  this.props.intl.formatMessage({id:"budget.Item"}), isRequired: true, options: [],
          labelKey:'itemName',valueKey:'id',
          url:`${config.budgetUrl}/api/budget/items/find/all`,
        },
        /*期间*/
        {type: 'select', id:'periodName', label:  this.props.intl.formatMessage({id:"budget.periodName"}), isRequired: true, options: []},
        /*季度*/
        {type: 'select', id:'periodQuarter"', label:  this.props.intl.formatMessage({id:"budget.periodQuarter"}), isRequired: true, options: []},
        /*年度*/
        {type: 'select', id:'periodYear', label:  this.props.intl.formatMessage({id:"budget.periodYear"}), isRequired: true, options: []},
        /*币种*/
        {type: 'select', id:'currency', label:  this.props.intl.formatMessage({id:"budget.currency"}), isRequired: true, options: []},
        /*汇率类型*/
        {type: 'select', id:'rateType', label:  this.props.intl.formatMessage({id:"budget.rateType"}), isRequired: true, options: []},
        /*标价方法*/
        {type: 'select', id:'rateQuotation', label:  this.props.intl.formatMessage({id:"budget.rateQuotation"}), isRequired: true, options: []},
        /*汇率*/
        {type: 'select', id:'rate', label:  this.props.intl.formatMessage({id:"budget.rate"}), isRequired: true, options: []},
        /*金额*/
        {type: 'inputNumber', id:'amount', label:  this.props.intl.formatMessage({id:"budget.amount"}), isRequired: true, defaultValue:0},
        /*本位金额*/
        {type: 'inputNumber', id:'functionalAmount', label:  this.props.intl.formatMessage({id:"budget.functionalAmount"}), isRequired: true,defaultValue:0},
        /*数字*/
        {type: 'inputNumber', id:'quantity', label:  this.props.intl.formatMessage({id:"budget.quantity"}), isRequired: true,defaultValue:0},
        /*单位*/
        {type: 'select', id:'unit', label:  this.props.intl.formatMessage({id:"budget.unit"}), isRequired: true, options: []},
        /*备注*/
        {type: 'input', id:'remark', label:  this.props.intl.formatMessage({id:"budget.remark"}), isRequired: true, options: []},
        /*维度*/


      ],
      typeOptions: [],

    };
    this.setOptionsToFormItem = debounce(this.setOptionsToFormItem, 250);

  }

  //获取预算组织
  getOrganization(){
    console.log("Youcdscsdc")
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/organization/by/login`).then((request)=>{
      console.log(request.data)
      this.setState({
        organization:request.data
      })
    })
  }

  componentWillMount(){
    console.log("yujuyuyj")
    httpFetch.get(`${config.budgetUrl}/api/budget/organizations/default/organization/by/login`).then((request)=>{
      console.log(request);
      this.setState({
        organization:request.data
      })
    }).catch((e)=>{
      console.log("失败")
    })
  }




  search = (e) => {
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    for(let id in values){
      this.state.searchForm.map(item => {
        if(item.id === id){
          if(item.type === 'multiple'){
            values[id].map(value => {
              value.value = JSON.parse(value.key);
              value.key = value.value[item.valueKey];
              delete value.title;
              return value
            })
          }
          if(item.type === 'combobox'){
            if(values[id]){
              values[id].value = JSON.parse(values[id].key);
              values[id].key = values[id].value[item.valueKey];
              delete values[id].title;
            }
          }
        }
      });
    }
    console.log(values);
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


  //获得值列表里面的数据
  setOptionsToFormItemSelect=(item,url)=>{
    console.log(this.state.organization)
    console.log(item);
    let params = {};
    let path = item.url;
    let organizationId ;
    if(item.id=="item"){
      path = path+`?organizationId=1`
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
      //日期组件
      case 'date':{
        return <DatePicker format="YYYY-MM-DD" onChange={handle} disabled={item.disabled}/>
      }
      case 'switch':{
        return <Switch defaultChecked={item.defaultValue} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={handle} disabled={item.disabled}/>
      }

      //数字选择InputNumber

      case 'inputNumber':{
        return <InputNumber disabled={item.disabled} onChange={handle} min={0}/>
      }

      //带搜索的选择组件
      case 'combobox':{
        return <Select
          labelInValue
          showSearch
          allowClear
          placeholder={item.placeholder}
          filterOption={!item.searchUrl}
          optionFilterProp='children'
          onFocus={item.getUrl ? () => this.setOptionsToFormItem(item, item.getUrl) : () => {}}
          onSearch={item.searchUrl ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key,  handle) : handle}
          disabled={item.disabled}
        >
          {item.options.map((option)=>{
            return <Option key={option.key} value={JSON.stringify(option.value)}>{option.label}</Option>
          })}
        </Select>
      }
      //带搜索的多选组件
      case 'multiple':{
        return <Select
          mode="multiple"
          labelInValue
          placeholder={item.placeholder}
          filterOption={!item.searchUrl}
          optionFilterProp='children'
          onFocus={item.getUrl ? () => this.setOptionsToFormItem(item, item.getUrl) : () => {}}
          onSearch={item.searchUrl ? (key) => this.setOptionsToFormItem(item, item.searchUrl, key, handle) : handle}
          disabled={item.disabled}
        >
          {item.options.map((option)=>{
            return <Option key={option.key} value={JSON.stringify(option.value)}>{option.label}</Option>
          })}
        </Select>
      }
      //弹出框列表选择组件
      case 'list':{
        return <Chooser placeholder={item.placeholder}
                        disabled={item.disabled}
                        type={item.listType}
                        labelKey={item.labelKey}
                        valueKey={item.labelKey}
                        listExtraParams={item.listExtraParams}
                        selectorItem={item.selectorItem}/>
      }
      //同一单元格下多个表单项组件
      case 'items':{
        return (
          <Row gutter={10} key={item.id}>
            {item.items.map(searchItem => {
              return (
                <Col span={parseInt(24 / item.items.length)} key={searchItem.id}>
                  <FormItem label={searchItem.label} colon={false}>
                    {this.props.form.getFieldDecorator(searchItem.id, {
                      initialValue: searchItem.defaultValue,
                      rules: [{
                        required: searchItem.isRequired,
                        message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: searchItem.label}),  //name 不可为空
                      }]
                    })(
                      this.renderFormItem(searchItem)
                    )}
                  </FormItem>
                </Col>
              )}
            )}
          </Row>
        )
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
                initialValue: item.defaultValue,
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

  HandleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
    })

  }

  onCancel=()=>{
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

  //获得预算项目
  getItem=()=>{
    httpFetch.get().then((req)=>{

    })
  }

  render(){
    return (
      <Form onSubmit={this.HandleSubmit}>
      <div className="base-condition">
        <Row gutter={40} className="base-condition-content">{this.getFields()}</Row>
      </div>
        <div className="slide-footer">
          <Button type="primary" htmlType="submit"  loading={this.state.loading}>{this.props.intl.formatMessage({id:"common.save"})}</Button>
          <Button onClick={this.onCancel}>{this.props.intl.formatMessage({id:"common.cancel"})}</Button>
        </div>
      </Form>

    )
  }

}

const WrappedNewBudgetJournalDetail = Form.create()(NewBudgetJournalDetail);

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetJournalDetail));
