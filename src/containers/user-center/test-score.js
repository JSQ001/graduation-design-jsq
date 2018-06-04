/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Row, Col, List, Avatar} from 'antd';
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl'
import 'styles/user-center/work-score.scss'
import httpFetch from 'share/httpFetch'
import config from 'config'

class TestScore extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentWillMount(){
    //获取用户信息
    httpFetch.get(`${config.baseUrl}/api/title/test/score`).then(response=>{
      this.setState({
        loading: false,
        data: response.data
      })
    })
  }

  render(){
    const {data} = this.state;
    return (
      <div className="user-info">
        <List
          className="list"
          size="small"
          itemLayout="horizontal"
          bordered
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.titleName}</a>}
                description={item.score}
              />
            </List.Item>
          )}
        />
      </div>)
  }
}
TestScore.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(injectIntl(TestScore));
