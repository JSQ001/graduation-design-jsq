/**
 *  created by jsq on 2017/9/22
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch';
import config from 'config'
import { Form, Button, Select, Row, Col, Input, Switch, Icon, Badge, Tabs, Table, message  } from 'antd'

import 'styles/budget-setting/budget-organization/budget-item/budget-item-detail.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class BudgetItemDetail extends React.Component{
  constructor(){
    super(props);
    this.state = {
      loading: true,
      data: [],
      pagination:{

      },
      columns:[
        {
          title:this.props.intl.formatMessage({id:"dimensionCode"}), key: "dimensionCode", dataIndex: 'dimensionCode'   /*维度代码*/
        },
        {
          title:this.props.intl.formatMessage({id:"description"}), key: "description", dataIndex: 'description'   /*描述*/
        },
        {
          title:this.props.intl.formatMessage({id:"layoutPosition"}), key: "layoutPosition", dataIndex: 'layoutPosition'   /*布局位置*/
        },
        {
          title:this.props.intl.formatMessage({id:"layoutPriority"}), key: "layoutPriority", dataIndex: 'layoutPriority'   /*布局顺序*/
        },
        {
          title:this.props.intl.formatMessage({id:"defaultDimValueCode"}), key: "defaultDimValueName", dataIndex: 'defaultDimValueName'   /*默认维值*/
        },
        {
          title:"操作", key: "opration", dataIndex: 'opration'   /*操作*/
        },
      ],
    }
  }
  render(){
    return(
      <div className="budget-item-detail">
        <div className="common-top-area">
          <div className="common-top-area-title">
            {this.props.intl.formatMessage({id:"title.basicInformation"}) /*基本信息*/}
            {!edit ? <span className="title-edit" onClick={this.handleEdit}>{this.props.intl.formatMessage({id:"text.edit"}) /*编辑*/}</span> : null}
          </div>
          <div className="common-top-area-content form-title-area ">
            {this.renderForm()}
          </div>
        </div>
        <div className="structure-detail-distribution">
          <Tabs onChange={this.onChangeTabs}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className="table-header">
          <div className="table-header-title">{this.props.intl.formatMessage({id:'search.total'},{total:`${total}`})}</div>  {/*共搜索到*条数据*/}
          <div className="table-header-buttons">
            <Button type="primary" onClick={this.handleCreate}>{this.props.intl.formatMessage({id: 'button.add'})}</Button>  {/*添 加*/}
          </div>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={pagination}
          size="middle"
          bordered/>
      </div>)
  }
}

function mapStateToProps(state) {
  return {
    organization: state.budget.organization
  }
}

const WrappedBudgetItemDetail = Form.create()(BudgetItemDetail);

export default connect(mapStateToProps)(injectIntl(WrappedBudgetItemDetail));

