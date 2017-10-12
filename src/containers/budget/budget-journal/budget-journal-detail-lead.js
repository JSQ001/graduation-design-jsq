/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Tabs} from 'antd';
const TabPane = Tabs.TabPane;

import httpFetch from 'share/httpFetch';
import config from 'config'




class BudgetJournalDetailLead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey:'uploadFiles'
    };
  }

  onChange=()=>{}

  render() {
    return (
      <div className="budget-journal-detail-lead">
      <Tabs
        type="card"
        onChange={this.onChange}
        activeKey={this.state.activeKey}
      >

        <TabPane tab={this.props.intl.formatMessage({id:"budget.upload.files"})} key="uploadFiles">
          <div className="">
            <div>
              <h3> {this.props.intl.formatMessage({id:"budget.new.excel"})}</h3>
              <div>
                <div>{this.props.intl.formatMessage({id:"budget.download.excel.step1"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.download.excel.step2"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.download.excel.step3"})}</div>
              </div>
            </div>

            <div>
              <h3>{this.props.intl.formatMessage({id:"budget.upload.excel"})} </h3>
              <div>
                <div>{this.props.intl.formatMessage({id:"budget.upload.excel.step1"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.upload.excel.step2"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.upload.excel.step3"})}</div>
              </div>
            </div>

          </div>
        </TabPane>
        <TabPane tab={this.props.intl.formatMessage({id:"budget.leading.result"})} key="leadingResult">
          <div>
22222222222222
          </div>
        </TabPane>
      </Tabs>
       </div>
    );
  }
}



function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetailLead));
