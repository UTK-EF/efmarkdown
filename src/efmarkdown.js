'use strict';

const slugify = require('slugify');
const md = require('markdown-it')();

import hljs from 'highlight.js/lib/highlight';
import matlab from 'highlight.js/lib/languages/matlab';
hljs.registerLanguage('matlab', matlab);

import mc from 'markdown-it-container';

const markdownContainers = [
  {
    name: 'section',
    validate: regexValidator(/^section\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^section\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return '<section><h1>' + m[1] + '</h1><div class="content">\n'
      } else {
        return '</div>\n</section>\n'
      }
    }
  },
  {
    name: 'aside',
    validate: regexValidator(/^aside\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^aside\s+(.*)$/)
      if (tokens[idx].nesting == 1) {
        return '<aside><h1>' + m[1] + '</h1><div class="content">\n'
      } else {
        return '</div>\n</aside>\n'
      }
    }
  },
  {
    name: 'collapse',
    validate: regexValidator(/^collapse\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^collapse\s+(.*)$/)
      if (tokens[idx].nesting == 1) {
        const title = m[1],
              id = slugify(m[1]);
        return `<a class="heading heading-collapse collapsed" data-toggle="collapse" href="#${id}">${m[1]}</a><div class="collapse" id="${id}">\n`
      } else {
        return '</div>\n'
      }
    }
  }
]

md.configure('default').set({ html: true,
			      xhtmlOut: true,
			      langPrefix: 'lang-',
			      highlight: function(str, lang) {
				  if (lang && hljs.getLanguage(lang)) {
				      try {
					  return hljs.highlight(lang, str).value;
				      } catch (__) {}
				  }
				  return '';
			      }
			    })

markdownContainers.reduce(function (acc, current) {
  md.use(mc, current.name, current)
  return md
}, md)


md//.use(require('markdown-it-anchor'))
  .use(require('markdown-it-decorate'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-katex'), { throwOnError: false, errorColor: '#cc0000' })
  .use(require('@geekeren/markdown-it-implicit-figures'), {
    figcaption: true,
    tabindex: true
  })


function regexValidator (regex) {
  return function (params) {
    return params.trim().match(regex)
  }
}

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
}

export default renderString;
