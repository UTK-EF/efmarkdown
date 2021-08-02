'use strict';

const md = require('markdown-it')();

//import hljs from 'highlight.js';
const hljs = require('highlight.js/lib/core');
import matlab from 'highlight.js/lib/languages/matlab';
import excel from 'highlight.js/lib/languages/excel';
hljs.registerLanguage('matlab', matlab);
hljs.registerLanguage('excel', excel);

import mc from 'markdown-it-container';

const embedServices = {
  'video': {
    render: (videoID, url, options) => {
      console.log('video embed render', videoID, url, options);
      return `<div class="html5-video" data-file="${videoID}"></div>`;
    }
  },
    'link': {
	render: (linkID, url, options) => {
	    return `<a href="#" class="ef-link" data-link-id="${linkID}"></a>`
	}
  }
};

let mdconfig = { html: true,
			      xhtmlOut: true,
			      langPrefix: 'lang-',
			   };

if (hljs) {
  mdconfig['highlight'] = function(str, lang) {
	if (lang && hljs.getLanguage(lang)) {
	  try {
		return hljs.highlight(str, {"language": lang}).value;
	  } catch (__) {}
	}
	return '';
  }
}

md.configure('default').set(mdconfig)

md//.use(require('markdown-it-anchor'))
  .use(require('markdown-it-decorate'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-multimd-table'), {
    headerless: true
  })
  .use(require('markdown-it-task-lists'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-kbd'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-footnote'))
  .use(require('./markdown-it-embed'), { services: embedServices })
  .use(require('markdown-it-abbr'))
  .use(require('@geekeren/markdown-it-implicit-figures'), {
    figcaption: true,
    tabindex: true
  })

const { markdownContainers } = require('./markdown-containers.js');
markdownContainers.forEach( (container) => md.use(mc, container.name, container));

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
        console.log('adding container', container.name, mc);
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



//export default { render: renderString, /*splitRender,*/ renderElement, addContainer, renderInline: md.renderInline, use: md.use};
