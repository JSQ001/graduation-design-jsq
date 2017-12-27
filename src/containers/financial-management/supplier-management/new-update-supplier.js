/**
 *  created by jsq on 2017/12/18
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Input, Select, Switch, Affix, DatePicker, Icon, Badge, message, Form  } from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import Importer from 'components/template/importer'
import 'styles/financial-management/supplier-management/new-update-supplier.scss'
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class NewUpdateSupplier extends React.Component{
  constructor(props){
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      loading: false,
      isEnabled: true,
      vendorInfo: {},
      basicInfo: [
        {type: 'select', flag: 'basic', isRequired: true, label: formatMessage({id:"supplier.management.type"}), key: 'venderTypeId',//供应商类型
          options: [], url: `${config.vendorUrl}/vendor-info-service/api/ven/type/query`, valueKey: 'id', labelKey: 'supplierTypeName' ,method: 'get',
         },
        {type: 'input',flag: 'basic', isRequired: true, label: formatMessage({id:"supplier.management.code"}), key: 'venderCode' }, //供应商代码
        {type: 'input',flag: 'basic', isRequired: true,label: formatMessage({id:"supplier.management.name"}), key: 'venNickname' }, //供应商名称
        {type: 'date', flag: 'basic',isRequired: false, label: formatMessage({id:"supplier.management.commissionDate"}), key: 'effectiveDate' }, //启用日期
        {type: 'input',flag: 'basic', isRequired: false,label: formatMessage({id:"supplier.management.outerId"}), key: 'venNickOid' }, //外部标识id
        {type: 'switch',flag: 'basic', isRequired: false, label: formatMessage({id:"common.column.status"}), key: 'venType',//状态
          defaultValue: 'true'
         },
      ],
      otherInfo: [
        {type: 'select',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.industryCategories"}), key: 'industryCategories',//行业类别
          options: [],
        },                                                                       //供应商评级
        {type: 'select',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.rateLevel"}), key: 'rateLevel',
          options: [],
         },                                                                      //法人代表
        {type: 'input',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.legalRepresentative"}), key: 'legalRepresentative'},
                                                                                 //税务登记号
        {type: 'input',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.taxNumber"}), key: 'taxNumber'},
                                                                                 //联系人
        {type: 'input' , flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.person"}), key: 'person'},
                                                                                //联系人电话
        {type: 'input',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.personPhone"}), key: 'personPhone'},
                                                                                //邮箱
        {type: 'input',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.main"}), key: 'main'},
                                                                                //传真
        {type: 'input',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.facsimile"}), key: 'facsimile'},
                                                                                //国家
        {type: 'select',flag: 'other', isRequired: false, label: formatMessage({id:"supplier.management.country"}), key: 'country',
          options: [],
         },
                                                                                //地址
        {type: 'textArea', isRequired: false, label: formatMessage({id:"supplier.management.address"}), key: 'address'},
                                                                                //备注
        {type: 'textArea', isRequired: false, label: formatMessage({id:"supplier.management.remark"}), key: 'remark'},
     ]
    };
  }

  componentWillMount(){
    //获取国家
  /*  httpFetch.get(`${config.uatUrl}/location-service/api/localization/query/county?language=${this.props.language.locale ==='zh' ? "zh_cn" : "en_us"}`).then((response)=>{
      let country = [];
      response.data.map((item)=>{
        let option = {
          label: item.country,
          value: item.code+ "-"+item.country
        };
        country.push(option)
      });
      let otherInfo = this.state.otherInfo;
      otherInfo[8].options = country;
      this.setState({
        otherInfo
      })
    });
 */
    console.log(this.props)
    if(typeof this.props.params.id !== 'undefined'){
      this.setState({
        vendorInfo: this.props.params,
        isEnabled: true
      })
    }
  }



  handleChange = (key)=>{
   /* switch (key){
      case 'venType':{
        this.setState((prevState) => ({
          isEnabled: !prevState.isEnabled
        }))
      }
    }*/

  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  getOptions = (item)=> {
    httpFetch[item.method](item.url).then((response) => {
      let options = [];
      response.data.map(data => {
        options.push({label: item.renderOption ? item.renderOption(data) : data[item.labelKey], value: data[item.valueKey]})
      });
      if(item.flag === 'basic'){
        let basicInfo = this.state.basicInfo;
        basicInfo.map((searchItem)=>{
          if(searchItem.key === item.key){
            console.log(searchItem)
            searchItem.options = options;
            return ;
          }
        });
        this.setState({
          basicInfo
        })
      }else {
        let otherInfo = this.state.otherInfo;
        otherInfo = otherInfo.map((searchItem)=>{
          if(searchItem.key === item.key){
            searchItem.options = options;
          }
          return otherInfo;
        });
        this.setState({
          otherInfo
        })
      }
    });
  };

  renderFormItem(item){
    switch(item.type) {
      //输入组件
      case 'input': {
        return <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={this.handleChange(item.key)}
                      disabled={item.disabled}/>
      }
      //选择组件
      case 'select': {
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={this.handleChange(item.key)}
                  allowClear
                  showSearch
                  disabled={item.disabled}
                  labelInValue={!!item.entity}
                  onFocus={item.url ? () => this.getOptions(item) : () => {
                  }}>
            {item.options.map((option) => {
              return <Option key={option.value}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //值列表选择组件
      //switch状态切换组件
      case 'switch':{
        return <div>
                  <Switch checkedChildren={<Icon type="check"/>}
                       unCheckedChildren={<Icon type="cross" />}
                       defaultChecked={this.state.isEnabled}
                       onChange={this.switchChange}
                       disabled={item.disabled}/>
          <span className="enabled-type" style={{marginLeft:20,width:100}}>{ this.state.isEnabled ? this.props.intl.formatMessage({id:"common.status.enable"}) : this.props.intl.formatMessage({id:"common.disabled"}) }</span>
        </div>
      }
      //日期组件
      case 'date': {
        return <DatePicker format="YYYY-MM-DD" onChange={this.handleChange(item.key)} disabled={item.disabled}/>
      }
      case 'textArea': {
        return <TextArea placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})}/>
      }
    }
  }

  getFields = (array) =>{
    const { getFieldDecorator } = this.props.form;
    const { vendorInfo} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 0 },
    };
    let children = [];
    array.map((item=>{
      children.push(
        <FormItem {...formItemLayout} key={item.key} label={item.label}>
          {getFieldDecorator(`${item.key}`, {
            valuePropName: item.type === 'switch' ? 'checked' : 'value',
            initialValue: item.type === 'switch' ? this.state.isEnabled : vendorInfo[item.key],
            rules: [{
              required: item.isRequired,
              message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: item.label}),  //name 不可为空
            }]
          })(
            this.renderFormItem(item)
          )}
        </FormItem>)
    }));
    return children;
  };

  handleSubmit = (e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        values.venType = values.venType ? 1001 : 1002;
        values.effectiveDate = values.effectiveDate.getTime();
        httpFetch.post(`${config.vendorUrl}/vendor-info-service/api/ven/info/insert`,values).then((response)=>{
          console.log(response)
          this.props.form.resetFields();
          this.props.close(true);
          message.success(`${this.props.intl.formatMessage({id:"common.save.success"},{name:""})}`);

        }).catch(e=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.message}`);
          }
        })
      }
    })
  };

  onCancel = ()=>{
  this.props.close();
};

  render() {
    const { basicInfo, otherInfo, loading} = this.state;
    const {formatMessage} = this.props.intl;
    return (
      <div className="new-update-supplier">
        <Form onSubmit={this.handleSubmit}>
        <div className="new-update-supplier-basic">
          <div className="basic-icon"/>
          <div className="basic-title">
            {formatMessage({id:"supplier.management.basicInfo"})}
          </div>
          <div className="basic-content">
            {this.getFields(basicInfo)}
          </div>
        </div>
        <div className="new-update-supplier-other">
          <div className="other-icon"/>
          <div className="other-title">
            {formatMessage({id:"supplier.management.otherInfo"})}
          </div>
          <div className="other-content">
            {this.getFields(otherInfo)}
          </div>
        </div>
          <Affix offsetTop={120}>
            <div className="form-footer-button">
              <Button type="primary" htmlType="submit"  loading={loading}>{formatMessage({id:"common.save"})}</Button>
              <Button style={{marginLeft:10}} onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
            </div>
          </Affix>
        </Form>
      </div>)
  }
}

NewUpdateSupplier.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    language: state.main.language,
  }
}
const WrappedNewUpdateSupplier = Form.create()(NewUpdateSupplier);

export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateSupplier));
