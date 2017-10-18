/**
 * Created by 13576 on 2017/10/18.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Switch, Button, Icon ,Tabs,Row,Col} from 'antd'
import Row from "antd/lib/grid/row.d";
const FormItem = Form.Item;
const TabPane =Tabs.TabPane;

class BeepFrom extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount(){

  }

  handleSave = (e) =>{
    e.preventDefault();
    let value = this.props.form.getFieldsValue();
    this.props.close(value);
  };

  onCancel = () =>{
    this.props.close();
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    const {} = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14, offset: 1 },
    };
    return (
      <div className="beep-timer">
        <Form >
          <Row>
            <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalCode"})} >
              {getFieldDecorator('journalCode', {
                rules: [{
                }],
                initialValue: '-'
              })(
                <Input  disabled={true} />
              )}
            </FormItem>
          </Row>
          <Row>
              <FormItem {...formItemLayout} label={this.props.intl.formatMessage({id:"budget.journalCode"})} >
                {getFieldDecorator('journalCode', {
                  rules: [{
                  }],
                  initialValue: '-'
                })(
                  <Input  disabled={true} />
                )}
              </FormItem>
          </Row>
          <Row>
            <Col></Col>

            <Col></Col>

          </Row>
          <Row>

          </Row>
          <Row>
            <FormItem wrapperCol={{ offset: 7 }}>
              <Button type="primary" htmlType="submit" loading={this.state.loading} style={{marginRight:'10px'}}>保存</Button>
              <Button>取消</Button>
            </FormItem>
          </Row>

        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const WrappedBeepFrom= Form.create()(BeepFrom);

export default connect(mapStateToProps)(WrappedBeepFrom);
