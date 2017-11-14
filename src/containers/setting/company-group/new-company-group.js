/**
 *  createc by jsq on 2017/11/10
 */
import React from 'react';
import { Button, Form, Select,Input, Col, Row, Switch, message, Icon} from 'antd';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'
import debounce from 'lodash.debounce';
import 'styles/setting/company-group/new-company-group.scss';


const FormItem = Form.Item;
const Option = Select.Option;

class NewCompanyGroup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      statusCode: this.props.intl.formatMessage({id:"common.enabled"}),  /*启用*/
      organization:{},
      setOfBooks: []
    };
  }

  componentWillMount(){
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then((response)=>{
      console.log(response)
      let setOfBooks = [];
      response.data.map((item)=>{
        let option = {
          value: item.setOfBooksCode +" - "+item.setOfBooksName,
          id: item.id
        };
        setOfBooks.addIfNotExist(option)
      });
      this.setState({
        setOfBooks:setOfBooks
      });
    });
  }


  //新建预算表
  handleSave = (e) =>{
    e.preventDefault();
    this.setState({
      loading: true,
    });

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        httpFetch.post(`${config.baseUrl}/api/company/group`,values).then((response)=>{
          if(response) {
            console.log(response)
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            this.context.router.push(menuRoute.getMenuItemByAttr('company-group', 'key').children.companyGroupDetail.url.replace(':id',response.data.id));
            this.setState({loading:false})
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`${this.props.intl.formatMessage({id:"common.save.filed"})}, ${e.response.data.errorCode}`);
            this.setState({loading: false});
          }
          else {
            console.log(e)
          }
        })
      }
    });
  };

  //点击取消，返回预算组织详情
  handleCancel = (e) =>{
    e.preventDefault();
    this.context.router.push(menuRoute.getMenuItemByAttr('company-group', 'key').url);
  };

  handleChange = ()=>{
    if(this.state.loading){
      this.setState({
        loading: false
      })
    }
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { statusCode, organization, loading, setOfBooks  } = this.state;
    const { formatMessage } = this.props.intl;
    return(
      <div className="new-budget-structure">
        <div className="budget-structure-header">
          <Form onSubmit={this.handleSave} onChange={this.handleChange}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label="公司组代码"  /*公司组代码*/
                  colon={true}
                  help="注：部门组代码保存后将不可修改">
                  {getFieldDecorator('companyGroupCode', {
                    rules:[
                      { required:true, message: formatMessage({id:"common.please.enter"}) }
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})} />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="公司组名称" /* 公司组名称*/
                  colon={true}
                  help="注：部门组描述保存后将不可修改">
                  {getFieldDecorator('companyGroupName', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Input placeholder={formatMessage({id:"common.please.enter"})}/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="账套" /* 账套*/
                  colon={true}>
                  {getFieldDecorator('setOfBooksId', {
                    rules:[
                      {required:true,message:formatMessage({id:"common.please.enter"})},
                    ]
                  })(
                    <Select placeholder={formatMessage({id:"common.please.select"})}>
                      {
                        setOfBooks.map((item)=><Option key={item.id}>{item.value}</Option>)
                      }
                    </Select>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({id:"common.status"},{status:statusCode})} /* {/!*状态*!/}*/
                  colon={false}>
                  {getFieldDecorator("enabled", {
                    initialValue: true,
                    valuePropName: 'checked',
                    rules:[
                      {
                        validator: (item,value,callback)=>{
                          this.setState({
                            statusCode: value ? formatMessage({id:"common.enabled"}) /*启用*/
                              : formatMessage({id:"common.disabled"}) /*禁用*/
                          })
                          callback();
                        }
                      }
                    ],
                  })
                  (<Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross"/>}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Button type="primary" loading={loading} htmlType="submit">{formatMessage({id:"common.save"}) /*保存*/}</Button>
            <Button onClick={this.handleCancel} style={{ marginLeft: 8 }}> {formatMessage({id:"common.cancel"}) /*取消*/}</Button>
          </Form>
        </div>
      </div>
    )
  }
}

NewCompanyGroup.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}



const WrappedNewCompanyGroup = Form.create()(NewCompanyGroup);

export default connect(mapStateToProps)(injectIntl(WrappedNewCompanyGroup));
