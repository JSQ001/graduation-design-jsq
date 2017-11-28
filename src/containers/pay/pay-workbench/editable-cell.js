import React from 'react'
import { injectIntl } from 'react-intl';
import { Form, Input, InputNumber, Icon, Tooltip } from 'antd'

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      editable: false,
    }
  }

  componentWillMount () {
    this.setState({ value: this.props.value })
  }

  check = () => {
    this.props.onChange(this.state.value)
  };

  render() {
    const { maxValue, type, message } = this.props;
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              {
                type === 'number' ?
                  <InputNumber value={value}
                               max={maxValue ? maxValue : Infinity}
                               min={0}
                               onChange={(value) => this.setState({ value })}
                               onPressEnter={this.check}/>
                  :
                  <Input value={value}
                         style={{width:125}}
                         onChange={(e) => this.setState({ value: e.target.value })}
                         onPressEnter={this.check}/>
              }
              <Tooltip placement="top" title="保存">
                <Icon type="check" className="editable-cell-icon-check" onClick={this.check}/>
              </Tooltip>
              <Tooltip placement="top" title="取消">
                <Icon type="close" className="editable-cell-icon-cancel" onClick={() => this.setState({ editable: false })}/>
              </Tooltip>
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {type === 'number' ? (value || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : (value || '')}
              <Tooltip placement="top" title={message}>
                <Icon type="edit" className="editable-cell-icon" onClick={() => this.setState({ editable: true })} />
              </Tooltip>
            </div>
        }
      </div>
    );
  }
}

EditableCell.propTypes = {
  type: React.PropTypes.string,        //修改数据的类型，为 number、string
  value: React.PropTypes.any,          //默认值
  message: React.PropTypes.string,     //点击修改时的提示信息
  maxValue: React.PropTypes.number,    //若type为number，可设置的最大值
  onChange: React.PropTypes.func,      //确认修改时的回调
  onChangeError: React.PropTypes.bool  //确认修改时的回调后是否出错
};

EditableCell.defaultProps={
  type: 'string',
  stringValue: '',
  numberValue: 0,
  message: '点击修改',
  onChange: () => {},
  onChangeError: false
};

const WrappedEditableCell= Form.create()(injectIntl(EditableCell));

export default WrappedEditableCell;
