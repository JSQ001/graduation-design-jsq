/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {Button, Col, Row, Select, Form, Input, message, Card} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import Chooser from  'components/Chooser';
import UploadFile from 'components/upload.js'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import "styles/budget/budget-journal/new-budget-journal.scss"

class NewBudgetJournalFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetJournalDetailPage: menuRoute.getRouteItem('budget-journal-detail', 'key'),    //预算日记账详情
      budgetJournalPage: menuRoute.getRouteItem('budget-journal', 'key'),    //预算日记账
      idSelectJournal: false,
      isStructureIn: false,
      structureGroup: [],
      periodStrategy: [],
      periodPeriodQuarter: [],
      periodPeriod: [],
      structureFlag: true,
      periodFlag: true,
      periodYearFlag: true,
      periodQuarterFlag: true,
      periodStrategyFlag: true,
      file: {},
      attachmentOID: [],
    };
  }



  componentWillMount() {
    console.log(this.props.company)
    console.log(this.props.user)
    this.getPeriodStrategy();
    this.getPeriodQuarter();
    this.getPeriod();
  }


  //获取编制期段
  getPeriodStrategy = () => {
    this.getSystemValueList(2002).then((response) => {
      console.log(response.data);
      let periodStrategy = [];
      response.data.values.map((item) => {
        let option = {
          key: item.code,
          label: item.messageKey
        };
        periodStrategy.push(option);
      });
      this.setState({
        periodStrategy: periodStrategy,
      })
    });
  };

//获取季度
  getPeriodQuarter = () => {
    this.getSystemValueList(2021).then((response) => {
      let periodPeriodQuarter = [];
      response.data.values.map((item) => {
        let option = {
          key: item.code,
          label: item.messageKey
        };
        periodPeriodQuarter.push(option);
      });
      this.setState({
        periodPeriodQuarter: periodPeriodQuarter
      })
    });
  };

  //获取期间
  getPeriod = () => {
    console.log(this.props.user);
    console.log(this.props.company);
    //
    httpFetch.get(`${config.baseUrl}/api/company/group/assign/query/budget/periods?setOfBooksId=${this.props.company.setOfBooksId}`).then((response) => {
      console.log(response.data);
      let periodPeriod = [];
      response.data.map((item) => {
        let option = {
          value: item,
          key: item.periodName,
          label: item.periodName
        };
        periodPeriod.push(option);
      });
      this.setState({
        periodPeriod: periodPeriod
      })
    })

  };

  //保存日记账头
  saveHeard = (value) => {
    httpFetch.post(`${config.budgetUrl}/api/budget/journals`, value).then((response) => {
      let path = this.state.budgetJournalDetailPage.url.replace(":journalCode", response.data.dto.journalCode);
      this.context.router.push(path);
    })
  };


  //处理表单数据
  handleFrom = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const period = value.periodName ? JSON.parse(value.periodName) : '';
        const periodName = period.periodName;
        const periodYear = period.periodYear;
        //处理期间
        let periodNameData;
        console.log(periodName);
        if (periodName != '' && periodName != null && periodName != undefined) {

          const periodNameArray = periodName.split("-");
          for (let i = 0; i < periodNameArray.length; i++) {
            console.log(periodNameArray[i]);
            if (periodNameArray[i] != periodYear) {
              periodNameData = periodYear + "" + periodNameArray[i]
            }
          }
        } else {
          periodNameData = '';
        }

        let userData = {
          "dto": {
            "companyId": this.props.company.id,
            "companyName": this.props.company.name,
            "organizationId": this.props.organization.id,
            "organizationName": this.props.organization.organizationName,
            "structureId": value.structureId,
            "structureName": "structureName",
            "description": "",
            "reversedFlag": "N",
            "sourceBudgetHeaderId": undefined,
            "sourceType": undefined,
            "employeeId": this.props.user.id,
            "employeeName": this.props.user.fullName,
            "unitName": "periodNumber",
            'versionId': value.versionName[0].id,
            'versionName': value.versionName[0].versionName,
            'scenarioId': value.scenarioName[0].id,
            'scenarioName': value.scenarioName[0].scenarioName,
            "status": "NEW",
            "journalTypeId": value.journalTypeName[0].id,
            "journalTypeName": value.journalTypeName[0].journalTypeName,
            "periodStrategy": value.periodStrategy,
            "versionNumber": "1",
            "attachmentOID": this.state.attachmentOID,
          }
          ,
          "list": []
        };
        console.log(userData);
        this.saveHeard(userData);
      }
    })
  };


  //根据账套类型，获得预算表
  getStructure(value) {
    httpFetch.get(`${config.budgetUrl}/api/budget/journal/type/assign/structures/queryStructureId?journalTypeId=${value}`).then(response => {
      console.log(response.data);
      this.setState(
        {
          structureGroup: response.data,
        }
      )
    })
  }


  //选择预算表时，获得期间段
  handleSelectChange = (values) => {
    console.log(values);
    const data = new Date();
    const year = data.getFullYear();
    const month = data.getMonth() + 1;
    const po = (month < 2 ? 2 : month);
    const quarter = parseInt((po - 1) / 3 + 1);
    console.log(values);
    this.state.structureGroup.map((item) => {
      if (item.id == values) {
        const periodStrategy = item.periodStrategy;
        if (periodStrategy == 'MONTH') {
          this.props.form.setFieldsValue({
            periodYear: ''
          });

          this.props.form.setFieldsValue({
            periodQuarter: ''
          });
          this.props.form.setFieldsValue({
            periodName: ''
          });
          this.setState({
            periodYearFlag: true,
            periodQuarterFlag: true,
            periodFlag: false
          })
        } else if (periodStrategy == 'YEAR') {
          this.props.form.setFieldsValue({
            periodYear: year
          });
          this.props.form.setFieldsValue({
            periodQuarter: ''
          });
          this.props.form.setFieldsValue({
            periodName: ''
          });
          this.setState({
            periodFlag: true,
            periodQuarterFlag: true,
            periodYearFlag: false,
          })
        } else {
          this.props.form.setFieldsValue({
            periodYear: year
          });

          this.props.form.setFieldsValue({
            periodQuarter: quarter
          });
          this.props.form.setFieldsValue({
            periodName: ''
          });
          this.setState({
            periodFlag: true,
            periodYearFlag: false,
            periodQuarterFlag: false,
          })
        }
        this.props.form.setFieldsValue({
          periodStrategy: periodStrategy,
        });
      }
    });

  };

  //取消
  HandleClear = () => {
    let path = this.state.budgetJournalPage.url;
    this.context.router.push(path);
  };


  //选择预算日记账类型，设置对应的预算表选
  handleJournalType = (value) => {
    console.log(value);
    if (value.length > 0) {
      console.log(value);
     let valueData = value[0];
      this.setState({
        idSelectJournal: true,
        structureFlag: false
      });
      this.props.form.setFieldsValue({
        structureId: ''
      });
      this.props.form.setFieldsValue({
        periodYear: ''
      });
      this.props.form.setFieldsValue({
        periodQuarter: ''
      });
      this.props.form.setFieldsValue({
        periodName: ''
      });
      this.getStructure(valueData.id);
    }

  };


  //上传附件，获取OID
  uploadHandle = (value) => {
    console.log(value);
    this.setState({
      attachmentOID: value
    })
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const organization = this.props.organization;
    const {structureGroup, periodStrategy, periodPeriodQuarter, periodPeriod, structureFlag, periodFlag, periodYearFlag, periodQuarterFlag, periodStrategyFlag, uploading} = this.state;
    const formItemLayout = {};


    const strategyOptions = structureGroup.map((item) => <Option key={item.id}
                                                                 value={item.id}>{item.structureName}</Option>);
    const periodStrategyOptions = periodStrategy.map((item) => <Option key={item.key}
                                                                       value={item.key}>{item.label}</Option>);
    const periodPeriodQuarterOptions = periodPeriodQuarter.map((item) => <Option key={item.key}
                                                                                 value={item.key}>{item.label}</Option>);
    const periodPeriodOptions = periodPeriod.map((item) => <Option key={item.key}
                                                                   value={JSON.stringify(item.value)}>{item.label}</Option>);
    let nowYear = new Date().getFullYear();
    let yearOptions = [];
    for (let i = nowYear - 20; i <= nowYear + 20; i++)
      yearOptions.push({label: i, key: i})
    const yearOptionsData = yearOptions.map((item) => <Option key={item.key} value={item.key}>{item.label}</Option>);


    return (
      <div className="new-budget-journal">
        <div className="budget-journal-title">
          <div><h1>预算日记账</h1></div>
          <div className="budget-journal-title-detail">用于预算录入，提交审批</div>
        </div>
        <div className="divider"> </div>
        <Form onSubmit={this.handleFrom} style={{}}>
          <Card title="基本信息"  style={{with: "100%"}}>
            <Row gutter={40} type="flex" align="top">
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.journalCode"})}>
                  {getFieldDecorator('journalCode', {
                    rules: [{}],
                    initialValue: '-'
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.employeeId"})}>
                  {getFieldDecorator('employeeId', {
                    rules: [{
                      required: true,
                      message: '',
                    }],
                    initialValue: this.props.user.fullName
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.organization"})}>
                  {getFieldDecorator('organizationName', {
                    rules: [{
                      required: true,
                      message: '',
                    }],
                    initialValue: organization.organizationName
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.companyId"})}>
                  {getFieldDecorator('companyId',{
                    rules: [{
                      required: true,
                      message: 'this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name:"journalTypeName"}',
                    }],
                    initialValue: this.props.company.name
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.unitId"})}>
                  {getFieldDecorator('departmentName',{
                    rules: [{
                      required: true,
                      message: '',
                    }],
                    initialValue: this.props.user.departmentName
                  })(
                    <Input disabled={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="divider"> </div>
          <Card title="预算信息"  style={{with: "100%"}}>
            <Row gutter={40} type="flex" align="top">
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.journalTypeId"})}>
                  {getFieldDecorator('journalTypeName', {
                    rules: [{
                      required: true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "journalTypeName"})
                    }]
                  })(
                    <Chooser
                      type='budget_journal_type'
                      labelKey='journalTypeName'
                      valueKey='id'
                      single={true}
                      listExtraParams={{"organizationId": this.props.organization.id}}
                      onChange={this.handleJournalType}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.structureId"})}
                >
                  {getFieldDecorator('structureId', {
                    rules: [{
                      required: true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "预算表"})
                    }],

                  })(
                    <Select onSelect={this.handleSelectChange} disabled={structureFlag}>
                      {strategyOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.periodStrategy"})}>
                  {getFieldDecorator('periodStrategy', {
                    rules: [{
                      required: true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "编制期段"})
                    }],

                  })(
                    <Select disabled={periodStrategyFlag}>
                      {periodStrategyOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>


              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.version"})}>
                  {getFieldDecorator('versionName', {
                    rules: [{
                      required:true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "预算版本"})
                    }],

                  })(
                   <Chooser
                      type='budget_versions'
                      labelKey='versionName'
                      valueKey='id'
                      single={true}
                      listExtraParams={{"organizationId": this.props.organization.id}}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id: "budget.scenarios"})}>
                  {getFieldDecorator('scenarioName', {
                    rules: [{
                      required:true,
                      message: this.props.intl.formatMessage({id: "common.can.not.be.empty"}, {name: "预算场景"})
                    }],

                  })(
                    <Chooser
                      type='budget_scenarios'
                      labelKey='scenarioName'
                      valueKey='id'
                      single={true}
                      listExtraParams={{"organizationId": this.props.organization.id}
                  }

                    />
                  )}
                </FormItem>
              </Col>

            </Row>
          </Card>
          <div className="divider" style={{height:16}}> </div>
          <Card title="附件信息" style={{with: "100%"}}>
            <Row gutter={40} type="flex" align="top">
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="附件"
                >
                  <div className="dropbox">
                    {getFieldDecorator('file', {})(
                      <UploadFile
                        attachmentType="BUDGET_JOURNAL"
                        fileNum={5}
                        uploadHandle={this.uploadHandle}
                      />
                    )}
                  </div>

                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="divider" style={{height:16}}> </div>

          <div className="footer-operate">
            <Button type="primary" htmlType="submit" loading={this.state.loading}
                    style={{marginRight: '10px'}}>下一步</Button>
            <Button style={{marginRight: '10px'}} onClick={this.HandleClear}>取消</Button>

          </div>
        </Form>
      </div>
    )
  }

}


NewBudgetJournalFrom.contextTypes = {
  router: React.PropTypes.object
};


const NewBudgetJournal = Form.create()(NewBudgetJournalFrom);

function mapStateToProps(state) {
  return {
    user: state.login.user,
    company: state.login.company,
    organization: state.login.organization

  }

}

export default connect(mapStateToProps)(injectIntl(NewBudgetJournal));
