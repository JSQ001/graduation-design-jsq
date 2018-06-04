/**
 * Created by jsq on 2018/4/26.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Input, message ,Select, Form, Icon, Button, Row, Col, List, Avatar} from 'antd';
import menuRoute from 'routes/menuRoute'
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch'
import config from 'config'
import 'styles/user-center/user-info.scss'

class TestInline extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentWillMount(){
    let params = {
      titleType: 'test'
    };
    httpFetch.get(`${config.baseUrl}/api/title/head/${this.props.user.id}/search`,params).then(response=>{
      this.setState({
        loading: false,
        data: response.data
      })
    })
  }

  onClick = (e)=>{
    this.context.router.push("/main/test-page/:id".replace(':id',e.id));
  };

  render(){
    const {loading, data} = this.state;
    return (
      <div className="user-info">
        <List
          bordered
          className="list"
          size="small"
          itemLayout="horizontal"
          loading={loading}
          dataSource={data}
          renderItem={item => (
            <List.Item >
              <List.Item.Meta
                title={<a onClick={item.status==='待做'?()=>this.onClick(item) : "已完成"}>{item.titleName}</a>}
                description={item.status}
              />
            </List.Item>
          )}
        />
      </div>)
  }
}
TestInline.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(injectIntl(TestInline));
