import React from 'react'
import { Form, Card, Row, Col, Badge } from 'antd'

import SearchArea from 'components/search-area'
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
      cardShowStyle: {
        display: 'block'
      },
      formShowStyle: {
        display: 'none'
      },
    };
  }

  componentWillMount(){
    this.setState({ infoList: this.props.infoList })

  };

  componentWillReceiveProps(nextProps){
    this.setState({ params: nextProps.infoData })
    if(nextProps.updateState) {
      this.handelCancel();
    }
  }

  editInfo = () => {
    this.setState({
      cardShowStyle: {
        display: 'none'
      },
      formShowStyle: {
        display: 'block'
      }
    })
  }

  renderGetInfo(item) {
    if (item.type == 'state') {
      return <Badge status={this.state.params[item.id] ? 'success' : 'error'} text={this.state.params[item.id] ? '启用' : '禁用'} />;
    } else {
      return <div>{this.state.params[item.id]}</div>;
    }
  }
  getInfos() {
    const children = [];
    this.props.infoList.map((item, i)=>{
      children.push(
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.label}</div>
          {this.renderGetInfo(item)}
        </Col>
      );
    });
    return children;
  }

  handleUpdate = (params) => {
    this.props.updateHandle(params);
  }

  handelCancel = () => {
    this.setState({
      cardShowStyle: {
        display: 'block'
      },
      formShowStyle: {
        display: 'none'
      }
    })
  }

  render() {
    const { cardShowStyle, formShowStyle, infoList } = this.state;
    return (
      <div className="basic-info">
        <Card title="基本信息"
              extra={<a onClick={this.editInfo}>编辑</a>}
              style={cardShowStyle}
              noHovering >
          <Row>{this.getInfos()}</Row>
        </Card>
        <div style={formShowStyle}>
          <SearchArea searchForm={infoList}
                      submitHandle={this.handleUpdate}
                      clearHandle={this.handelCancel}/>
        </div>
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


/**
 *
 * @type searchForm 表单列表，如果项数 > 6 则自动隐藏多余选项到下拉部分，每一项的格式如下：
 * {
          type: '',    //必填，类型,为input、select、date、radio、big_radio、checkbox、combobox、multiple中的一种
          id: '',      //必填，表单id，搜索后返回的数据key
          label: '',   //必填，界面显示名称label
          isRequired: true    //可选，必须输入时填写
          disabled: true      //可选，不可编辑时填写
          options: [{label: '', value: ''}],    //可选，如果不为input、date时必填，为该表单选项数组，因为不能下拉刷新，所以如果可以搜索type请选择combobox或multiple，否则一次性传入所有值
          event: '',           //可选，自定的点击事件ID，将会在eventHandle回调内返回
          defaultValue: ''    //可选，默认值
          searchUrl: '',     //可选，当类型为combobox和multiple有效，搜索需要的接口，
          getUrl: '',       //可选，初始显示的值需要的接口
          method: '',      //可选，接口所需要的接口类型get/post
          searchKey: '',  //搜索参数名
          labelKey: '',  //可选，接口返回的数据内所需要页面options显示名称label的参数名
          valueKey: ''  //可选，接口返回的数据内所需要options值value的参数名
        }
 */

const WrappedBasicInfo= Form.create()(BasicInfo);

export default WrappedBasicInfo;

