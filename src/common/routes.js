import React      from 'react';
import {
  Router,
  Route,
  browserHistory,
  IndexRedirect,
  IndexRoute }    from 'react-router';
import App        from './components/App';
import Counter    from './components/Counter';
import PizzaSVG1  from './components/PizzaSVG1';

// static
export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Counter} />
      <Route path="/pizza" component={PizzaSVG1} />
    </Route>
    <Route path="*">
      <IndexRedirect to="/" />
    </Route>
  </Router>
);

// stateless functional component
const Routes = (props) => (routes);

export default Routes;
