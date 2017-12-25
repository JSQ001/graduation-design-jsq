import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
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
        key: 'page-create',
        hash: '33za1r8an66e59ng7ap69m9567'
      },
      layout: {
        width: '100%',
        gutter: 40,
        justify: 'start',
        align: 'top',
        span: 24,
        labelCol: { span: 6 },
        wrapperCol: { span: 10 }
      },
      forms: [
        { id: 'test1', type: 'input', label: '测试1' },
        { id: 'test2', type: 'select', label: '测试2' , defaultValue: '3',
          options: [{label: '数据1', key: 1},{label: '数据2', key: 2},{label: '数据3', key: 3}]},
        { id: 'test3', type: 'select', label: '测试3', defaultValue: {label: '默认帐套', key: '3'},
          getUrl: `${config.baseUrl}/api/setOfBooks/by/tenant`, method: 'get',
          labelKey: 'setOfBooksCode', labelRule: '${setOfBooksCode} - (${setOfBooksName})',valueKey: 'id', getParams: {roleType: 'TENANT'} },
        { id: 'testItems', type: 'items', items: [
          { id: 'test4', type: 'input', label: '测试4' },
          { id: 'test5', type: 'select', label: '测试5', defaultValue: {label: '数据3', key: 3},
            options: [] },
        ] },
      ],
      buttons: {

      }
    };
    return(
      <div>
        <Generator json={JSON.stringify(json)}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PageCreate));
