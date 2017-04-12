/* eslint-disable no-console, no-use-before-define */
import path from 'path';
import express from 'express';
import qs from 'qs';
import fs from 'fs';

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configureStore'
import App from '../common/components/App'
import { fetchCounter } from '../common/api/counter'

const app = new express();
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../webpackConfig');

  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }))
  app.use(webpackHotMiddleware(compiler))
}

// serve static files
app.use(express.static('static'));

// This is fired every time the server side receives a request
app.get('/*', async (req, res) => {
  try {
    const apiResult = await fetchCounter();
    const params = qs.parse(req.query)
    const counter = parseInt(params.counter, 10) || apiResult || 0
    const preloadedState = { counter }
    const store = configureStore(preloadedState);
    const ReactString = await getReactString(req, res, store);
    const finalState = store.getState()
    res.send(renderFullPage(ReactString, finalState));
  } catch (err) {
    console.log(err);
    res.send('Error');
  }
})

function getReactString(req, res, store) {
  return new Promise((resolve, reject) => {
    // expand with router stuff
    resolve(
      renderToString(
        <Provider store={store}>
          <App />
        </Provider>
      )
    );
  })
}

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
<html>
  <head>
    <title>Redux Universal Example</title>
  </head>
  <body>
    <h1>Pizza!</h1>
    <div id="app">${html}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
    </script>
    <script src="js/vendor.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>`
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
