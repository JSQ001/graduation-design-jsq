/**
 * created by jsq on 2018/01/02
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Badge, Form, Input, Switch, Icon, Select} from 'antd'
import SlideFrame from 'components/slide-frame'
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import 'styles/financial-accounting-setting/accounting-scenarios/new-update-subject-mapping.scss'
const Option = Select.Option;
const FormItem = Form.Item;

class NewUpdateMatchingGroup extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      isEnabled: true,
      data: [{id: 1}],
      pagination: {
        current: 1,
        page: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    };
  }

  handleLinkElement = (e, record,index)=>{
    this.context.router.push(menuRoute.getMenuItemByAttr('accounting-scenarios-system', 'key').children.accountingElements.url.replace(':id', record.id))
  };

  componentWillMount() {
    this.getList();
  }

  getList(){}

  handleSearch = (params)=>{
    console.log(params)
  };

  //分页点击
  onChangePager = (pagination,filters, sorter) =>{
    let temp = this.state.pagination;
    temp.page = pagination.current-1;
    temp.current = pagination.current;
    temp.pageSize = pagination.pageSize;
    this.setState({
      loading: true,
      pagination: temp
    }, ()=>{
      this.getList();
    })
  };

  handleSave = (e)=>{
    e.preventDefault();
    alert(1)
    this.props.close(true)
  };

  handleCancel = ()=>{
    this.props.close(false)
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage} = this.props.intl;
    const { loading, isEnabled } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 0 },
    };

    return(
      <div className="new-update-subject-matching">
        <Form>
          <div className="subject-matching-title">{formatMessage({id:"account.select.subject"})}</div>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.subject'})  /*科目*/}>
            {getFieldDecorator('scenariosName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"})
              }]
            })(
              <Select placeholder={formatMessage({id:"common.please.select"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.subject.name'})  /*科目名称*/}>
            {getFieldDecorator('scenariosName')(
              <label>{'-'}</label>
            )}
          </FormItem>
          <div className="subject-matching-title">{formatMessage({id:"account.select.element"})}</div>
          <div className="subject-matching-tips">
            <Icon type="info-circle" style={{color:'#108ee9',marginRight: 10}}/>
            {formatMessage({id:"account.select.element"})}
          </div>
          <FormItem {...formItemLayout} label={formatMessage({id:'accounting.elements.nature'})  /*优先级*/}>
            {getFieldDecorator('scenariosName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"})
              }]
            })(
              <Input placeholder={formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout}
                    label={formatMessage({id:"common.column.status"})} colon={true}>
            {getFieldDecorator('isEnabled', {
              valuePropName:"checked",
              initialValue: isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? formatMessage({id:"common.status.enable"}) : formatMessage({id:"common.disabled"}) }</span>
              </div>)}
          </FormItem>
        </Form>
        <div className="slide-footer">
          <Button type="primary" onClick={this.handleSave}  loading={this.state.loading}>{formatMessage({id:"common.save"})}</Button>
          <Button onClick={this.handleCancel}>{formatMessage({id:"common.cancel"})}</Button>
        </div>
      </div>
    )
  }
}


NewUpdateMatchingGroup.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {}
}
const WrappedNewUpdateMatchingGroup = Form.create()(NewUpdateMatchingGroup);
export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateMatchingGroup));
