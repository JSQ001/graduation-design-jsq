/**
 * Created by lwj on 2017/9/6.
 */

import React from 'react'
import { Button, Icon ,Steps, TreeSelect } from 'antd';
import 'styles/expense-report/edit-report.scss'


const Step = Steps.Step;
const steps = [{
  title: '单据信息',
  content: 'First-content',
}, {
  title: '添加费用',
  content: 'Second-content',
}, {
  title: '提交审批',
  content: 'Last-content',
}];

const TreeNode = TreeSelect.TreeNode;

class EditReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      value: undefined,
    };
  }

  onChange = (value) =>{
    console.log(value);
    this.setState({ value });
  }

  // const treenodes = ()=>{}

  renderSingleTree(){
    return(
      <TreeSelect
        showSearch
        style={{ width: 300 }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
      >
        <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
            <TreeNode value="leaf2" title="your leaf" key="random1" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
          </TreeNode>
        </TreeNode>
      </TreeSelect>
    )
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current} className="steps-header">
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">

          {this.renderSingleTree()}


        </div>
        <div className="steps-action">
          {
            this.state.current < steps.length - 1
            &&
            <Button  size="large" type="primary" onClick={() => this.next()}>下一步</Button>
          }
          {
            this.state.current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
          }
          {
            this.state.current > 0
            &&
            <Button  style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {}
  }

  export default EditReport;
