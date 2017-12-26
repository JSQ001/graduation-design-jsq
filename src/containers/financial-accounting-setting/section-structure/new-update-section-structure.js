/**
 * created by jsq on 2017/12/22
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Input, Switch, Select, Form, Icon, notification } from 'antd'
import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/financial-accounting-setting/section-structure/new-update-section-structure.scss'

const FormItem = Form.Item;
const Option = Select.Option;

class NewUpdateSectionStructure extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isEnabled: false,
      setOfBook: [],
      section: {}
    }
  }

  componentWillMount(){
    //获取账套
    httpFetch.get(`${config.baseUrl}/api/setOfBooks/by/tenant?roleType=TENANT`).then((response)=>{
      let setOfBook = [];
      response.data.map((item)=>{
        setOfBook.push({label: item.setOfBooksName, value: item.id})
      });
      this.setState({
        setOfBook
      })
    })
  }

  handleNotification = ()=>{
    notification.close('section')
  };

  handleSubmit = (e)=> {
    e.preventDefault();
    /*this.setState({
      loading: true,
    });*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { formatMessage } = this.props.intl;
      if (!err){
        console.log(values)
        notification.open({
          message: `${formatMessage({id:"section.notification.left"},{setOfBook: 1})}`+1,
          description: `${formatMessage({id:"section.notification.right"},{section: 1})}`,
          icon: <Icon type="exclamation-circle" style={{ color: '#faad14' }} />,
          duration: 0,
          key: 'section',
          btn:
            <div>
              <Button size="small" onClick={() => notification.close('section')}>
                {formatMessage({id:"common.cancel"})}
              </Button>
              <Button type="primary" style={{marginLeft:10}} size="small" onClick={this.handleNotification}>
                {formatMessage({id:"section.continue"})}
              </Button>
            </div>
        });
      }
    })
  };

  onCancel = ()=>{
    this.props.close(false)
  };

  switchChange = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled
    }))
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;
    const { loading, section, setOfBook, isEnabled } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };

    return(
      <div className="new-update-section-structure">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={formatMessage({id:'section.setOfBook'})  /*账套*/}>
            {getFieldDecorator('setOfBook', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.select"})
              }]
            })(
              <Select className="input-disabled-color" placeholder={ formatMessage({id:"common.please.select"})}>
                {
                  setOfBook.map((item)=><Option key={item.value}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'section.structure.code'})  /*科目段结构代码*/}>
            {getFieldDecorator('sectionCode', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"})
              }]
            })(
              <Input className="input-disabled-color" placeholder={ formatMessage({id:"common.please.enter"})}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id:'section.structure.name'})  /*科目段结构名称*/}>
            {getFieldDecorator('sectionName', {
              rules: [{
                required: true,
                message: formatMessage({id: "common.please.enter"})
              }]
            })(
              <Input className="input-disabled-color" placeholder={ formatMessage({id:"common.please.enter"})}/>
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
          <div className="slide-footer">
            <Button type="primary" htmlType="submit"  loading={this.state.loading}>{formatMessage({id:"common.save"})}</Button>
            <Button onClick={this.onCancel}>{formatMessage({id:"common.cancel"})}</Button>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    company: state.login.company,
  }
}

const WrappedNewUpdateSectionStructure = Form.create()(NewUpdateSectionStructure);
export default connect(mapStateToProps)(injectIntl(WrappedNewUpdateSectionStructure));
