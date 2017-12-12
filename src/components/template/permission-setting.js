import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Radio, Select } from 'antd'
const RadioGroup = Radio.Group;
const Option = Select.Option;

class PermissionSetting extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: 'a'
    }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value })
  };

  render() {
    const { value } = this.state;
    return (
      <div className="permission-setting">
        <RadioGroup onChange={this.onChange} value={this.state.value} style={{marginBottom:10}}>
          <Radio value="a">全部人员</Radio>
          <Radio value="b">按部门添加</Radio>
          <Radio value="c">按人员组添加</Radio>
        </RadioGroup>
        {value === 'a' &&
          <Select value="all">
            <Option key="all">全部人员</Option>
          </Select>}
      </div>
    )
  }
}

const wrappedPermissionSetting = Form.create()(injectIntl(PermissionSetting));

export default wrappedPermissionSetting;
