import React  from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

class PageCreate extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){}

  render(){
    return(
      <div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(injectIntl(PageCreate));
