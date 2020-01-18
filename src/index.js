'use strict';

import EFMarkdown from './efmarkdown.js';
require('domready')(function () {
  let stylelink = document.createElement('link');
  stylelink.rel = 'stylesheet';
  stylelink.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css';
  document.head.appendChild(stylelink);  
})

//module.exports = EFMarkdown; 

export function render(text) {
  //return `Hello ${text}`;
  return  EFMarkdown(text);
}

export function renderElement(el) {
  el.innerHTML = EFMarkdown(el.innerHTML);
};

//export default EFMarkdown;
