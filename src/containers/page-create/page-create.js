import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { Alert } from 'antd'
import Generator from 'components/generator'

import config from 'config'

class PageCreate extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){}

  render(){
    const json = {
      security: {
        title: '测试表单',
        key: 'page-create',
        hash: '33za1r8an66e59ng7ap69m9567'
      },
      layout: {
        width: '80%',
        gutter: 40,
        justify: 'start',
        align: 'top',
        span: 24,
        // labelCol: { span: 6 },
        // wrapperCol: { span: 10, offset: 1 },
        buttons: 'center',
        buttonsMargin: 10
      },
      forms: [
        { id: 'test0', type: 'plain', label: '测试0', defaultValue: '静态文本' },
        { id: 'test1', type: 'input', label: '测试1', isRequired: true },
        { id: 'test2', type: 'select', label: '测试2' , defaultValue: '3',
          options: [{label: '数据1', value: 1}, {label: '数据2', value: 2}, {label: '数据3', value: 3}] },
        { id: 'test3', type: 'select', label: '测试3', defaultValue: {label: 'DEFAULT_SOB - (默认账套)', value: '933328216846123009'},
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get',
          labelKey: 'setOfBooksCode', labelRule: '${setOfBooksCode} - (${setOfBooksName})',valueKey: 'id', getParams: {roleType: 'TENANT'} },
        { id: 'testItems', type: 'items', items: [
          { id: 'test4', type: 'input', label: '测试4' },
          { id: 'test5', type: 'select', label: '测试5', defaultValue: {label: '数据3', value: 3} }]
        },
        { id: 'test6', type: 'date', label: '测试6' },
        { id: 'test7', type: 'radio', label: '测试7', defaultValue: 1,
          options: [{label: '数据1', value: 1}, {label: '数据2', value: 2}, {label: '数据3', value: 3}] },
        { id: 'test8', type: 'checkbox', label: '测试8', defaultValue: [1, 3],
          options: [{label: '数据1', value: 1}, {label: '数据2', value: 2}, {label: '数据3', value: 3}] },
        { id: 'test9', type: 'switch', label: '测试9' },
        { id: 'test10', type: 'list', label: '测试10', listType: 'bank_account',
          labelKey: 'bankName', valueKey: 'bankName', isRequired: true },
      ],
      buttons: [
        { id: 'submit', type: 'submit', text: '提交', surface: 'primary' },
        { id: 'clear', type: 'clear', text: '清除', target: ['test1', 'test2', 'test3']},
        { id: 'set', type: 'set', text: '设置', surface: 'danger', target: [] }
      ]
    };
    return(
      <div>
        <Generator json={JSON.stringify(json)}/>
        <br/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PageCreate));
