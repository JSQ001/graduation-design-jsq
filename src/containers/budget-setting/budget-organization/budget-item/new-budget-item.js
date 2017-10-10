/**
 *  created by jsq on 2017/9/21
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Form, Select,Input, Col, Row, Switch, message, Icon } from 'antd';

import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import ListSelector from 'components/list-selector.js'

import "styles/budget-setting/budget-organization/budget-item/new-budget-item.scss"

const FormItem = Form.Item;
const Option = Select.Option;

class NewBudgetItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      organization: {},
      showItemType: false ,
      listSelectedData:[],
      statusCode: this.props.intl.formatMessage({id:"common.status.enable"}),  /*启用*/
    };
  }
  componentWillMount(){
    typeof this.props.organization.organizationName === "undefined" ?
      httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${this.props.params.id}`).then((response) =>{
        this.setState({
          organization: response.data,
        })
      })
      :
      this.setState({
        organization: this.props.organization,
      })
  }

  //新建预算项目
  handleSave = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.organizationId = this.state.organization.id;
        values.itemTypeId = values.itemTypeName[0].key;
        httpFetch.post(`${config.budgetUrl}/api/budget/items`,values).then((response)=>{
          if(response) {
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            response.data.organizationName = values.organizationName;
            this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetItemDetail.url.replace(':id', this.props.params.id).replace(':itemId',response.data.id));
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`修改失败, ${e.response.data.validationErrors[0].message}`);
            this.setState({loading: false});
          }
          else {
            console.log(e)
          }
        })
      }
    });
  };

  handleFocus = () => {
    this.refs.blur.focus();
    this.showList(true)
  };

  showList = (flag) => {
    let listSelectedData = [];
    let values = this.props.form.getFieldValue("itemTypeName");
    if (values && values.length > 0) {
      values.map(value => {
        listSelectedData.push(value.value)
      });
    }
    this.setState({
      showItemType: flag,
      listSelectedData
    })
  };

  handleListOk = (result) => {
    console.log(result)
    let values = [];
    result.result.map(item => {
      values.push({
        key: item.id,
        label: item.itemTypeName,
        value: item,
      })
    });
    let value = {};
    value["itemTypeName"] = values;
    this.props.form.setFieldsValue(value);
    this.showList(false)
  };

  handleCancel = (e) =>{
    e.preventDefault();
    this.context.router.push(menuRoute.getMenuItemByAttr('budget-organization', 'key').children.budgetOrganizationDetail.url.replace(':id', this.props.params.id));
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { organization, statusCode, showItemType , listSelectedData} = this.state;
    const { formatMessage } = this.props.intl;
    const attribute = [
      {id:"immobilization",value: formatMessage({id:"variationAttribute.immobilization"})},  /*固定*/
      {id:"mix",value: formatMessage({id:"variationAttribute.mix"})}, /*混合*/
      {id:"alteration",value: formatMessage({id:"variationAttribute.alteration"})} /*变动*/
    ];
    const variationAttribute = attribute.map((item)=><Option key={item.id}>{item.value}</Option>)
    return (
      <div className="new-budget-item">
        <div className="budget-item-form">
          <Form onSubmit={this.handleSave} className="budget-structure-form">
            <Row gutter={60}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.organization"})}  /*{/!*预算组织*!/}*/
                  colon={true}>
                  {getFieldDecorator('organizationName', {
                    initialValue: organization.organizationName,
                  })(
                    <Input disabled/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.itemCode"})} /* {/!*预算项目代码*!/}*/
                  colon={true}>
                  {getFieldDecorator('itemCode', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                      {
                        validator:(item,value,callback)=>{
                          if(value === "undefined" || value === ""){
                            callback();
                            return
                          }
                          httpFetch.get(`${config.budgetUrl}/api/budget/items/query?organizationId=${this.props.params.id}&itemCode=${value}`).then((response)=>{
                            console.log(response)
                            response.data.length>0 ? callback(formatMessage({id:"budget.itemCodeExist"})) : callback()
                          })
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.itemName"})} /* {/!*预算项目名称*!/}*/
                  colon={true}>
                  {getFieldDecorator('itemName', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={60}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.itemType"}) /*预算项目类型*/}
                  colon={true}>
                  {getFieldDecorator('itemTypeName', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},/* {/!*请输入*!/}*/
                    ],
                  })(
                    <Select
                        labelInValue
                        onFocus={this.handleFocus}
                        placeholder={formatMessage({id:"common.please.select"})} />) /*请输入*/
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.item.variationAttribute"}) /*变动属性*/}
                  colon={true}>
                  {getFieldDecorator('variationAttribute', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Select placeholder={formatMessage({id:"common.please.select"})}  /* {/!*请选择*!/}*/>
                      {variationAttribute}
                    </Select>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"budget.itemDescription"}) /*预算项目描述*/}
                  colon={true}>
                  {getFieldDecorator('description', {
                    rules:[
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}
                    />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"common.status"},{status:statusCode})} /* {/!*状态*!/}*/
                  colon={false}>
                  {getFieldDecorator("isEnabled", {
                    initialValue: true,
                    valuePropName: 'checked',
                    rules:[
                      {
                        validator: (item,value,callback)=>{
                          this.setState({
                            statusCode: value ? formatMessage({id:"common.status.enable"}) /*启用*/
                              : formatMessage({id:"status.disabled"}) /*禁用*/
                          })
                          callback();
                        }
                      }
                    ],
                  })
                  (<Switch  checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross"/>}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit">{formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button  onClick={this.handleCancel} style={{ marginLeft: 8 }}> {formatMessage({id:"common.cancel"}) /*取消*/}</Button>
            <input ref="blur" style={{ position: 'absolute', top: '-100vh' }}/> {/* 隐藏的input标签，用来取消list控件的focus事件  */}
          </Form>
        </div>
        <ListSelector
          visible={showItemType}
          type="item_type"
          onCancel={()=>this.showList(false)}
          onOk={this.handleListOk}
          selectedData={listSelectedData}
          extraParams={{organizationId: this.props.params.id}}/>
      </div>
    )
  }
}

NewBudgetItem.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedNewBudgetItem = Form.create()(NewBudgetItem);
export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetItem));
