
/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, List, Avatar } from 'antd';
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl'
import 'styles/user-center/work-score.scss'

class TestScore extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentWillMount(){
    //获取用户信息
  }

  render(){
    const {data} = this.state;

    return (
      <div className="work-score">
        <List
          className="list"
          size="small"
          itemLayout="horizontal"
          bordered
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
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
