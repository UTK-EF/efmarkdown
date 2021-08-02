function regexValidator (regex) {
    return function (params) {
      return params.trim().match(regex)
    }
}

function enumerator(sep = '-') {
    let names = {}
    return (name) => {
      if (typeof(names[name]) !== "undefined") {
        names[name]++;
      } else {
        names[name] = 1;
      }
      
      return name + sep + names[name];
    }
}

const enumerate = enumerator();
const slugify = require('slugify');

export const markdownContainers = [
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
                //id = enumerate(slugify(m[1], {remove: /[*+~.()'"!:@]/g}));
                id = enumerate(slugify(m[1], {remove: /\W/g}));
                //id = btoa(m[1]);
          return `<a class="heading heading-collapse collapsed" data-toggle="collapse" href="#${id}">${m[1]}</a><div class="collapse" id="${id}">\n`
        } else {
          return '</div>\n'
        }
      }
    },
    {
      name: 'box',
      validate: regexValidator(/^box\s+(?:{([^}]*)}\s+)?(.*)$/),
      render: function(tokens, idx) {
        var m = tokens[idx].info.trim().match(/^box\s+(?:{([^}]*)}\s+)?(.*)$/);
        if (m != null && m[1] != null) {
          var args = m[1].split();
          //TODO: do something with args
          console.log('box args', args);
        }
        if (tokens[idx].nesting == 1) {
          return '<div class="card"><div class="card-header">' + m[2] + '</div><div class="card-body">\n'
        } else {
          return '</div></div>\n'
        }
      }
    },
    {
      name: 'sample',
      validate: regexValidator(/^sample\s*(.*)\s*$/),
      render: function(tokens, idx) {
        var m = tokens[idx].info.trim().match(/^sample\s*(.*)\s*$/);
        if (tokens[idx].nesting == 1) {
          return '<pre class="' + m[1] + '"><samp>\n'
        } else {
          return '</samp></pre>\n'
        }
      }
    },
    {
      name: 'sample_output',
      marker: '~',
      validate: regexValidator(/^\s*(.*)\s*$/),
      render: function(tokens, idx) {
        var m = tokens[idx].info.trim().match(/^\s*(.*)\s*$/);
        if (tokens[idx].nesting == 1) {
          return '<pre class="' + m[1] + '"><samp>\n'
        } else {
          return '</samp></pre>\n'
        }
      }
    }
  ];
