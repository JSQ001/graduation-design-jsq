import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import Login from 'containers/login'
import menuRoute from 'routes/menuRoute'

class AppComponent extends React.Component {
  render() {
    const routes = [].concat(menuRoute.ClientRoute).concat(<Route path="/" component={Login} />);
    return (
      <Router history={browserHistory} routes={routes}/>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
