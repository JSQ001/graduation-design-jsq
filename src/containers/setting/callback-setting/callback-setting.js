/**
 * created by jsq on 2017/10/16
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Form, InputNumber, Checkbox, Row, Col} from 'antd'

import SearchArea from 'components/search-area.js';
import httpFetch from 'share/httpFetch';
import config from 'config'
import menuRoute from 'share/menuRoute'

import 'styles/setting/callback-setting/callback-setting.scss'

const FormItem = Form.Item;

class CallBackSetting extends React.Component{
  constructor(props){
    super(props);
    this.state = {}

  }
  render(){
    return(
      <div className="call-back-setting">
        回调设置

      </div>
    )
  }
}

CallBackSetting.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {}
}
const WrappedCallBackSetting = Form.create()(CallBackSetting);

export default connect(mapStateToProps)(injectIntl(WrappedCallBackSetting));
