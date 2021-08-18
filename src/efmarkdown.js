'use strict';

import debug from './utils/debug';

import mc from 'markdown-it-container';

let mdconfig = { 
    html: true,
    xhtmlOut: true,
    langPrefix: 'lang-',
    typographer: false
};

    /*if (hljs) {
        //var hljs = options.hljs;
        mdconfig['highlight'] = function(str, lang) {
            //console.log('code highlight', str, lang, hljs);
            if (lang && hljs.getLanguage(lang)) {
                try {

                    return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
                } catch (__) {}
            }
            return '';
        }
    }*/
import MarkdownBlockquoteCite from 'markdown-it-blockquote-cite';

const md = require('markdown-it')(mdconfig)
    //.use(require('markdown-it-anchor'))
    //.use(require('markdown-it-decorate'))
    .use(require('markdown-it-deflist'))
    .use(require('markdown-it-multimd-table'), {
      headerless: true
    })
    .use(require('markdown-it-task-lists'))
    .use(require('markdown-it-sup'))
    .use(require('markdown-it-kbd'))
    .use(require('markdown-it-sub'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-attrs'))
    .use(require('./rules_block/samp_fence'))
    .use(require('./rules_block/notices'))
    .use(MarkdownBlockquoteCite, { attributionPrefix: '--' })
    //.use(require('./katex'))
    .use(require('./markdown-it-var'));
    /*use(require('@geekeren/markdown-it-implicit-figures'), {
      figcaption: true,
      tabindex: true
    })*/

  //import embedServices from  './embed-services.js';
  //import embedPlugin from './markdown-it-embed';

  //debug.log('embedServices', embedServices);
  //md.use(embedPlugin, { services: embedServices })
  
const containers  = require('./markdown-containers.js');
//console.log('containers', containers)
containers.default.forEach( (container) => md.use(mc, container.name, container));

export function renderString (rawContent) {
    var lines = rawContent.split('\n')
    var whitespace = null;
    var content = null;
    var i = 0
    while (content === null && i < lines.length) {
	if (lines[i].length > 0) {
	    whitespace = lines[i].match(/^(\s*)([^\s]+)/);
	    if (whitespace !== null && whitespace[2].length > 0) {
		content = whitespace[2];
		//console.log('found whitespace at line ', i, whitespace);
	    }
	}
	i++
    }
    // strip off same whitespace from all lines
    if (whitespace !== null) {
        rawContent = lines.reduce(function (acc, line) {
	    acc += line.replace(whitespace[1], '') + '\n'
	    return acc
	}, '')
	//console.log('stripping whitespace', whitespace, rawContent);
    }
    return md.render(rawContent)
};

export function splitRender(rawContent) {
  let sections = rawContent.split('<!-- :break section -->');
  return sections.length > 1 ? sections.map((section,index) => `<section>${renderString(section)}</section>`).join('\n') : renderString(sections[0]);
};

export function addContainers(containers) {
    containers.forEach(function (container) {
        debug.log('adding container', container.name, mc);
        md.use(mc, container.name, container);
    });
    return md;
};

export function addContainer(name, options) {
    md.use(mc, name, options);
    return md;
};

export { renderString as render };
export function renderInline(text) {
  return md.renderInline(text);
};

export function renderElement(el) {
  el.innerHTML = renderString(el.innerHTML);
  return el;
};