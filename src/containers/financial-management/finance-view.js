import React from 'React'
import { injectIntl } from 'react-intl';
import { Form, Row, Col, Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group;

import SearchArea from 'components/search-area'

import 'styles/financial-management/finance-view.scss'

class FinanceView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchForm: [
        {type: 'input', id: 'userOID', label: '申请人姓名/工号'},
        {type: 'input', id: 'businessCode', label: '单号'},
        {type: 'items', id: 'dateRange', items: [
          {type: 'date', id: 'dateFrom', label: '提交日期从'},
          {type: 'date', id: 'dateTo', label: '提交日期至'}
        ]},
        {type: 'checkbox', id: 'status', label: '单号', options: [{label:'全部', value:'all'}]},
      ],
      listSearchForm: [
        {label: '报销单', id: 'expense', list: [{label: '全部', value: '1002'}]},
        {label: '借款单', id: 'borrow', list: [{label: '全部', value: '1008'}]}
      ]
    }
  }

  search = (result) => {

  };

  clear = () => {

  };

  render() {
    const { searchForm, listSearchForm } = this.state;
    return (
      <div className="finance-view">
        <div className="list-search-area">
          {listSearchForm.map(item => {
            return (
              <Row className="list-row" key={item.id}>
                <Col span={3} className="list-col-header"><span>{item.label} :</span></Col>
                <Col span={21} className="list-col-content">
                  <CheckboxGroup>
                    {item.list.map(list => {
                      return <Checkbox value={list.value} key={list.value}>{list.label}</Checkbox>
                    })}
                  </CheckboxGroup>
                </Col>
              </Row>
            )
          })}
        </div>
        <SearchArea searchForm={searchForm}
                    submitHandle={this.search}
                    clearHandle={this.clear}/>

      </div>
    )
  }
}

const WrappedUploadFile= Form.create()(injectIntl(FinanceView));

export default WrappedUploadFile;

