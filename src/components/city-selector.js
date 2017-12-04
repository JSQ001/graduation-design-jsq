/**
 * Created By jsq on 2017/12/4
 */
import React from 'react';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import httpFetch from 'share/httpFetch';
import {Cascader,Button } from 'antd'

class CitySelector extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      options:[{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [{
            value: 'xihu',
            label: 'West Lake',
          }],
        }],
      }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
          value: 'nanjing',
          label: 'Nanjing',
          children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          }],
        }],
      }],
      options1:[],
      params:{},
    };
  }

  componentWillMount(){
    console.log(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.countryCode){
      console.log(nextProps);
      httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/state?code=${nextProps.countryCode}`).then((response)=>{
        console.log(response)
        let province = [];
        response.data.map((item)=>{
          let option = {
            value: item.code,
            label: item.state,
          };
          province.push(option)
        });
        this.setState({
          options1:province
        })
      })

      this.setState({
        params: nextProps,
      });
    }
  };

  getOptions =()=>{
    let { params} = this.state;
    httpFetch.get(`http://192.168.1.77:13001/location-service/api/localization/query/state?code=${params.countryCode}`).then((response)=>{
      console.log(response)
      let province = [];
      response.data.map((item)=>{
        let option = {
          value: item.code,
          label: item.state,
        };
        province.push(option)
      });
      this.setState({
        options:province
      })
    })
  };

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    console.log(123)
    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [{
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      }];
      this.setState({
        options1: [...this.state.options1],
      });
    }, 1000);
  };

  render(){
    const { placeholder} = this.props;
    const {options} = this.state;
    return(
      <div className="city-selector">
        <Cascader
         // onFocus={this.getOptions}
          loadData={this.loadData}
          placeholder={placeholder}
          options={options}/>
      </div>)
  }
}

CitySelector.propTypes = {
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
};

CitySelector.defaultProps = {
  placeholder: "请选择",
  disabled: false,
  listExtraParams: {},
};

export default CitySelector;
