/**
 * Created by 13576 on 2017/9/21.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import {Button,Table,Badge,Popconfirm,Form,DatePicker,Col,Row,Switch,notification,Input,message,Icon} from 'antd'
const FormItem = Form.Item;

import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'

import 'styles/budget/buget-item-type/budget-item-type.scss'


class NewBudgetItemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      isEnabled: true,
      isPut:false,
      loading:false,

    };
  }

  componentWillMount(){
    console.log(this.props.organization)
  }


  //新建
  handleSave= (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading:true});
        let toValue={
          'isEnabled':values.isEnabled,
          'itemTypeName':values.itemTypeName,
          'itemTypeCode':values.itemTypeCode,
          'organizationId':this.props.organization.id
        }
        console.log(toValue);
        httpFetch.post(`${config.budgetUrl}/api/budget/itemType`, toValue).then((res)=>{
          this.setState({loading: false});
            this.props.close(true);
            message.success('操作成功');
          console.log( this.props.id);
        }).catch((e)=>{
          this.setState({loading: false});

          message.error(e.response.data.validationErrors[0].message);
        })
      }
    });
  }

  onCancel = () =>{
    this.props.close();
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { params, isEnabled,isPut} = this.state;
    const formItemLayout = {
      labelCol: { span: 24,offset:1 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (


      <div className="new-value">
        <Form onSubmit={this.handleSave}>
          <FormItem {...formItemLayout}
             label="状态:">
            {getFieldDecorator('isEnabled', {
              valuePropName:"defaultChecked",
              initialValue:isEnabled
            })(
              <div>
                <Switch defaultChecked={isEnabled}  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />} onChange={this.switchChange}/>
                <span className="enabled-type" style={{marginLeft:20,width:100}}>{ isEnabled ? '启用' : '禁用' }</span>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算组织:">
            {getFieldDecorator('organizationName', {
              rules: [{

              }],
              initialValue:this.props.organization.organizationName

            })(
              <Input  disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算项目类型代码:" >
            {getFieldDecorator('itemTypeCode', {
              rules: [{
                required: true
              }],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预算项目类型名字:" >
            {getFieldDecorator('itemTypeName', {
              rules: [{
                required: true,
                message: '请输入'
              }],
            })(
              <Input placeholder="请输入"  />
            )}
          </FormItem>

          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={this.state.loading}>保存</Button>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    )
  }
}


/*NewBudgetItemType.propTypes = {
  isPut:React.PropTypes.bool,
  text:React.PropTypes.object
};*/


const WrappedNewBudgetItemType = Form.create()(NewBudgetItemType);
function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetItemType));
