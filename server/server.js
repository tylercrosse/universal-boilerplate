/* eslint-disable no-console, no-use-before-define */

import path from 'path';
import express from 'express';
import qs from 'qs';
import fs from 'fs';

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configureStore'
import App from '../common/components/App'
import { fetchCounter } from '../common/api/counter'

const app = new express();
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

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
    // const template = await getTemplate();
    const ReactString = await getReactString(req, res, store);
    const finalState = store.getState()
    // const fullPage = template
    //   .replace('{{SSR}}', ReactString)
    //   .replace('"{{STATE}}"', JSON.stringify(finalState).replace(/</g, '\\x3c'));
    // res.send(fullPage);
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

function getTemplate() {
  const htmlFilePath = path.join(__dirname, 'index.html');
  return new Promise((resolve, reject) => {
    fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(htmlData);
      }
    });
  });
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
    <script src="/static/js/bundle.js"></script>
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
