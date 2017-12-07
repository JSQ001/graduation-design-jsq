import React from 'react'
import { injectIntl } from 'react-intl';
import { Form, InputNumber, Icon, Tooltip, Select } from 'antd'

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      modifyValue: null,
      editable: false,
    }
  }

  componentWillMount () {
    this.setState({ value: this.props.value })
  }

  check = (e) => {
    e.stopPropagation();
    this.props.onChange(this.state.value);
    setTimeout(() => {
      !this.props.onChangeError && this.setState({ editable: false, modifyValue: this.state.value })
    })
  };

  cancel = (e) => {
    e.stopPropagation();
    this.setState({
      editable: false,
      value: this.state.modifyValue || this.props.value
    })
  };

  render() {
    const { type, message } = this.props;
    const { value, editable, modifyValue } = this.state;
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
                          onChange={(value) => this.setState({ value })}>
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
            <div className="editable-cell-text-wrapper" style={{textAlign: type === 'number' ? 'right' : 'left'}}>
              {type === 'number' && modifyValue && modifyValue < this.props.value &&
                <Tooltip title="本次支付金额不等于可支付金额"><Icon type="exclamation-circle-o" style={{color:'red',marginRight:5}} /></Tooltip>}
              {type === 'number' ? (value || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : (value || '')}
              <Tooltip placement="top" title={message}>
                <Icon type="edit" className="editable-cell-icon" onClick={(e) => {e.stopPropagation();this.setState({ editable: true })}} />
              </Tooltip>
            </div>
        }
      </div>
    );
  }
}

EditableCell.propTypes = {
  type: React.PropTypes.string,          //修改数据的类型，为 number、string
  value: React.PropTypes.any.isRequired, //默认值
  message: React.PropTypes.string,       //点击修改时的提示信息
  onChange: React.PropTypes.func,        //确认修改时的回调
  onChangeError: React.PropTypes.bool    //确认修改时的回调后是否出错
};

EditableCell.defaultProps={
  type: 'string',
  message: '点击修改',
  onChange: () => {},
  onChangeError: false
};

const WrappedEditableCell= Form.create()(injectIntl(EditableCell));

export default WrappedEditableCell;
