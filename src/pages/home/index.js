import readme from '../../../README.md';
require('./index.less');
require('github-markdown-css');

const md = require('markdown-it')();
const html = md.render(readme);
document.getElementById('readme').innerHTML = html;
