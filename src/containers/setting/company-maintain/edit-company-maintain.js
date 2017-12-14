/**
 * Created by fudebao on 2017/12/05.
 */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Switch, Input, message, Icon, Select, Radio, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import config from 'config';
import httpFetch from 'share/httpFetch';
import moment from 'moment';
import 'styles/pay/payment-method/new-payment-method.scss'

class NewSubjectSheet extends React.Component {
    constructor(props) {
        super(props);
        const { formatMessage } = this.props.intl;
        this.state = {
            params: {},
            loading: false,
            companyTypeList: [],
            setOfBooksNameList: [],
            legalEntityList: [],
            companyLevelList: [],
            parentCompanyList: [],
            dateFormat: 'YYYY/MM/DD'
            // isDisabled: false
        };
    }


    componentDidMount() {
        this.getSetOfBooksNameList();
        this.getLegalEntityList();
        this.getCompanyLevelList();
        this.getParentCompanyList();
        this.getCompanyTypeList();
    }

    // componentWillReceiveProps() {
        
    // }

    //获取账套列表
    getSetOfBooksNameList = () => {
        httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then(res => {
            this.setState({ setOfBooksNameList: res.data });
        })
    }

    //获取公司类型列表
    getCompanyTypeList = () => {
        this.getSystemValueList(1011).then(res => {
            this.setState({ companyTypeList: res.data.values });
        })
    }

    //获取法人列表
    getLegalEntityList = () => {
        httpFetch.get(`${config.baseUrl}/api/all/legalentitys`).then(res => {
            this.setState({ legalEntityList: res.data });
        })
    }

    //获取公司级别列表
    getCompanyLevelList = () => {
        httpFetch.get(`${config.baseUrl}/api/companyLevel/selectByTenantId`).then(res => {
            this.setState({ companyLevelList: res.data });
        })
    }

    //获取上级机构列表
    getParentCompanyList = () => {
        httpFetch.get(`${config.baseUrl}/api/company/by/tenant`).then(res => {
            let temp = [];
            res.data.map(item => {
                if (item.id != this.props.params.id) {
                    temp.push(item);
                }
            })
            this.setState({ parentCompanyList: temp });
        })
    }


    //编辑保存
    handleSave = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                let toValue = {
                    ...this.props.params,
                    ...values,
                }
                httpFetch.put(`${config.baseUrl}/api/refactor/companies`, toValue).then((res) => {
                    this.setState({ loading: false });
                    this.props.form.resetFields();
                    this.props.close(true);
                    message.success(this.props.intl.formatMessage({ id: 'common.operate.success' }));
                }).catch((e) => {
                    this.setState({ loading: false });

                    message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
                })
            }
        });
    }

    onCancel = () => {
        this.props.close();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { params, companyTypeList, setOfBooksNameList, legalEntityList, companyLevelList, parentCompanyList, dateFormat } = this.state;
        const formItemLayout = {
            labelCol: { span: 6, offset: 1 },
            wrapperCol: { span: 14, offset: 1 },
        };
        const { formatMessage } = this.props.intl;
        return (
            <div className="new-payment-method">
                <Form onSubmit={this.handleSave}>
                    <FormItem {...formItemLayout} label={formatMessage({ id:"company.companyCode"})}>
                        {getFieldDecorator('companyCode', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.companyCode || ''
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.name" })}>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.name || ''
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.companyType" })}>
                        {getFieldDecorator('companyTypeId', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.companyTypeId || ''
                        })(
                            <Select>
                                {companyTypeList.map(option => {
                                    return <Option key={option.id}>{option.messageKey}</Option>
                                })}
                            </Select>
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.setOfBooksName" })}>
                        {getFieldDecorator('setOfBooksId', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.setOfBooksId || ''
                        })(
                            <Select>
                                {setOfBooksNameList.map(option => {
                                    return <Option key={option.id}>{option.setOfBooksCode}</Option>
                                })}
                            </Select>
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.legalEntityName" })}>
                        {getFieldDecorator('legalEntityId', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.legalEntityId || ''
                        })(
                            <Select>
                                {legalEntityList.map(option => {
                                    return <Option key={option.id}>{option.entityName}</Option>
                                })}
                            </Select>
                            )}
                    </FormItem>

                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.companyLevelName" })}>
                        {getFieldDecorator('companyLevelId', {
                            initialValue: this.props.params.companyLevelId || ''
                        })(
                            <Select>
                                {companyLevelList.map(option => {
                                    return <Option key={option.id}>{option.description}</Option>
                                })}
                            </Select>
                            )}
                    </FormItem>

                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.parentCompanyName" })}>
                        {getFieldDecorator('parentCompanyId', {
                            initialValue: this.props.params.parentCompanyId || ''
                        })(
                            <Select>
                                {parentCompanyList.map(option => {
                                    return <Option key={option.id}>{option.name}</Option>
                                })
                                }
                            </Select>
                            )}
                    </FormItem>

                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.startDateActive" })}>
                        {getFieldDecorator('startDateActive', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: moment(this.props.params.startDateActive ? this.props.params.startDateActive : new Date(), dateFormat)
                        })(
                            <DatePicker />
                            )}
                    </FormItem>

                    <FormItem {...formItemLayout} label={formatMessage({ id: "company.endDateActive" })}>
                        {getFieldDecorator('endDateActive', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: moment(this.props.params.endDateActive ? this.props.params.startDateActive : new Date(), dateFormat)
                        })(
                            <DatePicker />
                            )}
                    </FormItem>

                    <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'common.column.status' })}>
                        {getFieldDecorator('enabled', {
                            initialValue: this.props.params.id ? this.props.params.enabled : true
                        })(
                            <Switch defaultChecked={this.props.params.id ? this.props.params.enabled : true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
                            )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('enabled') ? this.props.intl.formatMessage({ id: "common.status.enable" }) : this.props.intl.formatMessage({ id: "common.status.disable" })}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'company.address' })}>
                        {getFieldDecorator('address', {
                            initialValue: this.props.params.address || ''
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <div className="slide-footer">
                        <Button type="primary" htmlType="submit"
                            loading={this.state.loading}>{this.props.intl.formatMessage({ id: "common.save" })}</Button>
                        <Button onClick={this.onCancel}>{this.props.intl.formatMessage({ id: "common.cancel" })}</Button>
                    </div>
                </Form>
            </div>
        )
    }
}



const WrappedNewSubjectSheet = Form.create()(NewSubjectSheet);
function mapStateToProps(state) {
    return {
        company: state.login.company,
    }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewSubjectSheet));
