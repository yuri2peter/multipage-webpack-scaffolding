require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { loadPageConfig, webpackConfigTemplate } = require('./common');

let webpackConfig = {
  ...webpackConfigTemplate,
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:7].css',
    }),
    new CleanWebpackPlugin(
      ['docs/*'], // 匹配删除的文件
      {
        root: __dirname, // 根目录
        verbose: true, // 开启在控制台输出信息
        dry: false, // 启用删除文件
      }
    ),
  ],
  // 起本地服务
  devServer: {
    contentBase: './docs/',
    historyApiFallback: true,
    inline: true,
    hot: true,
    host: '127.0.0.1',
  },
};

loadPageConfig(webpackConfig);

module.exports = webpackConfig;
