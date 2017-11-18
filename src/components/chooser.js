import React from 'react';
import { Select } from 'antd'

import ListSelector from 'components/list-selector'
import 'styles/components/chooser.scss'

/**
 * 列表选择表单组件，由antd的select组件改造而来,select + listSelector的自定义表单组件
 */
class Chooser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [],
      showListSelector: false,
      listSelectedData: []
    };
  }

  /**
   * value为传入值
   * @param nextProps
   */
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.value){
      let lengthChange = nextProps.value.length !== this.state.value.length;
      let innerChange = false;
      if(nextProps.value.length === this.state.value.length){
        nextProps.value.map((nextItem, index) => {
          innerChange = innerChange || this.state.value[index].key !== (nextItem[this.props.valueKey] + '');
        })
      }
      if(lengthChange || innerChange){
        let values = [];
        nextProps.value.map(item => {
          values.push({
            key: item[this.props.valueKey] + '',
            label: item[this.props.labelKey],
            value: item
          })
        });
        // this.onChange(nextProps.value);
        this.setState({ value: values });
      }
    }
    if((!nextProps.value && this.state.value.length > 0) || (nextProps.value && nextProps.value.length === 0 && this.state.value.length > 0)){
      // this.onChange([]);
      this.setState({ value: [] })
    }
  };

  /**
   * list控件因为select没有onClick事件，所以用onFocus代替
   * 每次focus后，用一个隐藏的input来取消聚焦
   */
  handleFocus = () => {
    this.refs.chooserBlur.focus();
    this.showList()
  };

  /**
   * 显示ListSelector，如果有已经选择的值则包装为ListSelector需要的默认值格式传入
   */
  showList = () => {
    let listSelectedData = [];
    if(this.state.value.length > 0){
      this.state.value.map(value => {
        listSelectedData.push(value.value)
      });
    }
    this.setState({ listSelectedData }, () => {
      this.setState({  showListSelector: true })
    })
  };

  handleListCancel = () => {
    this.setState({ showListSelector: false })
  };

  /**
   * ListSelector确认点击事件，返回的结果包装为form需要的格式
   * @param result
   */
  handleListOk = (result) => {
    let value = [];
    result.result.map(item => {
      value.push({
        key: item[this.props.valueKey],
        label: item[this.props.labelKey],
        value: item
      })
    });
    //手动调用onChange事件以与父级Form绑定
    this.onChange(result.result);
    this.setState({ showListSelector: false, value });
  };

  onChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { showListSelector, listSelectedData, value } = this.state;
    const { placeholder, disabled, selectorItem, type, listExtraParams, single, showNumber } = this.props;
    return (
      <div className={showNumber ? 'chooser number-only' : 'chooser'}>
        <Select
          value={value}
          mode="multiple"
          labelInValue
          placeholder={placeholder}
          onFocus={this.handleFocus}
          dropdownStyle={{ display: 'none' }}
          disabled={disabled}
        >
        </Select>
        <div className="chooser-number" onClick={() => { !this.props.disabled && this.showList() }}>
          已选择 {value.length} 条
        </div>
        <ListSelector visible={showListSelector}
                      type={type}
                      onCancel={this.handleListCancel}
                      onOk={this.handleListOk}
                      selectedData={listSelectedData}
                      extraParams={listExtraParams}
                      selectorItem={selectorItem}
                      single={single}/>
        <input ref="chooserBlur" style={{ position: 'absolute', top: '-100vh', zIndex: -1 }}/>
      </div>
    );
  }
}

Chooser.propTypes = {
  placeholder: React.PropTypes.string,  //输入框空白时的显示文字
  disabled: React.PropTypes.bool,  //是否可用
  type: React.PropTypes.string,  //list选择的type，参见selectorData内
  selectorItem: React.PropTypes.object,  //listSelector的selectorItem
  valueKey: React.PropTypes.string,  //表单项的id变量名
  labelKey: React.PropTypes.string,  //表单项的显示变量名
  listExtraParams: React.PropTypes.object,  //listSelector的额外参数
  onChange: React.PropTypes.func,  //进行选择后的回调
  single: React.PropTypes.bool,  //是否单选
  value: React.PropTypes.array,  //已选择的值，需要传入完整目标数组
  showNumber: React.PropTypes.bool  //是否只显示'已选XX条'
};

Chooser.defaultProps = {
  placeholder: "请选择",
  disabled: false,
  listExtraParams: {},
  single: false,
  showNumber: false
};

export default Chooser;
