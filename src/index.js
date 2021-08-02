'use strict';

import * as efmarkdown from './efmarkdown.js';
require('domready')(function () {
  //let stylelink = document.createElement('link');
  //stylelink.rel = 'stylesheet';
  //stylelink.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css';
  //document.head.appendChild(stylelink);  

  document.querySelectorAll('table[markdown] td').forEach((el) => { el.innerHTML = efmarkdown.renderInline(el.innerHTML)});
})

console.log('efmarkdown in the index', efmarkdown);

export default efmarkdown;

export function render(text) {
    return efmarkdown.render;
}

export function renderInline(text) {
    return efmarkdown.renderInline(text);
}

export function renderElement(el) {
    return efmarkdown.renderElement(el);
}

export function addContainer(name, options) {
    return efmarkdown.addContainer(name, options);
}

export function addContainers(containers) {
    return efmarkdown.addContainers(containers);
}

export function renderString(text) {
    return efmarkdown.renderString(text);
}


