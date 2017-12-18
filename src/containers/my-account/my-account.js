import React  from 'react'
import Importer from 'components/template/importer'
import { Button, Table, Menu, Dropdown, Icon } from 'antd'
import config from 'config'
import { injectIntl } from 'react-intl';
import 'styles/my-account/my-account.scss'

class MyAccount extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      dropDownLabel: formatMessage({id: "account.createExpense"}),
      data: [],
      dropDown: [
        {label: formatMessage({id: "account.createExpense"}), value: '0'},
        {label: formatMessage({id: "account.manuallyCreate"}), value: '1'},
        {label: formatMessage({id: "account.inputInvoice"}), value: '2'},
        {label: formatMessage({id: "account.cardConsumption"}), value: '3'}
      ],
      columns:[
        {          /*序号*/
          title: formatMessage({id:"announcement-info.number"}), key: "number", dataIndex: 'number',width: '10%',
        },
        {          /*费用类型*/
          title: formatMessage({id:"itemMap.expenseType"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*发生日期*/
          title: formatMessage({id:"account.occur"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*备注*/
          title: formatMessage({id:"budget.structureDescription"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*附件*/
          title: formatMessage({id:"account.accessory"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*费用属性*/
          title: formatMessage({id:"account.expenseAttributes"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*币种*/
          title: formatMessage({id:"account.currency"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*金额*/
          title: formatMessage({id:"account.money"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {          /*本币金额*/
          title: formatMessage({id:"account.currencyMoney"}), key: "itemCode", dataIndex: 'itemCode'
        },
        {title: formatMessage({id:"common.operation"}), key: 'operation', width: '15%', render: (text, record) => (
          <span>
          <Popconfirm onConfirm={(e) => this.deleteItem(e, record)} title={formatMessage({id:"budget.are.you.sure.to.delete.rule"}, {controlRule: record.controlRuleName})}>{/* 你确定要删除organizationName吗 */}
            <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>{formatMessage({id: "common.delete"})}</a>
          </Popconfirm>
        </span>)},  //操作
      ]
    };
  }

  componentWillMount(){
    this.getList();
  }

  getList(){

  }

  //生成报销单
  handleExpenseAccount = ()=>{

  };

  handleButtonClick = ()=>{
    console.log('click', e);
  };

  handleMenuClick = (e)=>{
    console.log(e)
    this.setState({
      dropDownLabel: this.state.dropDown[e.key].label
    })
  };

  render(){
    const { loading, data, pagination, columns, dropDown, dropDownLabel } = this.state;
    const { formatMessage } = this.props.intl;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {dropDown.map((item)=>(<Menu.Item key={item.value}>{item.label}</Menu.Item>))}
      </Menu>
    );
    return(
      <div className="my-account">
        <div className="my-account-table-header">
          <Button type="primary" className="table-header-button" onClick={this.handleExpenseAccount}>{formatMessage({id: "account.createExpenseAccount"})}</Button>
          <Dropdown.Button  className="table-header-dropDown" onClick={this.handleButtonClick} overlay={menu}>
            {dropDownLabel}
          </Dropdown.Button>
          <div className="table-header-message">
            <span><Icon className="table-header-message-img" type="info-circle" style={{color: '#1890ff' }}/></span>
            <span>{formatMessage({id: "account.selected"})}</span>
            <span className="table-header-message-number"> 1</span>
            <span>{ formatMessage({id:"account.message"})}</span>
            <span className="table-header-message-number">500.9</span>
          </div>
        </div>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          bordered
          size="middle"/>
      </div>
    )
  }
}

export default injectIntl(MyAccount);
