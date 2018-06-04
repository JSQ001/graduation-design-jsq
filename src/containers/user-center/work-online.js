/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, List, Avatar} from 'antd';
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/user-center/user-info.scss'

class WorkOnline extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  componentWillMount(){
    //获取用户信息
    console.log(this.props.user)
    let params = {
      titleType: 'work'
    };
    httpFetch.get(`${config.baseUrl}/api/title/head/search`,params).then(response=>{
      this.setState({
        loading: false,
        data: response.data
      })
    })
  }

  onClick = ()=>{
    alert(1)
  };

  render(){
    const {loading, data} = this.state;

    return (
      <div className="user-info">
        <List
          className="list"
          size="small"
          itemLayout="horizontal"
          loading={loading}
          dataSource={data}
          renderItem={item => (
            <List.Item >
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a onClick={this.onClick}>{item.titleName}</a>}
                description=""
              />
            </List.Item>
          )}
        />
      </div>)
  }
}
WorkOnline.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(injectIntl(WorkOnline));
