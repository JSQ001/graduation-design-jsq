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
    const { formatMessage } = this.props.intl;
    this.state = {
      searchForm: [
        {
          /*银行名称*/
          type: 'list', label: formatMessage({ id: "bank.account.bankName"}), id: "bankName", options: [], listType: 'bank_account',
          labelKey: 'bankName', valueKey: 'bankName', isRequired: true, event: "BANK_NAME", single: true
        },
        {
          /*开户行所在地——国家*/
          type: 'select', label: formatMessage({ id: "bank.account.country" }), id: "countryInfo", options: [], method: 'get',
          getUrl: `https://apiuat.huilianyi.com/location-service/api/localization/query/county`,
          labelKey: 'country', valueKey: 'code', isRequired: true, event: "COUNTRY", entity: true
        },
        {
          type: 'cascader', id: 'accountOpening', options: [], event: 'ADDRESS_CHANGE', label: formatMessage({ id: "bank.account.opening" })
           /*开户地*/
        },
        {
          /*银行详细地址*/
          type: 'input', label: formatMessage({ id: "bank.account.bankAddress" }), id: "bankAddress", isRequired: true
        },
        {
          /*银行账户名称*/
          type: 'input', label: formatMessage({ id: "bank.account.bankAccountName" }), id: "bankAccountName", isRequired: true
        },
        {
          /*银行账户账号*/
          type: 'input', label: formatMessage({ id: "bank.account.bankAccountNumber" }), id: "bankAccountNumber", isRequired: true
        },
        {
          /*开户支行Swift Code*/
          type: 'input', label: formatMessage({ id: "bank.account.swiftCode" }), id: "swiftCode", isRequired: true
        },
        {
          /* 币种*/
          type: 'select', label: formatMessage({ id: "bank.account.currencyCode" }), id: "currencyCode", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/standard/currency/getAll?language=chineseName`,
          labelKey: 'currencyName', valueKey: 'currency', isRequired: true
        },
        {
          /* 银行科目*/type: 'select', label: formatMessage({ id: "bank.account.accountCode" }), id: "accountCode", options: [], method: 'get',
          getUrl: `${config.baseUrl}/api/company/by/tenant`,
          labelKey: 'name', valueKey: 'id'
        },
        {
          /*备注*/
          type: 'input', label: formatMessage({ id: "bank.account.remark" }), 
            id: "remark",
        },
        {/*状态*/
          type: 'switch', label: formatMessage({ id: "bank.account.state" }), id: "enabled", defaultValue: true, isRequired: true
        }
      ],
      startDateActive: null,
      endDateActive: null,

      companyMaintainPage: menuRoute.getRouteItem('company-maintain', 'key'),                 //公司维护
      newCompanyMaintainPage: menuRoute.getRouteItem('new-company-maintain', 'key'),          //公司新建
      companyMaintainDetailPage: menuRoute.getRouteItem('company-maintain-detail', 'key'),    //公司详情
      bankAccountDetailPage: menuRoute.getRouteItem('bank-account-detail', 'key'),                   //银行账户详情

      loading: false,
      businessTypeOptions: [],
      bankCode: ''
    };
  }


  componentDidMount() {
    
  }

  //搜索区域点击事件
  searchEventHandle = (event, value) => {

    switch (event) {
      case 'BANK_NAME': {
        if (value === this.state.nowType || !value || !value.length)
          return;

        let bankInfo = value[0];

        this.formRef._reactInternalInstance._renderedComponent._instance.setValues({
          country: { label: bankInfo.countryName, value: bankInfo.countryCode }, city: bankInfo.cityName, bankAddress: bankInfo.address, bankName: bankInfo.bankName, swiftCode: bankInfo.swiftCode
        });
        this.setState({ bankCode: bankInfo.bankCode });
        break;
      }
      case 'COUNTRY': {
        if (!value || value === this.state.nowType)
          return;

        let { searchForm} = this.state;

        httpFetch.get(`https://apiuat.huilianyi.com/location-service/api/localization/query/all/address?code=${value.code}`).then((response) => {

          searchForm[2].options = response.data;

          this.setState({
            searchForm,
          })
        });
        break;
      }
    }
  };

  //保存新建公司
  handleSave = (values) => {

    if (values.bankName && values.bankName.length) {
      values.bankName = values.bankName[0];
    }

    if (values.accountOpening && values.accountOpening.length) {
      values.provinceCode = values.accountOpening[0].split("-")[0];
      values.province = values.accountOpening[0].split("-")[1];
      values.cityCode = values.accountOpening[1].split("-")[0];
      values.city = values.accountOpening[1].split("-")[1];
    }

    values.bankCode = this.state.bankCode;
    values.bankKey = "00001";
    values.companyId = this.props.params.companyId;
    values.country = values.countryInfo.country;
    values.countryCode = values.countryInfo.countryCode;
    values.accountCode = '0000';

    delete values.accountOpening;
    delete values.countryInfo;

    httpFetch.post(`${baseUrl}/api/CompanyBank/insertOrUpdate`, values).then((res) => {
      
      //跳转到详情页面
      let path = this.state.bankAccountDetailPage.url.replace(":companyBankId", res.data.id);
      this.context.router.push(path);

    }).catch((e) => {
      this.setState({ loading: false });
      message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
    })
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
            okText={formatMessage({id: "common.save"})}
            maxLength={100}
            clearText={formatMessage({ id: "common.cancel" })}
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
