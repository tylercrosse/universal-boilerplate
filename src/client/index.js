import React          from 'react';
import { render }     from 'react-dom';
import { Provider }   from 'react-redux';
import Routes         from '../common/routes';
import configureStore from '../common/store/configureStore';
import                     './main.scss';

const preloadedState = window.__PRELOADED_STATE__
const store = configureStore(preloadedState)
const rootElement = document.getElementById('app')

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  rootElement
)
