import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Form, Select, Tag, Input, Table} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;

import httpFetch from 'share/httpFetch'
import menuRoute from 'share/menuRoute'
import config from 'config'

import 'styles/finance-setting/account-period-define/new-account-rule.scss'

class NewAccountPeriod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleIsDefine: false,  //规则是否定义
      periodDetail: null,
      columns: [
        {title: '序号', dataIndex: 'periodNum', key: 'periodNum', width: '6%'},
        {title: '期间名附加', dataIndex: 'periodAdditionalName', key: 'periodAdditionalName'},
        {title: '月份从', dataIndex: 'monthFrom', key: 'monthFrom'},
        {title: '日期从', dataIndex: 'dateFrom', key: 'dateFrom'},
        {title: '月份到', dataIndex: 'monthTo', key: 'monthTo'},
        {title: '日期到', dataIndex: 'dateTo', key: 'dateTo'},
        {title: '季度', dataIndex: 'quarterNum', key: 'quarterNum'},
        {title: '调整', dataIndex: 'adjustmentFlag', key: 'adjustmentFlag'}
      ],
    };
  }

  componentWillMount() {
    // console.log(this.props.params);
  }

  render(){
    const { formatMessage } = this.props.intl;
    const { columns } = this.state;
    return (
      <div className="new-account-rule">
        <h3 className="header-title">{formatMessage({id: 'account-period-define.rule.define'})/* 会计期规则定义 */}
          <Tag color={this.state.ruleIsDefine ? 'green-inverse' : 'red-inverse'}>
            {this.state.ruleIsDefine ? formatMessage({id: 'account-period-define.rule.has-define'}) :
              formatMessage({id: 'account-period-define.rule.not-define'})}
          </Tag>
        </h3>
        <Form style={{overflow:'hidden'}}>
          <FormItem label={formatMessage({id: 'account-period-define.rule.total-period'})/* 期间总数 */}
                    style={{width:'20%',marginRight:'30px'}}
                    className="float-left">
            <Input value="12" disabled/>
          </FormItem>
          <FormItem label={formatMessage({id: 'account-period-define.rule.addition-name'})/* 名称附加 */}
                    style={{width:'40%'}}
                    className="float-left">
            <Input value="附加前缀" disabled/>
          </FormItem>
        </Form>
        <Table columns={columns}
               bordered
               size="middle"/>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {}
}

const WrappedNewAccountPeriod = Form.create()(NewAccountPeriod);

export default connect(mapStateToProps)(injectIntl(WrappedNewAccountPeriod));
