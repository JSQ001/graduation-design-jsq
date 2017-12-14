'use strict';

/**
 * Dist configuration. Used to build the
 * final output when running npm run dist.
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

class WebpackDistConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      cache: false,
      devtool: 'source-map',
      entry: {
        app: ['./client.js'],
        vendor: ['react', 'react-dom' ,'immutable', 'redux', 'redux-thunk', 'antd', 'draft-js'],
      },
      plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en/),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"',
          __DEV__: false
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
          names: ['vendor']
        }),
        new UglifyJsPlugin({
          sourceMap: true
        })
      ]
    };
    // Deactivate hot-reloading if we run dist build on the dev server
    this.config.devServer.hot = false;
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'dist';
  }
}

module.exports = WebpackDistConfig;
