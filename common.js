const pageConfig = require('./page.config.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  loadPageConfig: function loadPageConfig (webpackConfig) {
    if (pageConfig && Array.isArray(pageConfig)) {
      pageConfig.map(page => {
        webpackConfig.entry[page.name] = `./src/pages/${page.path}/index.js`;
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
          filename: path.join(__dirname, `./dist/${page.name}.html`),
          template: path.join(__dirname, `./src/pages/${page.path}/index.html`),
          inject: true,
          chunks: [page.name],
          inlineSource: '.(js|css)$',
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          chunksSortMode: 'dependency',
        }));
      });
    }
  },
  webpackConfigTemplate: {
    mode: 'none',
    entry: {},
    output: {
      path: path.join(__dirname, './dist/'),
      filename: 'static/js/[name].[hash:7].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [path.join(__dirname, './src')],
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
        },
        // html中的img标签
        {
          test: /\.html$/,
          loader: 'html-withimg-loader',
          include: [path.join(__dirname, './src')],
          options: {
            limit: 10000,
            name: 'static/img/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [path.join(__dirname, './src')],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/img/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/fonts/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader'],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'less-loader'],
          }),
        },
        {
          test: /\.(md)(\?.*)?$/,
          use: 'raw-loader',
        },
      ],
    },
  },
};
