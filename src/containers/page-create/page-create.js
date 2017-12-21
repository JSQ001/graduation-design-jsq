import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import Generator from 'components/generator'

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
        { id: 'test2', type: 'input', label: '测试2' },
        { id: 'test3', type: 'input', label: '测试3' },
      ]
    };
    return(
      <div>
        <Generator json={json}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PageCreate));
