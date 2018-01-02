import React from 'react';
import 'styles/components/error.scss'
import errorImg from 'images/error.png'

class Error extends React.Component {
  render() {
    return (
      <div className="error">
        <div className="err-container">
          <img src={errorImg}/>
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
}

Error.PropTypes = {
  text: React.PropTypes.string
};

export default Error;
