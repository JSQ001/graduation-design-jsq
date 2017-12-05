import React  from 'react'
import Importer from 'components/importer'
import { Button } from 'antd'

class MyAccount extends React.Component{
    constructor(props){
      super(props);
      this.state = {};
    }

    handleOk = (result) => {
      console.log(result)
    };

    render(){
      return(
        <div>
          <Importer onOk={this.handleOk} title="导入数据"/>
        </div>
      )
    }
}

export default MyAccount;
