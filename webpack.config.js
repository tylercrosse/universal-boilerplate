const path              = require('path');
const webpack           = require('webpack');
const CleanPlugin       = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProd = (process.env.NODE_ENV === 'production');
const vendors = [
  'react',
  'react-dom',
  'redux',
  'redux-thunk'
];
const entryPath = './src/client/index.js';
const outputPath = path.join(__dirname, 'static/');
// ------------------------------------
// Base Config
// ------------------------------------
const webpackConfig = {
  entry: {
    vendor: vendors
  },
  output: {
    path: outputPath,
    filename: 'js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  module: {}
};

webpackConfig.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'js/vendor.js',
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

const sharedSassLoaders = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: {
      plugins() {
        return [
          require('autoprefixer')({
            add: true,
            remove: true,
            browsers: ['last 2 versions']
          })
        ]
      }
    }
  },
  // { loader: 'resolve-url-loader' }, // @fontface
  {
    loader: 'sass-loader',
    options: {sourceMap: true}
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
    new CleanPlugin([
      'static/js',
      'static/css'
    ], {verbose: true}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("css/main.css")
  );
  webpackConfig.module.loaders.push(
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          ...sharedSassLoaders
        ]
      })
    }
  );
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
  webpackConfig.module.loaders.push(
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' },
        ...sharedSassLoaders
      ]
    }
  )
}


module.exports = webpackConfig;
