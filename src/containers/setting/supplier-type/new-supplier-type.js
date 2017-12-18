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


class NewSupplierType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params: {},
            loading: false,
        };
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

                    httpFetch.post(`http://139.224.2.45:11012/vendor-info-service/api/supplier/type`, toValue).then((res) => {
                        this.setState({ loading: false });
                        this.props.form.resetFields();
                        this.props.close();
                        message.success(this.props.intl.formatMessage({ id: "common.operate.successs" }));
                    }).catch((e) => {
                        this.setState({ loading: false });

                        message.error(this.props.intl.formatMessage({ id: "common.save.filed" }) + `${e.response.data.message}`);
                    })
                } else {
                    let toValue = {
                        ...this.props.params,
                        ...values,
                    }
                    httpFetch.put(`http://139.224.2.45:11012/vendor-info-service/api/supplier/type`, toValue).then((res) => {
                        this.setState({ loading: false });
                        this.props.form.resetFields();
                        this.props.close();
                        message.success(this.props.intl.formatMessage({ id: "common.operate.success" }));
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
        const { params } = this.state;
        const formItemLayout = {
            labelCol: { span: 6, offset: 1 },
            wrapperCol: { span: 14, offset: 1 },
        };
        const { formatMessage } = this.props.intl;
        return (
            <div className="new-payment-method">
                <Form onSubmit={this.handleSave}>
                    <FormItem {...formItemLayout} label={formatMessage({ id: "supplier.type.code" })}>
                        {getFieldDecorator('supplierTypeCode', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.supplierTypeCode || ''
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={formatMessage({ id: "supplier.type.name" })}>
                        {getFieldDecorator('supplierTypeName', {
                            rules: [{
                                required: true,
                                message: this.props.intl.formatMessage({ id: "common.please.enter" })
                            }],
                            initialValue: this.props.params.supplierTypeName || ''
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.props.intl.formatMessage({ id: 'common.column.status' })}>
                        {getFieldDecorator('isEnabled', {
                            initialValue: this.props.params.id ? this.props.params.isEnabled : true
                        })(
                            <Switch defaultChecked={this.props.params.id ? this.props.params.isEnabled : true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
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

const WrappedNewSupplierType = Form.create()(NewSupplierType);
function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps)(injectIntl(WrappedNewSupplierType));
