import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Table, Badge, Row, Col } from 'antd'

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

class AccountPeriodDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      periodInfo: {},
      periodInfoList: [
        {label: '会计期代码', id: 'periodSetCode'},
        {label: '会计期名称', id: 'periodSetName'},
        {label: '期间总数', id: 'totalPeriodNum'},
        {label: '账套代码', id: 'setOfBooksCode'},
        {label: '账套名称', id: 'setOfBooksName'}
      ],
    };
  }

  componentWillMount() {
    this.getPeriodInfo();
  }

  getPeriodInfo = () => {
    let url =  `${config.baseUrl}/api/setOfBooks/query/head/dto?periodSetId=${this.props.params.periodSetId}&setOfBooksId=${this.props.params.setOfBooksId}`;
    httpFetch.get(url).then((res) => {
      this.setState({ periodInfo: res.data })
    }).catch((e) => {
      console.log(e)
    })
  };

  render(){
    const { periodInfo, periodInfoList } = this.state;
    const periodCol = periodInfoList.map(item => {
      return (
        <Col span={8} style={{marginBottom: '15px'}} key={item.id}>
          <div style={{color: '#989898'}}>{item.label}:</div>
          <div style={{wordWrap:'break-word'}}>{item.id}</div>
        </Col>
      )
    });
    return (
      <div className="account-period-detail">
        <h3 className="header-title">账套期间信息</h3>
        <Row style={{background:'#f7f7f7',padding:'16px',borderRadius:'6px'}}>
          {periodCol}
        </Row>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedAccountPeriodDetail = Form.create()(AccountPeriodDetail);

export default connect(mapStateToProps)(injectIntl(WrappedAccountPeriodDetail));
