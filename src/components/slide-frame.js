import React from 'react'
import {Icon} from 'antd'

import 'styles/components/slide-frame.scss'

class SlideFrame extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      className: 'slide-frame animated hide',
      showFlag: false
    };
  }

  show = () => {
    this.setState({
      className: 'slide-frame animated slideInRight',
      showFlag: false
    })
  };

  close = () => {
    this.setState({
      className: 'slide-frame animated slideOutRight',
      showFlag: false
    });
    setTimeout(()=>{
      this.setState({
        className: 'slide-frame animated hide'
      })
      this.props.onClose();
    }, 500)
  };

  componentWillReceiveProps(nextProps){
    nextProps.show !== this.state.showFlag && (nextProps.show ? this.show() : this.close);
  }

  render(){
    return (
      <div className={this.state.className} style={{width: this.props.width}}>
        <div className="slide-title">{this.props.title}<Icon type="close" className="close-icon" onClick={this.close}/></div>
        <div className="slide-content">{this.props.children}</div>
      </div>
    )
  }
}

SlideFrame.propTypes = {
  width: React.PropTypes.string,
  title: React.PropTypes.string,
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

export default SlideFrame
