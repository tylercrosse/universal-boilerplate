import qs                 from 'qs';
import React              from 'react';
import { renderToString } from 'react-dom/server';
import { Provider }       from 'react-redux';
import { match,
  RouterContext }         from 'react-router';
import { routes }         from '../common/routes';
import configureStore     from '../common/store/configureStore';
import { fetchCounter }   from '../common/api/counter';

function getReactString(req, res, store) {
  return new Promise((resolve, reject) => {
    match({ routes, location: req.url }, (err, redirect, props) => {
      if (err) {
        reject();
      } else if (redirect) {
        res.redirect(302, redirect.pathname + redirect.search);
      } else if (props) {
        resolve(
          renderToString(
            <Provider store={store}>
              <RouterContext {...props} />
            </Provider>
          )
        );
      } else {
        reject();
      }
    });
  });
}

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
<html>
  <head>
    <title>Redux Universal Example</title>
    <link rel="stylesheet" href="css/main.css" />
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

async function universalReact(req, res) {
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
}

export default universalReact
