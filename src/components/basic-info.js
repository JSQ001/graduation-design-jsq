import React from 'react'
import { Form, Card, Row, Col, Badge } from 'antd'

import SearchArea from 'components/search-area'
import moment from 'moment'
import 'styles/components/basic-info.scss'

/**
 * 基本信息组件
 * @params infoList   渲染表单所需要的配置项，见底端注释
 * @params infoData  基本信息数据
 * @params updateHandle  点击保存时的回调
 * @params updateState  保存状态，保存成功设为true，保存失败设为false，用于判断修改界面是否关闭
 */

class BasicInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      infoList: [],
      params: {},
      cardShow: true,
    };
  }

  componentWillMount(){
    this.setState({ infoList: this.props.infoList })
  };

  componentWillReceiveProps(nextProps){
    this.setState({ params: nextProps.infoData });
    if(nextProps.updateState) {
      this.handelCancel();
    }
  }

  editInfo = () => {
    this.setState({ cardShow: false })
  }

  renderGetInfo(item) {
    if (item.type == 'switch') {
      return <Badge status={this.state.params[item.id] ? 'success' : 'error'} text={this.state.params[item.id] ? '启用' : '禁用'} />;
    } else {
      return <div>{this.state.params[item.id]}</div>;
    }
  }
  getInfos() {
    const children = [];
    this.props.infoList.map((item)=>{
      children.push(
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.label}</div>
          {this.renderGetInfo(item)}
        </Col>
      );
      item.defaultValue = this.state.params[item.id];
      if(item.type == 'date') {
        item.defaultValue = moment( item.defaultValue, 'YYYY-MM-DD');
      }
    });
    return children;
  }

  handleUpdate = (params) => {
    this.props.updateHandle(params);
  }

  handelCancel = () => {
    this.setState({ cardShow: true })
  }

  render() {
    const { cardShow, infoList } = this.state;
    let domRender;
    if(cardShow) {
      domRender = (
        <Card title="基本信息"
              extra={<a onClick={this.editInfo}>编辑</a>}
              noHovering >
          <Row>{this.getInfos()}</Row>
        </Card>
      )
    } else {
      domRender = (
        <SearchArea searchForm={infoList}
                    submitHandle={this.handleUpdate}
                    clearHandle={this.handelCancel}
                    okText="保存" clearText="取消"/>
      )
    }
    return (
      <div className="basic-info">
        {domRender}
      </div>
    )
  }
}

BasicInfo.propTypes = {
  infoList: React.PropTypes.array.isRequired,  //传入的基础信息列表
  infoData: React.PropTypes.object.isRequired,  //传入的基础信息值
  updateHandle: React.PropTypes.func.isRequired,  //更新表单事件
  updateState: React.PropTypes.bool.isRequired,  //更新状态（true／false）
};

const WrappedBasicInfo= Form.create()(BasicInfo);

export default WrappedBasicInfo;

