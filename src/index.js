'use strict';

const EFMarkdown = require('./efmarkdown.js');
require('domready')(function () {
  let stylelink = document.createElement('link');
  stylelink.rel = 'stylesheet';
  stylelink.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css';
  document.head.appendChild(stylelink);  
})

module.exports = EFMarkdown; 
