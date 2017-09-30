/**
 * Created by 13576 on 2017/9/18.
 */
import React from 'React'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch';
import menuRoute from 'share/menuRoute'
import { Form, Input, Switch, Button,Col,Row,Select,DatePicker,Alert,notification,Icon,message} from 'antd'
import 'styles/budget/budget-versions/new-budget-versions.scss'

const FormItem = Form.Item;
const sd = this;


class NewBudgetVersions extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      versionCodeError:false,
      statusError:false,
      newData:[],
      checkoutCodeData:[],
      loading: false,
      budgetVersionsDetailDetailPage: menuRoute.getRouteItem('budget-versions-detail','key'),    //预算版本详情的页面项
    };
  }

  componentWillMount(){

  }


  //检查处理提交数据
  handleSave = (e) =>{
    this.setState({loading: true});
    e.preventDefault();
    let value =this.props.form.getFieldsValue();
    if(!this.state.statusError){
      const dataValue=value['versionDate']
      const toleValues={
        ...value,
        'versionDate': value['versionDate']?value['versionDate'].format('YYYY-MM-DD'):'',
        'organizationId':this.props.organization.id
      }

      this.saveData(toleValues);
    }
  };

  //保存数据
  saveData(value){
    httpFetch.post(`${config.budgetUrl}/api/budget/versions`,value).then((response)=>{
      let path = this.state.budgetVersionsDetailDetailPage.url.replace(":id", this.props.organization.id).replace(":versionId", response.data.id)
      message.success(this.props.intl.formatMessage({id:"common.operate.success"}), 2);
      setTimeout(() => {
        this.setState({loading:false }, () => this.context.router.push(path))
      },200)

    } ).catch(e=>{
      this.setState({loading:false});
      if(e.response){

        message.error(this.props.intl.formatMessage({id:"common.operate.error"}),` ${e.response.data.validationErrors[0].message}`)

      }
    });
  }



  CancelHandle = () =>{

  };





  render(){

    const { getFieldDecorator } = this.props.form;
    const versionCodeError = false
    return (

      <div className="new-budget-versions">

        <div className="new-budget-versions-help">
          <Alert
            message={this.props.intl.formatMessage({id:"common.help"})}
            description={this.props.intl.formatMessage({id:"budget.newVersion.info"})}
            type=""
            showIcon
          />
        </div>

        <div className="new-budget-versions-from">
          <Form onSubmit={this.handleSave}>
            <Row gutter={40}>


              <Col span={8} style={{ display: 'inline-block'}}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.organization"})}
                >
                  {getFieldDecorator('organizationName',
                    {
                      initialValue:this.props.organization.organizationName,
                      rules: [
                        { required: true,}
                      ],
                    })(
                    <Input disabled={true} />
                  )}
                </FormItem>
              </Col>

              <Col span={8} style={{ display: 'inline-block'}}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.versionCode"})}
                >
                  {getFieldDecorator('versionCode', {
                      rules: [{ required: true, message: this.props.intl.formatMessage({id:"common.please.enter"}) },]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>

              <Col span={8}  style={{ display: 'inline-block'}}>
                <FormItem label={this.props.intl.formatMessage({id:"budget.versionName"})}
                >
                  {getFieldDecorator('versionName', {
                    rules: [{ required: true, message: this.props.intl.formatMessage({id:"common.please.enter"}) }],
                  })(<Input />)}

                </FormItem>
              </Col>

              <Col span={8} style={{ display: 'inline-block'}}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.status"})}

                >
                  {getFieldDecorator('status', {
                    initialValue:"NEW",
                    rules: [{ required: true, }],
                  })(
                    <Select
                      placeholder=""

                    >
                      <Select.Option value="NEW">新建</Select.Option>
                      <Select.Option value="CURRENT">当前</Select.Option>
                      <Select.Option value="HISTORY">历史</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>


              <Col span={8}  style={{ display: 'inline-block'}}>
                <FormItem label={this.props.intl.formatMessage({id:"budget.description"})}

                >
                  {getFieldDecorator('description',{

                  })(<Input />)}
                </FormItem>
              </Col>



              <Col span={8} style={{ display: 'inline-block'}}>
                <FormItem

                  label={this.props.intl.formatMessage({id:"budget.versionDate"})}
                >
                  {getFieldDecorator('versionDate',
                    {
                      valuePropName:"defaultValue",
                    }
                  )(
                    <DatePicker  style={{width:315}}/>
                  )}
                </FormItem>
              </Col>


              <Col span={8}  style={{ display: 'inline-block'}}>
                <FormItem
                  label={this.props.intl.formatMessage({id:"budget.isEnabled"})}
                >
                  {getFieldDecorator('isEnabled', {
                      valuePropName:"checked",
                      initialValue:true
                    }
                  )(
                    <Switch  checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="cross" />}/>
                  )}
                </FormItem>
              </Col>


            </Row>
            <Row  gutter={40}>

            </Row>

            <div className="">
              <Button type="primary" htmlType="submit" loading={this.state.loading} >{this.props.intl.formatMessage({id:"common.save"})}</Button>
              <Button onClick={this.CancelHandle}>{this.props.intl.formatMessage({id:"common.cancel"})}</Button>
            </div>


          </Form>
        </div>


      </div>

    )
  }

}


NewBudgetVersions.contextTypes={
  router:React.PropTypes.object
}

const WrappedNewBudgetVersions= Form.create()(NewBudgetVersions);

function mapStateToProps(state) {
  return {
    organization:state.budget.organization
  }
}

export default connect(mapStateToProps)(injectIntl(WrappedNewBudgetVersions));
