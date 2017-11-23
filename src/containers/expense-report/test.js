/**
 * Created by pete on 2017/11/4.
 */
import React  from 'react'
import { Form, Icon, Input ,Button} from 'antd';
const FormItem = Form.Item;
class MyAccount1 extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      name:'hailong',
      width:100
    }
  };
  render(){
    return(
/*      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.MyFunction}> 提交 </Button>
        </FormItem>
      </Form>*/
      <div>
        <p>hshdf +{this.name}</p>
      </div>
    )
  }

}

