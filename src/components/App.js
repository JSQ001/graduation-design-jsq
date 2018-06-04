import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import Login from 'containers/login'
import menuRoute from 'routes/menuRoute'
import TestPage from 'containers/user-center/test-page'

class AppComponent extends React.Component {
  render() {
    const routes = [].concat(menuRoute.ClientRoute).concat(<Route path="/" component={Login} />)
      .concat(<Route path="/main/test-page/:id" components={TestPage}/>);
    return (
      <Router history={browserHistory} routes={routes}/>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
