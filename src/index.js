'use strict';

import * as efmarkdown from './efmarkdown.js';
import debug from './utils/debug.js';
import fetchContent from './utils/fetch-content.js';

import hljs from 'hljs';
require('highlightjs-line-numbers.js');

//import katek from 'katex';
//const renderMathInElement = require('katex/contrib/auto-render/auto-render.js');
//import renderMathInElement from 'katex/contrib/auto-render/auto-render.js';
//import renderMathInElement from 'renderMathInElement';
//const renderMathInElement = window.renderMathInElement;

//console.log('renderMathInElement', renderMathInElement);

debug.log('fetchContent', fetchContent);
debug.log('NODE_ENV', process.env.NODE_ENV);

const services = [
    {
        selector: '.page-inject',
        invoke: function(el) {
            var url = el.getAttribute('data-href');
            debug.log('element for page inject', el);
            fetchContent(url).then(content => {
                debug.log('element getting content', el);
                el.innerHTML = content;
            });
        }
    }
];

const renderMarkdownInElements = function(elements) {
    if (window && window.renderMathInElement) {
        window.renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError : false
        });  
    }
    
    elements.forEach(function(el) {
        efmarkdown.renderElement(el);
    });

    if (hljs) {
        console.log('applying highlightjs')
        document.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el);
    
            if (!el.classList.contains('nohljsln')) {
                hljs.lineNumbersBlock(el);
            }
        });    
    }

    /*
    services.forEach((service) => {
        var els = document.querySelectorAll(service.selector);
        els.forEach(el => {
            service.invoke(el);
        });
    });*/

}

export default renderMarkdownInElements;

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

