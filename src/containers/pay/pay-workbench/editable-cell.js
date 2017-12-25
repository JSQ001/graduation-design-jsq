import React from 'react'
import { injectIntl } from 'react-intl';
import config from 'config'
import httpFetch from 'share/httpFetch'
import { Form, InputNumber, Icon, Tooltip, Select, Spin, Popover, Timeline } from 'antd'
const Option = Select.Option;

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      modifyValue: null,
      editable: false,
      accountOptions: [],
      fetching: false,
      historyContent: null,
      historyLoading: false
    }
  }

  componentWillMount() {
    this.setState({ value: this.props.value })
  }

  //确认修改
  check = (e) => {
    e.stopPropagation();
    this.props.onChange(this.state.value);
    setTimeout(() => {
      !this.props.onChangeError && this.setState({ editable: false, modifyValue: this.state.value })
    })
  };

  //取消修改
  cancel = (e) => {
    e.stopPropagation();
    this.setState({
      editable: false,
      value: this.state.modifyValue || this.props.value
    })
  };

  //获取收款账号
  getAccountOptions = () => {

  };

  //显示支付历史
  payHistory = (visible) => {
    if (visible) {
      let url = `${config.contractUrl}/payment/api/cash/transaction/details/getHistoryByDateId?id=${this.props.id}`;
      this.setState({ historyLoading: true });
      httpFetch.get(url).then(res => {
        if (res.status === 200) {
          let historyContent;
          if (res.data.length) {
            historyContent = (
              <Timeline>
                {res.data.map(item => {
                  return (
                    <Timeline.Item key={item.id} color="green">
                      <span style={{fontSize:13,color:'rgba(0,0,0,0.55)',marginRight:5}}>2016-09-17  08:50:08</span>
                      11098 卡卡 支付 CNY 23，000.00
                    </Timeline.Item>
                  )
                })}
              </Timeline>
            )
          } else {
            historyContent = null
          }
          this.setState({ historyContent, historyLoading: false })
        }
      })
    }
  };

  render() {
    const { type, message } = this.props;
    const { value, editable, modifyValue, accountOptions, fetching, historyContent, historyLoading } = this.state;
    let history = (
      <Spin spinning={historyLoading}>
        {historyContent || '无支付历史'}
      </Spin>
    );
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              {
                type === 'number' ?
                  <InputNumber value={value}
                               onChange={(value) => this.setState({ value })}/>
                  :
                  <Select defaultValue={value}
                          notFoundContent={fetching ? <Spin size="small" /> : '无匹配结果'}
                          onChange={(value) => this.setState({ value })}
                          onFocus={this.getAccountOptions}>
                    {accountOptions.map(option => {
                      return <Option key={option.value}>{option.label}</Option>
                    })}
                  </Select>
              }
              <Tooltip placement="top" title="保存">
                <Icon type="check" className="editable-cell-icon-check" onClick={this.check}/>
              </Tooltip>
              <Tooltip placement="top" title="取消">
                <Icon type="close" className="editable-cell-icon-cancel" onClick={this.cancel}/>
              </Tooltip>
            </div>
            :
            (
              type === 'number'? (
                <Popover content={history} onVisibleChange={this.payHistory}>
                  <a className="editable-cell-text-wrapper" style={{textAlign:'right'}}>
                    {modifyValue && modifyValue < this.props.value &&
                    <Tooltip title="本次支付金额不等于可支付金额"><Icon type="exclamation-circle-o" style={{color:'red',marginRight:5}} /></Tooltip>}
                    {(value || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    <Tooltip placement="top" title={message}>
                      <Icon type="edit" className="editable-cell-icon" onClick={(e) => {e.stopPropagation();this.setState({ editable: true })}} />
                    </Tooltip>
                  </a>
                </Popover>
              ) : (
                <a className="editable-cell-text-wrapper" style={{textAlign:'left'}}>
                  {value}
                  <Tooltip placement="top" title={message}>
                    <Icon type="edit" className="editable-cell-icon" onClick={(e) => {e.stopPropagation();this.setState({ editable: true })}} />
                  </Tooltip>
                </a>
              )
            )
        }
      </div>
    );
  }
}

EditableCell.propTypes = {
  type: React.PropTypes.string,          //修改数据的类型，为 number、string
  id: React.PropTypes.string,            //该行的ID
  value: React.PropTypes.any.isRequired, //默认值
  message: React.PropTypes.string,       //点击修改时的提示信息
  record: React.PropTypes.object,        //行信息
  onChange: React.PropTypes.func,        //确认修改时的回调
  onChangeError: React.PropTypes.bool    //确认修改时的回调后是否出错
};

EditableCell.defaultProps={
  type: 'string',
  message: '点击修改',
  record: {},
  onChange: () => {},
  onChangeError: false
};

const WrappedEditableCell= Form.create()(injectIntl(EditableCell));

export default WrappedEditableCell;
