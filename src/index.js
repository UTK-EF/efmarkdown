'use strict';

import { render, renderElement, renderInline } from './efmarkdown.js';
require('domready')(function () {
  let stylelink = document.createElement('link');
  stylelink.rel = 'stylesheet';
  stylelink.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css';
  document.head.appendChild(stylelink);  

  document.querySelectorAll('table[markdown="1"] td').forEach((el) => { console.log('in td', el); el.innerHTML = renderInline(el.innerHTML)});
})

//module.exports = EFMarkdown; 

export { render, renderElement };
export default { render, renderElement, renderInline };
//export default EFMarkdown;
