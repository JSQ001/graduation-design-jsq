/**
 * created by jsq on 2017/12/11
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Tabs, Button, Table, Form, Badge, Checkbox, Row, Col, Dropdown, Menu, message} from 'antd'

import httpFetch from 'share/httpFetch';
import config from 'config'

class AnnouncementInformation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
    }
  }

  componentWillMount(){}

  render(){
    return (
      <div className="announcement-information">
        123
      </div>)
  }
}


AnnouncementInformation.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    company: state.login.company
  }
}
const WrappedAnnouncementInformation = Form.create()(AnnouncementInformation);

export default connect(mapStateToProps)(injectIntl(WrappedAnnouncementInformation));
