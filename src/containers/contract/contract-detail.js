import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { Form, Affix, Button, message } from 'antd'

import ContractDetailCommon from 'containers/contract/contract-detail-common'
import 'styles/contract/contract-detail.scss'

class ContractDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dLoading: false,
      submitAble: false,
      myContract:  menuRoute.getRouteItem('my-contract','key'),    //我的合同
    }
  }

  //获取合同状态
  getStatus = (status) => {
    if (status === 'GENERATE' || status === 'REJECTED' || status === 'WITHDRAWAL') {
      this.setState({ submitAble: true })
    }
  };

  //提交
  onSubmit = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/submit/${this.props.params.id}`;
    this.setState({ loading: true });
    httpFetch.put(url, {id: this.props.params.id}).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false });
        message.success('提交成功');
        this.onCancel()
      }
    }).catch(e => {
      this.setState({ loading: false });
      message.error(`提交失败，${e.response.data.message}`)
    })
  };

  //删除
  onDelete = () => {
    let url = `${config.contractUrl}/contract/api/contract/header/${this.props.params.id}`;
    this.setState({ dLoading: true });
    httpFetch.delete(url, {id: this.props.params.id}).then(res => {
      if (res.status === 200) {
        this.setState({ dLoading: false });
        message.success('删除成功');
        this.onCancel()
      }
    }).catch(e => {
      this.setState({ dLoading: false });
      message.error(`删除失败，${e.response.data.message}`)
    })
  };

  //取消
  onCancel = () => {
    this.context.router.push(this.state.myContract.url);
  };

  render() {
    const { loading, dLoading, submitAble } = this.state;
    return (
      <div className="contract-detail background-transparent">
        <ContractDetailCommon id={this.props.params.id}
                              getContractStatus={this.getStatus}/>
        {submitAble && (
          <Affix offsetBottom={0} className="bottom-bar">
            <Button type="primary" onClick={this.onSubmit} loading={loading} style={{margin:'0 20px'}}>提 交</Button>
            <Button onClick={this.onCancel}>保 存</Button>
            <Button style={{marginLeft:'50px'}} onClick={this.onDelete} loading={dLoading}>删除该合同</Button>
            <Button style={{marginLeft:'20px'}} onClick={this.onCancel}>返 回</Button>
          </Affix>
        )}
        {!submitAble && (
          <Affix offsetBottom={0} className="bottom-bar">
            <Button style={{marginLeft:'30px'}} onClick={this.onCancel}>返 回</Button>
          </Affix>
        )}
      </div>
    )
  }
}

ContractDetail.contextTypes = {
  router: React.PropTypes.object
};

const wrappedContractDetail = Form.create()(injectIntl(ContractDetail));

export default wrappedContractDetail;
