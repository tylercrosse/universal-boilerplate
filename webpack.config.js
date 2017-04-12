const path        = require('path');
const webpack     = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

const isProd = (process.env.NODE_ENV === 'production');
const vendors = [
  'react',
  'react-dom',
  'redux',
  'redux-thunk'
];
const entryPath = './client/index.js';
const outputPath = path.join(__dirname, 'static/js');
// ------------------------------------
// Base Config
// ------------------------------------
const webpackConfig = {
  entry: {
    vendor: vendors
  },
  output: {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/static/'
  },
  module: {}
};

webpackConfig.plugins = [
  new CleanPlugin([outputPath], {verbose: true}),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
    minChunks: Infinity
  })
];
webpackConfig.module.loaders = [
  {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    include: __dirname,
    query: {
      presets: [ 'react-hmre' ]
    }
  }
];

// ------------------------------------
// Env Specfic config
// ------------------------------------
if (isProd) {
  webpackConfig.devtool = 'cheap-module-source-map';
  webpackConfig.entry.application = [
    entryPath
  ];
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}
// dev
else {
  webpackConfig.devtool = 'source-map';
  webpackConfig.entry.application = [
    'webpack-hot-middleware/client',
    entryPath
  ];
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}


module.exports = webpackConfig;
