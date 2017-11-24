import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Affix, Button, Row, Col, Input } from 'antd'
const FormItem = Form.Item;

import ContractDetailCommon from 'containers/contract/contract-detail-common'
import 'styles/contract/contract-detail.scss'

class ContractDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      approveType: '',  //审批类型：通过 or 驳回
      inputError: false,
      errorMessage: '请输入驳回审批意见',
    }
  }

  handleApprove = (e) => {
    e.preventDefault();
    if (this.state.inputError) return;
    let params = this.props.form.getFieldsValue();
    if (this.state.approveType === 'pass') {  //通过

    } else {  //驳回
      if (params.contract) {
        this.setState({ inputError: false })
      } else {
        this.setState({ inputError: true })
      }
    }
  };

  handleBtnClick = (type) => {
    this.setState({ approveType: type })
  };

  onChange = (e) => {
    const { inputError } = this.state;
    this.setState({
      inputError: e.target.value.length > 200 ? true : (e.target.value ? false : inputError),
      errorMessage : e.target.value.length > 200 ? '最多输入200个字符' : '请输入驳回审批意见'
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, inputError, errorMessage } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    return (
      <div className="contract-detail background-transparent">
        <ContractDetailCommon />
        <Affix offsetBottom={0} className="bottom-bar" style={{height:'80px',lineHeight:'80px'}}>
          <Row>
            <Col span={18}>
              <Form onSubmit={this.handleApprove}>
                <Row>
                  <Col span={18}>
                    <FormItem {...formItemLayout}
                              label="审批意见"
                              validateStatus={inputError ? "error" : ""}
                              help={inputError ? errorMessage : ""}
                              style={{position:'relative', top:'24px'}}>
                      {getFieldDecorator('contract')(
                        <Input placeholder="请输入，最多200个字符" onChange={this.onChange}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <Button type="primary"
                            loading={loading}
                            htmlType="submit"
                            onClick={() => this.handleBtnClick('pass')}
                            style={{margin:'0 10px'}}>通 过</Button>
                    <Button htmlType="submit"
                            onClick={() => this.handleBtnClick('reject')}
                            style={{color:'#fff', backgroundColor:'#f04134', borderColor:'#f04134'}}>驳 回</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={4}>
              <Button>返 回</Button>
            </Col>
          </Row>
        </Affix>
      </div>
    )
  }
}

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail


