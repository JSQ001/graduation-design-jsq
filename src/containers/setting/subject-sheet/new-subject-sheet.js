/**
 * Created by fudebao on 2017/12/05.
 */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Switch, Input, message, Icon, Select, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import config from 'config';
import httpFetch from 'share/httpFetch';
import 'styles/pay/payment-method/new-payment-method.scss'

class NewSubjectSheet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            loading: false,
            // isDisabled: false
        };
    }

    componentWillMount() {
        let params = this.props.params;
        console.log(params);
        // if (params && JSON.stringify(params) != "{}") {
        //     this.setState({
        //         isDisabled: true,
        //     })
        // } else {
        //     this.setState({
        //         isDisabled: false,
        //     })
        // }
    }

    //新建或编辑
    handleSave = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                if (JSON.stringify(this.props.params) === "{}") {
                    let toValue = {
                        ...this.props.params,
                        ...values,
                    }
                    httpFetch.post(`${config.baseUrl}/api/account/set`, toValue).then((res) => {
                        this.setState({ loading: false });
                        this.props.form.resetFields();
                        this.props.close(true);
                        message.success(this.props.intl.formatMessage({ id: "common.create.success" }, { name: `科目表` }));
                    }).catch((e) => {
                        this.setState({ loading: false });

                        message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
                    })
                } else {
                    let toValue = {
                        ...this.props.params,
                        ...values,
                    }
                    httpFetch.put(`${config.baseUrl}/api/account/set`, toValue).then((res) => {
                        this.setState({ loading: false });
                        this.props.form.resetFields();
                        this.props.close(true);
                        message.success("编辑成功");
                    }).catch((e) => {
                        this.setState({ loading: false });
                        message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
                    })

                }
            }
        });
    }

    onCancel = () => {
        this.props.close();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { params} = this.state;
        const formItemLayout = {
            labelCol: { span: 6, offset: 1 },
            wrapperCol: { span: 14, offset: 1 },
        };
        return (
            <div className="new-payment-method">
                <Form onSubmit={this.handleSave}>
                    <FormItem {...formItemLayout} label="科目表代码">
                        {getFieldDecorator('accountSetCode', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.accountSetCode || ''
                        })(
                            <Input disabled = { this.props.params.id ? true : false } />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="科目表名称">
                        {getFieldDecorator('accountSetDesc', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.accountSetDesc || ''
                        })(
                            <Input disabled={this.props.params.id ? true : false} />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'common.column.status' })}>
                        {getFieldDecorator('enabled', {
                            initialValue: this.props.params.id ? this.props.params.enabled : true
                        })(
                            <Switch defaultChecked={this.props.params.id ? this.props.params.enabled : true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
                        )}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.form.getFieldValue('enabled') ? this.props.intl.formatMessage({ id: "common.status.enable" }) : this.props.intl.formatMessage({ id: "common.status.disable" })}
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
