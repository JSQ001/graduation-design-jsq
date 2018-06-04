import React from 'react'
import { Tag } from 'antd';
const { CheckableTag } = Tag;

class MyTag extends React.Component {
  render() {
    return <CheckableTag {...this.props} checked={this.props.checked} onChange={this.props.handleChange} />;
  }
}

export default MyTag;
