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
const entryPath = './src/client/index.js';
const outputPath = path.join(__dirname, 'static/js/');
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
    publicPath: '/js/'
  },
  module: {}
};

webpackConfig.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
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
  webpackConfig.entry.app = [
    entryPath
  ];
  webpackConfig.plugins.push(
    new CleanPlugin([outputPath], {verbose: true}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
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
  webpackConfig.entry.app = [
    'webpack-hot-middleware/client',
    entryPath
  ];
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  );
}


module.exports = webpackConfig;
