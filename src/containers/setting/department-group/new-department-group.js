/**
 *  createc by jsq on 2017/11/10
 */
import React from 'react';
import { Button, Form, Select,Input, Col, Row, Switch, message, Icon} from 'antd';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'routes/menuRoute'
import debounce from 'lodash.debounce';
import 'styles/setting/department-group/new-department-group.scss';


const FormItem = Form.Item;
const Option = Select.Option;

class NewDepartmentGroup extends React.Component{
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
        console.log(values);
        httpFetch.post(`${config.baseUrl}/api/DepartmentGroup/insertOrUpdate`,values).then((response)=>{
          if(response) {
            console.log(response)
            message.success(this.props.intl.formatMessage({id:"structure.saveSuccess"})); /*保存成功！*/
            this.context.router.push(menuRoute.getMenuItemByAttr('department-group', 'key').children.departmentGroupDetail.url.replace(':id',response.data.id))
          }
        }).catch((e)=>{
          if(e.response){
            message.error(`保存失败, ${e.response.data.message}`);
          }
          this.setState({loading: false});
        })
      }
    });
  };

  //点击取消，返回部门组
  handleCancel = (e) =>{
    e.preventDefault();
    this.context.router.push(menuRoute.getMenuItemByAttr('department-group', 'key').url);
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
      <div className="new-department-group">
        <Form onSubmit={this.handleSave} onChange={this.handleChange}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                label="部门组代码"  /*部门组代码*/
                colon={true}>
                {getFieldDecorator('deptGroupCode', {
                  initialValue: organization.organizationName,
                  rules:[
                    { required:true,message: formatMessage({id:"common.please.enter"}) }
                  ]
                })(
                  <Input placeholder={formatMessage({id:"common.please.enter"})} />)
                }
              </FormItem>
              <div className="department-group-tips">
                注：部门组代码保存后将不可修改
              </div>
            </Col>
            <Col span={8} offset={1}>
              <FormItem
                label="部门组名称" /* 部门组名称*/
                colon={true}>
                {getFieldDecorator('description', {
                  rules:[
                    {required:true,message:formatMessage({id:"common.please.enter"})},
                  ]
                })(
                  <Input placeholder={formatMessage({id:"common.please.enter"})}/>)
                }
              </FormItem>
              <div className="department-group-tips">
                注：部门组名称保存后将不可修改
              </div>
            </Col>
            <Col span={6} offset={1}>
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
    )
  }
}

NewDepartmentGroup.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}



const WrappedNewDepartmentGroup = Form.create()(NewDepartmentGroup);

export default connect(mapStateToProps)(injectIntl(WrappedNewDepartmentGroup));
