/**
 * Created by jsq on 2018/1/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

class Project extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  componentWillMount(){
    //获取用户信息
    console.log(this.props.user)
    httpFetch.get(`${config.baseUrl}/api/work/${1}?type=work`).then(response=>{
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
                title={<a onClick={this.onClick}>{item.projectName}</a>}
                description=""
              />
            </List.Item>
          )}
        />
      </div>)
  }
}
Project.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(injectIntl(Project));
