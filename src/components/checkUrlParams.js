/**
 * Created By ZaraNengap on 2017/09/23
 */
import React from 'react'
import {connect} from 'react-redux';
import httpFetch from 'share/httpFetch'
import config from 'config'
import configureStore from 'stores'

import { setOrganization } from 'actions/budget'

/**
 * 参数检查组件，检查Url内是否含有需要保存在redux内的值，如果存在则根据url内参数进行对应的操作
 * 这样可以在进入一些特定url时自动检查状态从而更新redux
 * @param Component
 * @return {*}
 */
function checkUrlParams(Component) {

  // 组件有已登陆的模块 直接返回 (防止从新渲染)
  if (Component.checkUrlParamsComponent) {
    return Component.checkUrlParamsComponent
  }

  // 创建检查参数组件
  class checkUrlParamsComponent extends React.Component {

    constructor(){
      super();
      this.state = {check: false}
    }

    componentWillMount() {
      this.checkParams();
    }

    componentWillReceiveProps() {
      this.checkParams();
    }

    //检查有id在路径中的，如果需要设置redux全局则需要在此处配置
    checkParams() {
      const path = location.pathname;
      //检查预算组织详情id
      let section = path.split('/');
      section.splice(0, 1);
      if(path.indexOf('budget-organization-detail/') > -1 && !this.props.organization.id){
        httpFetch.get(`${config.budgetUrl}/api/budget/organizations/${section[4]}`).then(res => {
          configureStore.store.dispatch(setOrganization(res.data));
          this.setState({check: true});
        })
      } else {
        this.setState({check: true});
      }
    }

    render() {
      if (this.state.check) {
        return <Component {...this.props}/>
      }
      return (
        <div className="base">
          <div className="cube"/><div className="cube"/><div className="cube"/>
          <div className="cube"/><div className="cube"/><div className="cube"/>
          <div className="cube"/><div className="cube"/><div className="cube"/>
        </div>
      )
    }
  }

  function mapStateToProps(state) {
    return {
      organization: state.budget.organization
    };
  }

  function mapDispatchToProps(dispatch) {
    return {};
  }

  Component.checkUrlParamsComponent = connect(mapStateToProps, mapDispatchToProps)(checkUrlParamsComponent);
  return Component.checkUrlParamsComponent;
}

export default checkUrlParams
