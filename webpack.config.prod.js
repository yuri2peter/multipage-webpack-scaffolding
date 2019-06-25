require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { loadPageConfig, webpackConfigTemplate } = require('./common');

let webpackConfig = {
  ...webpackConfigTemplate,
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true,
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:7].css',
    }),
    // 每一次build之前先删除dist
    new CleanWebpackPlugin(
      ['docs/*'], // 匹配删除的文件
      {
        a: {},
        root: __dirname, // 根目录
        verbose: true, // 开启在控制台输出信息
        dry: false, // 启用删除文件
      },
    ),
  ],
};
loadPageConfig(webpackConfig);
module.exports = webpackConfig;
