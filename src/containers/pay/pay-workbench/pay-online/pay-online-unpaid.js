import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Table, Breadcrumb, Alert } from 'antd'

class PayOnlineUnpaid extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      columns: [
        {title: '单据编号 | 单据类型', dataIndex: '1', key: '1'},
        {title: '工号 | 申请人', dataIndex: '2', key: '2'},
        {title: '申请日期', dataIndex: '3', key: '3'},
        {title: '币种', dataIndex: '4', key: '4'},
        {title: '总金额', dataIndex: '5', key: '5'},
        {title: '已核销金额', dataIndex: '6', key: '6'},
        {title: '可支付金额', dataIndex: '7', key: '7'},
        {title: '本次支付金额', dataIndex: '8', key: '8'},
        {title: '付款方式', dataIndex: '9', key: '9'},
        {title: '类型 | 收款方', dataIndex: '10', key: '10'},
        {title: '收款账号', dataIndex: '11', key: '11'},
        {title: '状态', dataIndex: '12', key: '12'},
        {title: '操作', dataIndex: '13', key: '13'}
      ],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      data: [],    //列表值
      selectedRowKeys: [],
      selectedEntityOIDs: []    //已选择的列表项的OIDs
    };
  }

  componentWillMount() {
    const data = [{
      1: 'LA12321231213 | 借款申请单',
      2: '12303 | Louis',
      3: '2017-12-12',
      4: 'CNY',
      5: '12,122,122.00',
      6: '2,000.00',
      7: '122,122.00',
      8: '12,122,122.00',
      9: '线上',
      10: '对私 | jack',
      11: '123123123',
      12: '未付款'
    },{
      1: 'LA12321231213 | 借款申请单',
      2: '12303 | Louis',
      3: '2017-12-12',
      4: 'CNY',
      5: '12,122,122.00',
      6: '2,000.00',
      7: '122,122.00',
      8: '12,122,122.00',
      9: '线上',
      10: '对私 | jack',
      11: '123123123',
      12: '未付款'
    }];
    this.setState({data})
  }

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected)
      temp.push(record.id);
    else
      temp.delete(record.id);
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  //全选
  onSelectAllRow = (selected) => {
    let temp = this.state.selectedEntityOIDs;
    if(selected){
      this.state.data.map(item => {
        temp.addIfNotExist(item.id)
      })
    } else {
      this.state.data.map(item => {
        temp.delete(item.id)
      })
    }
    this.setState({
      selectedEntityOIDs: temp,
      batchCompany: temp.length>0 ? false : true
    })
  };

  onSelectAllRow = () => {

  };

  tableTitle = () => {
    return (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}</Breadcrumb.Item>
        <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
        <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
        <Breadcrumb.Item>单据数：<span className="num-style">10笔</span></Breadcrumb.Item>
      </Breadcrumb>
    )
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { loading, columns, data, pagination, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRow,
      onSelectAll: this.onSelectAllRow
    };
    return (
      <div className="pay-online-unpaid">

        <Table columns={columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               rowSelection={rowSelection}
               title={this.tableTitle}
               bordered
               size="middle"/>
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOnlineUnpaid));
