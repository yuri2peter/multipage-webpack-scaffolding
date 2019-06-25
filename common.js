const pageConfig = require('./page.config.js');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pathDist = path.join(__dirname, './docs');
const pathSrc = path.join(__dirname, './src');

module.exports = {
  loadPageConfig: function loadPageConfig (webpackConfig) {
    if (pageConfig && Array.isArray(pageConfig)) {
      pageConfig.map(page => {
        const fileHtml = `${pathSrc}/pages/${page.path}/index.html`;
        const fileEjs = `${pathSrc}/pages/${page.path}/index.ejs`;
        const template = fs.existsSync(fileEjs) ? fileEjs : fileHtml;
        webpackConfig.entry[page.name] = `${pathSrc}/pages/${page.path}/index.js`;
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
          filename: `${pathDist}/${page.name}.html`,
          template,
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
      path: `${pathDist}/`,
      filename: 'static/js/[name].[hash:7].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [pathSrc],
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
        },
        // html|ejs with img
        {
          test: /\.(html|ejs)$/,
          loader: 'html-withimg-loader',
          include: [pathSrc],
          options: {
            limit: 10000,
            name: 'static/img/[name].[hash:7].[ext]',
          },
        },
        // html|ejs complied
        {
          test: /\.(html|ejs)$/,
          loader: 'ejs-html-loader',
          include: [pathSrc],
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [pathSrc],
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
          test: /\.s[ac]ss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
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
