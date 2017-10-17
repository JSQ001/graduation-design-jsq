/**
 * Created by 13576 on 2017/10/6.
 */
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Button, Table, Select,Tabs,Input,Modal} from 'antd';
const TabPane = Tabs.TabPane;

import httpFetch from 'share/httpFetch';
import config from 'config'
import 'styles/budget/budget-journal/budget-journal-detail-lead.scss'

class BudgetJournalDetailLead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey:'uploadFiles',
    };
  }

  onChange=()=>{}

  handleModalOk=()=>{
    this.props.onOk();
  }

  handleModal=()=>{
    this.onCancel();
  }

  //点击下一步
  handleLastStep=()=>{
    this.setState({
      activeKey:"leadingResult"
    });

  }



  render() {
    const { visible, onCancel,onOk } = this.props;
    return (
      <Modal
        width={650}
        title="预算导入"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
      <div className="budget-journal-detail-lead">
      <Tabs
        type="card"
        onChange={this.onChange}
        activeKey={this.state.activeKey}
      >

        <TabPane tab={this.props.intl.formatMessage({id:"budget.upload.files"})} key="uploadFiles">
          <div className="card-top">

            <div className="card-title">
              <h3> {this.props.intl.formatMessage({id:"budget.new.excel"})}</h3>
              <div className="card-cent">
                <div><Button size="small" type="primary">{this.props.intl.formatMessage({id:"budget.new.excel"})}</Button></div>
                <div>{this.props.intl.formatMessage({id:"budget.download.excel.step1"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.download.excel.step2"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.download.excel.step3"})}</div>
              </div>
            </div>

            <div className="card-title">
              <h3>{this.props.intl.formatMessage({id:"budget.upload.excel"})} </h3>
              <div className="card-cent">
                <div>{this.props.intl.formatMessage({id:"budget.upload.excel.step1"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.upload.excel.step2"})}</div>
                <div>{this.props.intl.formatMessage({id:"budget.upload.excel.step3"})}</div>
              </div>

              <div className="card-input">
                <span>{this.props.intl.formatMessage({id:"budget.budget.leading"})}</span>
                <Input size="small"/>
                <Button size="small" type="primary">{this.props.intl.formatMessage({id:"budget.preview"})}</Button>
              </div>
            </div>

          </div>
        </TabPane>
        <TabPane tab={this.props.intl.formatMessage({id:"budget.leading.result"})} key="leadingResult">
          <div className="card-top">
            <div>
              <span className="card-span">导入成功</span>
            </div>
            <div>
              <span className="card-span">导入失败</span>
            </div>
          </div>
        </TabPane>
      </Tabs>

        <div className={this.state.activeKey=="uploadFiles"?"Model-footer":"Model-footer-display"}>
          <Button >{this.props.intl.formatMessage({id:"common.cancel"})}</Button>
          <Button type="primary" onClick={this.handleLastStep}> {this.props.intl.formatMessage({id:"budget.budget.leading"})}</Button>
        </div>

        <div className={this.state.activeKey=="leadingResult"?"Model-footer":"Model-footer-display"}>
          <Button >完成</Button>
        </div>

       </div>
      </Modal>


    );
  }
}

BudgetJournalDetailLead.propTypes = {
  visible: React.PropTypes.bool,  //对话框是否可见
  onOk: React.PropTypes.func,  //点击OK后的回调，当有选择的值时会返回一个数组
  onCancel: React.PropTypes.func,  //点击取消后的回调
};

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(BudgetJournalDetailLead));
