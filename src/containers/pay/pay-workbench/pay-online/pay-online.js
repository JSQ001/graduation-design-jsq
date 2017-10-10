import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import { Button, Tabs, Table, Breadcrumb, Icon, Alert } from 'antd'
const TabPane = Tabs.TabPane;
import SearchArea from 'components/search-area'

class PayOnline extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      loading: false,
      nowStatus: 'Unpaid',
      searchForm: [
        {type: 'input', id: 'num', label: '单据编号'},
        {type: 'select', id: 'type', label: '单据类型', options: []},
        {type: 'select', id: 'user', label: '申请人', options: []},
        {type: 'date', id: 'date', label: '申请日期'},
        {type: 'input', id: 'mount', label: '金额区间'},
        {type: 'input', id: 'pay', label: '收款方'}
      ],
      tabs: [
        {key: 'Unpaid', name:formatMessage({id:"payWorkbench.Unpaid"})},
        {key: 'Payment', name:formatMessage({id:"payWorkbench.Payment"})},
        {key: 'Fail', name:formatMessage({id:"payWorkbench.Fail"})},
        {key: 'Success', name:formatMessage({id:"payWorkbench.Success"})}
      ],
      columns: [
        {title: '单据编号 | 单据类型', dataIndex: '1', key: '1'},
        {title: '工号 | 申请人', dataIndex: '2', key: '2'},
        {title: '申请日期', dataIndex: 'date', key: 'date'},
        {title: '币种', dataIndex: 'currency', key: 'currency'},
        {title: '总金额', dataIndex: 'amount', key: 'amount'},
        {title: '已核销金额', dataIndex: '6', key: '6'},
        {title: '可支付金额', dataIndex: '7', key: '7'},
        {title: '本次支付金额', dataIndex: '8', key: '8'},
        {title: '付款方式', dataIndex: '9', key: '9'},
        {title: '类型 | 收款方', dataIndex: '10', key: '10'},
        {title: '收款账号', dataIndex: '11', key: '11'},
        {title: '状态', dataIndex: '12', key: '12'},
        {title: '操作', dataIndex: '13', key: '13',render: () => (<span><a>查看</a><span className="ant-divider" /><a>更多 <Icon type="down" /></a></span>)}
      ],
      pagination: {
        total: 0
      },
      page: 0,
      pageSize: 10,
      data: [],    //列表值
      selectedRowKeys: [],
      selectedEntityOIDs: [],    //已选择的列表项的OIDs
      selectedEntity: [],    //已选择的列表项的币种
      payNoticeWarning: '',
      payNoticeError: '',
      payOnline: true, //线上支付按钮
    };
  }

  componentWillMount() {
    let data = [];
    for(let i = 0; i < 10; i++) {
      data.push({
        'id': i,
        1: 'LA12321231213 | 借款申请单',
        2: '12303 | Louis',
        'date': '2017-12-12',
        'currency': i%2==0 ? 'CNY' : 'USD',
        'amount': 12122122,
        6: '2,000.00',
        7: '122,122.00',
        8: '12,122,122.00',
        9: '线上',
        10: '对私 | jack',
        11: '123123123',
        12: '未付款'
      })
    }
    this.setState({ data })
  }

  //搜索
  search = (result) => {

  };

  //清空搜索区域
  clear = () => {

  };

  //渲染Tabs
  renderTabs(){
    return (
      this.state.tabs.map(tab => {
        return <TabPane tab={tab.name} key={tab.key}/>
      })
    )
  }

  onChangeTabs = (nowStatus) =>{
    this.setState({ nowStatus })
  };

  renderContent = () => {
    const { loading, columns, data, pagination, selectedRowKeys, nowStatus } = this.state;
    switch (nowStatus){
      case 'Unpaid':
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
          onSelect: this.onSelectRow,
          onSelectAll: this.onSelectAllRow
        };
        const tableTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Unpaid"})}</Breadcrumb.Item>
            <Breadcrumb.Item>金额：CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>单据数：<span className="num-style">50,000笔</span></Breadcrumb.Item>
            <Breadcrumb.Item>金额：USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>单据数：<span className="num-style">100笔</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={columns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   rowSelection={rowSelection}
                   title={()=>{return tableTitle}}
                   scroll={{x: true, y: false}}
                   bordered
                   size="middle"/>
          </div>
        );
      case 'Payment':
        const paymentTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Payment"})}</Breadcrumb.Item>
            <Breadcrumb.Item>CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={columns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   title={()=>{return paymentTitle}}
                   bordered
                   size="middle"/>
          </div>
        );
      case 'Fail':
        const failTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Fail"})}</Breadcrumb.Item>
            <Breadcrumb.Item>CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={columns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   title={()=>{return failTitle}}
                   bordered
                   size="middle"/>
          </div>
        );
      case 'Success':
        const successTitle = (
          <Breadcrumb separator="|">
            <Breadcrumb.Item>{this.props.intl.formatMessage({id:"payWorkbench.Success"})}</Breadcrumb.Item>
            <Breadcrumb.Item>CNY <span className="num-style">250,000.00</span></Breadcrumb.Item>
            <Breadcrumb.Item>USD <span className="num-style">250,000.00</span></Breadcrumb.Item>
          </Breadcrumb>
        );
        return (
          <div className="pay-online-unpaid">
            <Table rowKey="id"
                   columns={columns}
                   dataSource={data}
                   pagination={pagination}
                   loading={loading}
                   title={()=>{return successTitle}}
                   bordered
                   size="middle"/>
          </div>
        );
    }
  };

  //列表选择更改
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择一行
  //选择逻辑：每一项设置selected属性，如果为true则为选中
  //同时维护selectedEntityOIDs列表，记录已选择的OID，并每次分页、选择的时候根据该列表来刷新选择项
  onSelectRow = (record, selected) => {
    let temp = this.state.selectedEntityOIDs;
    let entities = this.state.selectedEntity;
    if(selected) {
      temp.push(record.id);
      entities.push(record);
    } else {
      temp.delete(record.id);
      entities.delete(record);
    }
    this.setState({
      selectedEntityOIDs: temp,
      payOnline: temp.length>0 ? false : true,
    },()=>{
      let isCurrencySame = true;
      let amount = 0;
      entities.forEach((entity, index)=>{
        amount += entity.amount;
        if (index < entities.length-1 && entity.currency != entities[index+1].currency) {
          isCurrencySame = false;
          this.setState({
            payNoticeWarning: '',
            payNoticeError: temp.length>0 ? <span>已选择 <span style={{fontWeight:'bold',color:'#108EE9'}}>{temp.length}</span> 项<span className="ant-divider" />不同币种不可同时支付</span> : ''
          })
        }
      })
      if (isCurrencySame) {
        this.setState({
          payNoticeWarning: temp.length>0 ? <span>已选择 <span style={{fontWeight:'bold',color:'#108EE9'}}>{temp.length}</span> 项<span className="ant-divider" />本次支付金额总计：CNY <span style={{fontWeight:'bold',fontSize:'15px'}}>{amount}</span></span> : '',
          payNoticeError: ''
        })
      }
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
      payOnline: temp.length>0 ? false : true
    })
  };

  render(){
    const { formatMessage } = this.props.intl;
    const { searchForm, nowStatus, payNoticeWarning, payNoticeError, payOnline } = this.state;
    let payButton;
    switch(nowStatus) {
      case 'Unpaid':
        payButton = <Button type="primary" style={{margin:"30px auto 10px"}} disabled={payOnline}>{this.props.intl.formatMessage({id:"payWorkbench.payOnline"})}</Button>;
        break;
      case 'Payment':
        payButton = <Alert message={formatMessage({id:"payWorkbench.Payment.Message"})} type="info" showIcon style={{margin:"30px auto 10px"}}/>;
        break;
      case 'Fail':
        payButton = (
          <div style={{margin:"30px auto 10px"}}>
            <Button type="primary" style={{marginRight:"10px"}} disabled>{this.props.intl.formatMessage({id:"payWorkbench.RePay"})}</Button>
            <Button type="primary" disabled>{this.props.intl.formatMessage({id:"payWorkbench.CancelPay"})}</Button>
          </div>
        );
        break;
      case 'Success':
        payButton = <Alert message={formatMessage({id:"payWorkbench.Success.Message"})} type="info" showIcon style={{margin:"30px auto 10px"}}/>;
        break;
    }
    return (
      <div className="pay-online">
        <SearchArea
          searchForm={searchForm}
          submitHandle={this.search}
          clearHandle={this.clear}
          eventHandle={this.searchEventHandle}/>
        {payButton}
        {payNoticeWarning ? <Alert className="pay-notice-warning" message={payNoticeWarning} type="info" showIcon style={{marginBottom:'10px'}}/> : ''}
        {payNoticeError ? <Alert message={payNoticeError} type="error" showIcon style={{marginBottom:'10px'}}/> : ''}
        <Tabs onChange={this.onChangeTabs} type="card">
          {this.renderTabs()}
        </Tabs>
        {this.renderContent()}
      </div>
    )
  }

}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PayOnline));
