import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import Login from 'containers/login'
import menuRoute from 'share/menuRoute'


class AppComponent extends React.Component {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Login} />
        {menuRoute.ClientRoute}
      </Router>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
