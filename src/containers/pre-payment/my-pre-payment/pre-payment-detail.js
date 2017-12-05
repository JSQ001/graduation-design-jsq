/**
 * Created by 13576 on 2017/12/4.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import config from 'config'
import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import { Form, Affix, Button, message } from 'antd'

import PrePaymentCommon  from 'containers/pre-payment/my-pre-payment/pre-payment-common'
import 'styles/pre-payment/my-pre-payment/pre-payment-detail.scss'

class PrePaymentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dLoading: false,
      myContract:  menuRoute.getRouteItem('my-contract','key'),    //我的合同
    }
  }

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
    let url = `${config.contractUrl}/api/contract/header/${this.props.params.id}`;
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
    const { loading, dLoading } = this.state;
    return (
      <div className="pre-payment-detail background-transparent">
        <PrePaymentCommon contractEdit={true} id={this.props.params.id} />
        <Affix offsetBottom={0} className="bottom-bar">
          <Button type="primary" onClick={this.onSubmit} loading={loading} style={{margin:'0 20px'}}>提 交</Button>
          <Button onClick={this.onCancel}>保 存</Button>
          <Button style={{marginLeft:'50px'}} onClick={this.onDelete} loading={dLoading}>删除</Button>
          <Button style={{marginLeft:'20px'}} onClick={this.onCancel}>返 回</Button>
        </Affix>
      </div>
    )
  }
}

PrePaymentDetail.contextTypes = {
  router: React.PropTypes.object
};

const wrappedPrePaymentDetail = Form.create()(injectIntl(PrePaymentDetail));

export default wrappedPrePaymentDetail;
