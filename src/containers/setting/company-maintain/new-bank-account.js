/**
 * Created by 13576 on 2017/11/22.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Switch, Icon, Input, Select, Button, Row, Col, message, DatePicker } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import SearchArea from 'components/search-area'

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class WrappedNewBankAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {
          /*银行名称*/
          type: 'list', label: "银行名称", id: "bankName", options: [], listType: 'user',
          labelKey: 'fullName', valueKey: 'userOID', isRequired: true, placeholder: '请输入银行名称', event: "BANK_NAME", single: true
        },
        {
          /*开户行所在地——国家*/
          type: 'select', label: "国家", id: "country", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/all/legalentitys`,
          labelKey: 'entityName', valueKey: 'id', isRequired: true
        },
        {
          /*开户地*/
          type: 'select', label: "开户地", id: "city", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/companyLevel/selectByTenantId`,
          labelKey: 'description', valueKey: 'id', isRequired: true
        },
        {
          /*银行详细地址*/
          type: 'input', label: "银行详细地址", id: "bankDetailAddress", isRequired: true
        },
        {
          /*银行账户名称*/
          type: 'input', label: "银行账户名称", id: "bankAccountName", isRequired: true
        },
        {
          /*银行账户账号*/
          type: 'input', label: "银行账户账号", id: "bankAccountNumber", isRequired: true
        },
        {
          /*开户支行Swift Code*/
          type: 'input', label: "开户支行Swift Code", id: "swiftCode", isRequired: true
        },
        {
          /*账户代码*/
          type: 'input', label: "账户代码", id: "accountCode", isRequired: true
        },
        {
          /* 币种*/
          type: 'select', label: "币种", id: "currencyCode", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id', isRequired: true
        },
        {
          /* 银行科目*/type: 'select', label: "银行科目", id: "54", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id'
        },
        {
          /*备注*/
          type: 'input', label: "备注", id: "5555",
        },
        {/*状态*/
          type: 'switch', label: '状态', id: "enabled", defaultValue: true, isRequired: true
        }
      ],
      startDateActive: null,
      endDateActive: null,

      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newCompanyMaintainPage: menuRoute.getRouteItem('new-company-maintain', 'key'),          //公司新建
      companyMaintainDetailPage: menuRoute.getRouteItem('company-maintain-detail', 'key'),    //公司详情
      bankAccountDetailPage: menuRoute.getRouteItem('bank-account-detail', 'key'),                   //银行账户详情

      loading: false,
      businessTypeOptions: []
    };
  }

  componentWillMount() {
    // this.infoRef._reactInternalInstance._renderedComponent._instance.setValues({ 'bankDetailAddress': '3443' })
  }

  componentDidMount() {
    // this.infoRef._reactInternalInstance._renderedComponent._instance.setValues({ 'bankDetailAddress': '3443' });
    // console.log(3);
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
          options.push({ label: data.messageKey, value: data.code, data: data })
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
        this.setState({ searchForm });
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
          options.push({ label: data[item.labelKey], key: data[item.valueKey], value: data })
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
        this.setState({ searchForm });
      })
    }
  };


  onChangeSelect = (item, value, index) => {
    console.log(value);

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
            searchItem.options.push({ label: value.label, key: value.key, value: dataOption, temp: true })
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
            searchItem.options.push({ label: value.label, key: value.key, value: dataOption, temp: true })
          }
        }
        return searchItem;
      });
    }
    this.setState({ searchForm }, () => {
      this.props.form.setFieldsValue(valueWillSet);
    });
    let handle = item.event ? (event) => this.handleEvent(event, item.event) : () => {
    };
    handle();
  };

  //搜索区域点击事件
  searchEventHandle = (event, value) => {
    console.log(222222);
    switch (event) {
      case 'BANK_NAME': {
        if (value === this.state.nowType)
          return;



        // this.setState({ country: ''}, () => {
        //   // this.clearRowSelection();
        //   // this.getList();
        // });
        break;
      }
    }
  };

  // ok = () => {
  //   this.formRef._reactInternalInstance._renderedComponent._instance.setValues({ 'bankDetailAddress': '3443' });
  //   console.log(1);
  // }

  //保存新建公司
  handleSave = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      let toValue = {
        ...this.props.params,
        ...values,
      }
      console.log(toValue);

      httpFetch.post(`${config.baseUrl}/api/companyBank/insertOrUpdate`, toValue).then((res) => {
        this.setState({ loading: false });
        this.props.form.resetFields();
        this.props.close(true);
        let path = this.state.bankAccountDetailPage.url;
        this.context.router.push(path);
        message.success(this.props.intl.formatMessage({ id: "common.create.success" }, { name: `公司账户` }));
      }).catch((e) => {
        this.setState({ loading: false });
        message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
      })


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

    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {};
    const { searchForm } = this.state;
    return (
      <div>
        <div className="common-top-area">
          <SearchArea
            wrappedComponentRef={(inst) => this.formRef = inst}
            searchForm={searchForm}
            okText="确定"
            maxLength={100}
            clearText="取消"
            eventHandle={this.searchEventHandle}
            submitHandle={this.handleSave}
          />
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
