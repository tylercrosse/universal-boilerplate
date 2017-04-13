/* eslint-disable no-console, no-use-before-define */
import path           from 'path';
import express        from 'express';
import compression    from 'compression';
import universalReact from './universalReactCtlr';

const app = new express();
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
// could easily break this out to separate file
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../webpack.config.js');

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
} else {
  app.use(compression());
}

// serve static files
app.use(express.static('static'));

// This is fired every time the server side receives a request
app.get('/*', universalReact);

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
