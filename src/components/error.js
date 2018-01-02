import React from 'react';
import 'styles/components/error.scss'
import errorImg from 'images/error.png'
import { Button } from 'antd'

class Error extends React.Component {



  render() {
    return (
      <div className="error background-transparent">
        <img src={errorImg}/>
        <div className="error-message">
          <div>{this.props.title}</div>
          <div>{this.props.text}</div>
          <Button onClick={}>{this.props.buttonText}</Button>
        </div>
      </div>
    );
  }
}

Error.PropTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string,
  skip: React.PropTypes.string,
  buttonText: React.PropTypes.string,
  hasButton: React.PropTypes.bool
};

Error.defaultProps = {
  title: '出错啦',
  text: '请联系重试操作或联系管理员:(',
  skip: React.PropTypes.string,
  buttonText: React.PropTypes.string,
  hasButton: false
};

export default Error;
