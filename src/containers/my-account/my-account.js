import React  from 'react'
import { connect } from 'react-redux'
import { Button, Table, Menu, Dropdown, Icon, Row, Col, Popconfirm, Popover } from 'antd'
import config from 'config'
import { injectIntl } from 'react-intl';
import httpFetch from 'share/httpFetch'
import 'styles/my-account/my-account.scss'
import SlideFrame from "components/slide-frame";
import NewExpense from 'containers/my-account/new-expense'

class MyAccount extends React.Component{
  constructor(props){
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      data: [],
      columns:[
        {title: '序号', dataIndex: 'index', width: '5%'},
        {title: '费用类型', dataIndex: 'expenseTypeName'},
        {title: '日期', dataIndex: 'createdDate', render: createdDate => new Date(createdDate).format('yyyy-MM-dd')},
        {title: '备注', dataIndex: 'comment', render: comment => <Popover content={comment}>{comment}</Popover>},
        {title: '附件', dataIndex: 'attachments', width: '5%', render: attachments => attachments.length},
        {title: '币种', dataIndex: 'invoiceCurrencyCode', width: '5%'},
        {title: '金额', dataIndex: 'amount', render: this.filterMoney},
        {title: '本位币金额', dataIndex: 'actualCurrencyAmount', render: this.filterMoney},
        {title: '操作', dataIndex: 'operate', render: record => (
          <span>
            <a>复制</a>
            <span className="ant-divider" />
            <Popconfirm title="确认删除吗？" onConfirm={(e) => this.deleteExpense(e, record)}><a>{formatMessage({ id:"common.delete"})}</a></Popconfirm>
          </span>)}
      ],
      pagination: {
        total: 0,
      },
      page: 0,
      pageSize: 10,
      selectedData: [],  //已经选择的数据项
      rowSelection: {
        selectedRowKeys: [],
        onChange: this.onSelectChange,
        onSelect: this.onSelectItem,
        onSelectAll: this.onSelectAll
      },
      showExpenseFlag: false
    };
  }

  deleteExpense = (e, record) => {

  };

  componentWillMount(){
    this.getList();
  }

  getList(){
    let { page, pageSize } = this.state;
    this.setState({ loading: true });
    httpFetch.get(`${config.baseUrl}/api/invoices/init/all/by?page=${page}&size=${pageSize}`).then(res => {
      res.data.map((item, index) => {
        item.index = index + page * pageSize;
        return item;
      });
      this.setState({
        loading: false,
        data: res.data,
        pagination: {
          total: Number(res.headers['x-total-count']),
          onChange: this.onChangePager,
          current: this.state.page + 1
        }
      }, () => {
        this.refreshSelected();  //刷新当页选择器
      })
    })
  }

  onChangePager = (page) => {
    if(page - 1 !== this.state.page)
      this.setState({page: page - 1,}, this.getList)
  };

  /**
   * 根据selectedData刷新当页selection
   */
  refreshSelected(){
    let { selectedData, data, rowSelection } = this.state;
    let nowSelectedRowKeys = [];
    selectedData.map(selected => {
      data.map(item => {
        if(item.invoiceOID === selected.invoiceOID)
          nowSelectedRowKeys.push(item.invoiceOID)
      })
    });
    rowSelection.selectedRowKeys = nowSelectedRowKeys;
    this.setState({ rowSelection });
  };

  //选项改变时的回调，重置selection
  onSelectChange = (selectedRowKeys) => {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ rowSelection });
  };

  /**
   * 选择单个时的方法，遍历selectedData，根据是否选中进行插入或删除操作
   * @param record 被改变的项
   * @param selected 是否选中
   */
  onSelectItem = (record, selected) => {
    let { selectedData } = this.state;
    if(this.props.single){
      selectedData = [record];
    } else {
      if(!selected){
        selectedData.map((selected, index) => {
          if(selected.invoiceOID === record.invoiceOID){
            selectedData.splice(index, 1);
          }
        })
      } else {
        selectedData.push(record);
      }
    }
    this.setState({ selectedData });
  };

  //选择当页全部时的判断
  onSelectAll = (selected, selectedRows, changeRows) => {
    changeRows.map(changeRow => this.onSelectItem(changeRow, selected));
  };

  handleMenuClick = (e) => {
    switch(e.key){
      case '1':
        this.setState({showExpenseFlag: true});
        break;
      default:
        return;
    }
  };

  renderExpandedRow = (title, content) => {
    return (
      <Row gutter={20} type="flex" align="top" className="expanded-row" key={title}>
        <Col className="expanded-title">{title}</Col>
        <Col className="expanded-title">{content}</Col>
      </Row>
    )
  };

  renderAllExpandedRow = (record) => {
    let result = [];
    result.push(this.renderExpandedRow('汇率/金额',
      `金额: ${record.amount.toFixed(2)}${record.originalAmount === record.amount ? '' : 
        ((record.originalAmount > record.amount ? '-' : '+') + (Math.abs(record.originalAmount - record.amount).toFixed(2)))}` +
      `, 汇率: ${record.companyCurrencyRate.toFixed(4)}${record.actualCurrencyRate ?
        ((record.companyCurrencyRate > record.actualCurrencyRate ? '-%' : '+%') + 
          (Math.abs(record.actualCurrencyRate/record.companyCurrencyRate)).toFixed(4)) : ''}` +
      `, 折合本位币: ${record.actualCurrencyAmount.toFixed(2)}`));
    return result;
  };

  handleCloseExpense = (params) => {
    this.setState({showExpenseFlag: false})
  };

  render(){
    const { loading, data, pagination, columns, rowSelection, selectedData, showExpenseFlag } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">手工创建</Menu.Item>
        <Menu.Item key="2">录入发票</Menu.Item>
        <Menu.Item key="3">商务卡消费</Menu.Item>
      </Menu>
    );
    return(
      <div className="my-account">
        <div className="operate-area">
          <Button type="primary" disabled={selectedData.length === 0}>生成报销单</Button>
          <Dropdown overlay={menu}>
            <Button style={{ marginLeft: 8 }}>
              新建费用 <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <Table dataSource={data}
               size="middle"
               bordered
               expandedRowRender={this.renderAllExpandedRow}
               rowKey="invoiceOID"
               loading={loading}
               rowSelection={rowSelection}
               columns={columns}
               pagination={pagination}/>
        <SlideFrame show={showExpenseFlag}
                    title="新建费用"
                    content={NewExpense}
                    onClose={() => this.setState({showExpenseFlag: false})}
                    afterClose={this.handleCloseExpense}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(MyAccount));
