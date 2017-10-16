/**
 * Created by zaranengap on 2017/7/4.
 */
import React from 'react'
import { connect } from 'react-redux'

class DashboardAdmin extends React.Component{

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        集团模式DashBoard
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(DashboardAdmin);
