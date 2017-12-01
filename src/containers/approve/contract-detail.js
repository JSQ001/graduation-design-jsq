import React from 'react'
import { injectIntl } from 'react-intl'
import menuRoute from 'share/menuRoute'
import { Form, Affix, Button, Row, Col, Input, Popover, Tag } from 'antd'
const FormItem = Form.Item;
const { CheckableTag } = Tag;

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
      tags: [],
      fastReplyEdit: false,
      fastReplyChosen: [],
      inputVisible: false,
      inputValue: '',
      contract:  menuRoute.getRouteItem('approve-contract','key'),    //合同
    }
  }

  componentWillMount() {
    const tags = [
      {id: '1', label: '发票抬头错误'},
      {id: '2', label: '费用类型错误'},
      {id: '3', label: '发票金额不符'},
      {id: '4', label: '发票抬头错误哈哈哈哈哈哈'},
      {id: '5', label: '费用类型错误哈哈哈哈哈哈'},
      {id: '6', label: '发票金额不符哈哈哈哈哈哈'},
    ];
    this.setState({ tags })
  }

  //审批处理
  handleApprove = (e) => {
    e.preventDefault();
    if (this.state.inputError) return;
    let params = this.props.form.getFieldsValue();
    if (this.state.approveType === 'pass') {  //通过

    } else {  //驳回
      if (params.approvalOpinion) {
        this.setState({ inputError: false })
      } else {
        this.setState({
          inputError: true,
          errorMessage : '请输入驳回审批意见'
        })
      }
    }
  };

  //通过 ／ 驳回 按钮
  handleBtnClick = (type) => {
    this.setState({ approveType: type })
  };

  //审批意见输入
  onChange = (e) => {
    this.setState({
      inputError: e.target.value.length > 200,
      errorMessage : '最多输入200个字符'
    })
  };

  //编辑快捷回复
  onFastReplyEdit = () => {
    const { fastReplyEdit } = this.state;
    this.setState({ fastReplyEdit: !fastReplyEdit })
  };

  //选择快捷回复
  onFastReplyChange = (checked, id) => {
    const { getFieldsValue, setFieldsValue } = this.props.form;
    let tags = this.state.tags;
    let fastReplyChosen = this.state.fastReplyChosen;
    let fastReplyChosenValue = [];
    if (getFieldsValue().approvalOpinion) {
      fastReplyChosenValue.push(getFieldsValue().approvalOpinion);
      fastReplyChosenValue = fastReplyChosenValue[0].split('，')
    }
    tags.map(item => {
      if (item.id === id) {
        item.checked = checked;
        checked ? fastReplyChosen.push(item) : fastReplyChosen.delete(item);
        checked ? fastReplyChosenValue.push(item.label) : fastReplyChosenValue.delete(item.label)
      }
    });
    setFieldsValue({ approvalOpinion: fastReplyChosenValue.join('，') });
    this.setState({
      tags,
      fastReplyChosen,
      inputError: fastReplyChosenValue.join('，').length > 200,
      errorMessage: '最多输入200个字符'
    })
  };

  //删除快捷回复标签
  onDeleteTag = (e) => {
    e.stopPropagation();
  };

  //显示新增快捷回复输入框
  showTagInput = () => {
    this.setState({ inputVisible: true },() =>  this.input.focus())
  };

  //确认新增的快捷回复
  handleInputConfirm = () => {
    this.setState({ inputVisible: false })
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  saveInputRef = input => this.input = input;

  goBack = () => {
    this.context.router.push(this.state.contract.url);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, inputError, errorMessage, tags, fastReplyEdit, inputVisible, inputValue } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    };
    let fastReplyContent = (
      <div className="fast-reply">
        {tags.map(item => {
          return (
            <CheckableTag key={item.id}
                          className="fast-reply-tag"
                          checked={item.checked}
                          onChange={(checked) => this.onFastReplyChange(checked, item.id)}>{item.label}
              {fastReplyEdit && <a className="delete-tag" onClick={this.onDeleteTag}>&times;</a>}
            </CheckableTag>
          )
        })}
        {!inputVisible && <Button size="small" type="dashed" className="add-new-btn" onClick={this.showTagInput}>+ 新增快捷回复</Button>}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width:106, height:28, marginBottom:8 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
      </div>
    );
    let fastReplyTitle = (
      <div className="fast-reply-title">
        快捷回复
        {!fastReplyEdit && <a className="edit" onClick={this.onFastReplyEdit}>编辑</a>}
        {fastReplyEdit && <a className="edit" onClick={this.onFastReplyEdit}>取消</a>}
      </div>
    );
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
                        <Popover trigger="click"
                                 title={fastReplyTitle}
                                 content={fastReplyContent}
                                 getPopupContainer={() => document.getElementsByClassName('contract-detail')[0]}
                                 overlayStyle={{width:'49%', maxHeight:'140px'}}>
                          {getFieldDecorator('approvalOpinion')(
                            <Input placeholder="请输入，最多200个字符" onChange={this.onChange}/>
                          )}
                        </Popover>
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
              <Button onClick={this.goBack}>返 回</Button>
            </Col>
          </Row>
        </Affix>
      </div>
    )
  }
}

ContractDetail.contextTypes = {
  router: React.PropTypes.object
};

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail


