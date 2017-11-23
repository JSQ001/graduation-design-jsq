/**
 * Created by 13576 on 2017/11/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Form, Switch, Icon, Input, Select, Button, Row, Col, message, DatePicker} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class WrappedNewBankAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {
          /*开户银行*/
          type: 'select', label:"开户银行", id: "11", options: [], method: 'get',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksCode', valueKey: 'id', isRequired: true
        },
        {
          /*银行代码*/
          type: 'select', label: "银行代码",id: "12", options: [], method: 'get',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksCode', valueKey: 'id', isRequired: true   },
        {
          /*开户行联行号*/
          type: 'value_list', label:"开户行联行号", id: "companyType", options: [], valueListCode:1011,isRequired: true
        },
        {
          /*开户支行名称*/
          type: 'select', label: "开户支行名称", id: "13", options: [], method: 'get',
          getUrl:`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`,
          labelKey: 'setOfBooksCode', valueKey: 'id', isRequired: true
        },
        {
          /*开户行所在地——国家*/
          type: 'select', label: "开户行所在地——国家", id: "14", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/all/legalentitys`,
          labelKey: 'entityName', valueKey: 'id',isRequired: true
        },
        {
          /*省/市/县*/
          type: 'select', label:"省/市/县", id: "15", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/companyLevel/selectByTenantId`,
          labelKey: 'description', valueKey: 'id', isRequired: true
        },
        {
          /*开户支行Swift Code*/
          type: 'input', label:"开户支行Swift Code", id: "1", isRequired: true
        },
        {
          /*银行账户名称*/
          type: 'input', label:"银行账户名称", id: "2", isRequired: true
        },
        {
          /*银行账户账号*/
          type: 'input', label:"银行账户账号", id: "3", isRequired: true
        },
        {
          /*账户代码*/
          type: 'input', label:"账户代码", id: "4", isRequired: true
        },
        {
          /* 币种*/
          type: 'select', label:"币种", id: "parentCompanyId", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id', isRequired: true
        },
        {
          /* 银行科目*/type: 'select', label:"银行科目", id: "54", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id'
        },

        {/*状态*/
          type:'switch', label:'状态', id:"enabled", defaultValue:true, isRequired: true
        }
        ,
        {
          /*备注*/
          type: 'input', label:"备注", id: "5555",
        },


      ],
      startDateActive: null,
      endDateActive: null,

      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newCompanyMaintainPage: menuRoute.getRouteItem('new-company-maintain', 'key'),          //公司新建
      companyMaintainDetailPage: menuRoute.getRouteItem('company-maintain-detail', 'key'),    //公司详情
      bankAccountDetailPage: menuRoute.getRouteItem('bank-account-detail','key'),                   //银行账户详情

      loading: false,
      businessTypeOptions: []
    };
  }


  componentWillMount() {

  }

  //处理表单事件
  handleEvent = (value, event) => {
    switch (event) {
      case 'startDateActive': {
        this.setState({
          startDateActive: value,
        });
      }
      case 'endDateActive': {
        this.setState({
          endDateActive: value,
        });
      }

    }
  };

  //处理时间
  HandleDisabledDate = (value, event) => {
    if (event == 'startDateActive') {
      if (!this.state.endDateActive || !value) {
        return false
      }
      return value.valueOf() > this.state.endDateActive.valueOf();
    }
    else if (event == 'endDateActive') {
      if (!this.state.startDateActive || !value) {
        return false;
      }
      return value.valueOf() <= this.state.startDateActive.valueOf();
    }
  }

  //得到值列表的值增加options
  getValueListOptions = (item) => {
    if (item.options.length === 0 || (item.options.length === 1 && item.options[0].temp)) {
      this.getSystemValueList(item.valueListCode).then(res => {
        let options = [];
        res.data.values.map(data => {
          options.push({label: data.messageKey, value: data.code, data: data})
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map(searchItem => {
          if (searchItem.id === item.id)
            searchItem.options = options;
          if (searchItem.type === 'items')
            searchItem.items.map(subItem => {
              if (subItem.id === item.id)
                subItem.options = options;
            });
          return searchItem;
        });
        this.setState({searchForm});
      })
    }
  };


  //给select增加options
  getOptions = (item) => {
    if (item.options.length === 0 || (item.options.length === 1 && item.options[0].temp)) {
      let url = item.getUrl;
      if (item.method === 'get' && item.getParams) {
        url += '?';
        let keys = Object.keys(item.getParams);
        keys.map(paramName => {
          url += `&${paramName}=${item.getParams[paramName]}`
        })
      }
      httpFetch[item.method](url, item.getParams).then((res) => {
        let options = [];
        res.data.map(data => {
          options.push({label: data[item.labelKey], key: data[item.valueKey], value: data})
        });
        let searchForm = this.state.searchForm;
        searchForm = searchForm.map(searchItem => {
          if (searchItem.id === item.id)
            searchItem.options = options;
          if (searchItem.type === 'items')
            searchItem.items.map(subItem => {
              if (subItem.id === item.id)
                subItem.options = options;
            });
          return searchItem;
        });
        this.setState({searchForm});
      })
    }
  };


  onChangeSelect = (item, value, index) => {
    let valueWillSet = {};
    let searchForm = this.state.searchForm;
    if (index !== undefined) {
      searchForm[index].items = searchForm[index].items.map(searchItem => {
        if (searchItem.id === item.id) {
          valueWillSet[searchItem.id] = value.key + '';
          if (searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)) {
            let dataOption = {};
            dataOption[item.valueKey] = value.key;
            dataOption[item.labelKey] = value.label;
            searchItem.options.push({label: value.label, key: value.key, value: dataOption, temp: true})
          }
        }
        return searchItem;
      });
    } else {
      searchForm = searchForm.map(searchItem => {
        if (searchItem.id === item.id) {
          valueWillSet[searchItem.id] = value.key + '';
          if (searchItem.options.length === 0 || (searchItem.options.length === 1 && searchItem.options[0].temp)) {
            let dataOption = {};
            dataOption[item.valueKey] = value.key;
            dataOption[item.labelKey] = value.label;
            searchItem.options.push({label: value.label, key: value.key, value: dataOption, temp: true})
          }
        }
        return searchItem;
      });
    }
    this.setState({searchForm}, () => {
      this.props.form.setFieldsValue(valueWillSet);
    });
    let handle = item.event ? (event) => this.handleEvent(event, item.event) : () => {
    };
    handle();
  };

  //渲染搜索表单组件
  renderFormItem(item) {
    let handle = item.event ? (event) => this.handleEvent(event, item.event) : () => {
    };
    let disabledDate = item.event ? (event) => this.HandleDisabledDate(event, item.event) : () => {
    };
    switch (item.type) {
      //输入组件
      case 'input': {
        return <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle}
                      disabled={item.disabled}/>
      }
      case 'input_long': {
        return <Input placeholder={this.props.intl.formatMessage({id: 'common.please.enter'})} onChange={handle}
                      disabled={item.disabled} style={{width: 600}}/>
      }
      //选择组件
      case 'select': {
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  disabled={item.disabled}
                  allowClear
                  labelInValue={!!item.entity}
                  onFocus={item.getUrl ? () => this.getOptions(item) : () => {
                  }}>
            {item.options.map((option) => {
              return <Option key={'' + option.key} title={JSON.stringify(option.value)}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //值列表选择组件
      case 'value_list': {
        return (
          <Select placeholder={this.props.intl.formatMessage({id: 'common.please.select'})}
                  onChange={handle}
                  disabled={item.disabled}
                  allowClear
                  labelInValue={!!item.entity}
                  onFocus={() => this.getValueListOptions(item)}>
            {item.options.map((option) => {
              return <Option key={option.value}
                             title={option.data ? JSON.stringify(option.data) : ''}>{option.label}</Option>
            })}
          </Select>
        )
      }
      //switch状态切换组件
      case 'switch':{
        return <Switch checkedChildren={<Icon type="check"/>}
                       unCheckedChildren={<Icon type="cross" />}
                       onChange={handle}
                       disabled={item.disabled}/>
      }
      //日期组件
      case 'date': {
        return <DatePicker format="YYYY-MM-DD" onChange={handle} disabled={item.disabled} disabledDate={disabledDate}
                           style={{width: '100%'}}/>
      }
    }
  }

  getFields = () => {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {};
    const children = [];
    this.state.searchForm.map((item, i) => {
      children.push(
        <Col span={8} key={item.id}>
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

//保存新建公司
  handleSave = (e) => {
    e.preventDefault();
    let path = this.state.bankAccountDetailPage.url;
    this.context.router.push(path);
    this.props.form.validateFieldsAndScroll((err, values) => {

   /*   const valuesData = {
        ...values,
      }
      console.log(valuesData);

      if (!err) {
        this.setState({loading: true});
        httpFetch.post(`${config.baseUrl}/api/refactor/tenant/company/register`, valuesData).then((res) => {
          this.setState({loading: false});
          message.success(`公司新建成功`);
          let path = this.state.companyMaintainDetailPage.url.replace(":companyOId", value.companyOId);
          this.context.router.push(path);
        }).catch((e) => {
          if (e.response) {
            message.error(`新建失败`);
            this.setState({loading: false});
          } else {
            console.log(e)
          }
        })
      }*/
    });
  };

  render() {

    const {getFieldDecorator} = this.props.form;
    const {formatMessage} = this.props.intl;
    const formItemLayout = {};
    return (
      <div>
        <div className="common-top-area">
          <Form  onSubmit={this.handleSave}>
            <Row gutter={40} type="flex" align="top">
              {this.getFields()}
            </Row>
            <Row type="flex" align="top">
              <Col span={8}>
                <Button htmlType="submit" type="primary">保存</Button>
                <Button style={{marginLeft: 8}} onClick={() => {
                  this.context.router.push(this.state.budgetOrganization.url.replace(":id", this.props.organization.id) + '?tab=JOURNAL_TYPE');
                }}>取消</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

WrappedNewBankAccount.contextTypes = {
  router: React.PropTypes.object
};

const NewBankAccount = Form.create()(WrappedNewBankAccount);

export default connect(mapStateToProps)(injectIntl(NewBankAccount));
