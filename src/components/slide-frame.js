import React from 'react'
import {Icon} from 'antd'

import 'styles/components/slide-frame.scss'

/**
 * 侧拉组件，该组件内部组件将自带this.props.close方法关闭侧拉栏
 */
class SlideFrame extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      className: 'slide-frame animated hide',
      showFlag: false
    };
  }

  /**
   * 组装方法
   * @param content 内部组件
   * @return {*} 给组件添加this.props.close方法
   */
  wrapClose = (content) =>{
    const newProps = {
      close : this.close
    };
    return React.createElement(content, newProps);
  };

  show = () => {
    this.setState({
      className: 'slide-frame animated slideInRight',
      showFlag: true
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
      });
      this.props.afterClose();
    }, 500)
  };

  /**
   * 根据传入的show值进行判断是否显示
   * @param nextProps
   */
  componentWillReceiveProps(nextProps){
    nextProps.show !== this.state.showFlag && (nextProps.show ? this.show() : this.close());
  }

  render(){
    return (
      <div>
        <div className={this.props.hasMask && this.state.showFlag ? 'slide-mask' : 'hide'} onClick={this.props.onClose}/>
        <div className={this.state.className} style={{width: this.props.width}}>
          <div className="slide-title">{this.props.title}<Icon type="close" className="close-icon" onClick={this.props.onClose}/></div>
          <div className="slide-content">
            {this.wrapClose(this.props.content)}
          </div>
        </div>
      </div>
    )
  }
}

SlideFrame.propTypes = {
  width: React.PropTypes.string,  //宽度
  title: React.PropTypes.string,  //标题
  show: React.PropTypes.bool,  //是否显示
  hasMask: React.PropTypes.bool,  //是否有遮罩层
  onClose: React.PropTypes.func,  //点击遮罩层或右上方x时触发的事件
  content: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]),  //内容component，包裹后的元素添加this.props.close方法进行侧滑关闭
  afterClose: React.PropTypes.func  //关闭后触发的事件，用于更新外层的show值
};

SlideFrame.defaultProps = {
  onClose: ()=>{},
  okText: '保存',
  cancelText: '取消',
  hasMask: true,
  afterClose: ()=>{}
};

export default SlideFrame
