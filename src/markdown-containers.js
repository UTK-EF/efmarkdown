import debug from "./utils/debug";
import { getAttrs } from "markdown-it-attrs/utils.js";

function regexValidator(regex) {
  return function (params) {
    return params.trim().match(regex);
  };
}

function enumerator(sep = "-") {
  let names = {};
  return (name) => {
    if (typeof names[name] !== "undefined") {
      names[name]++;
    } else {
      names[name] = 1;
    }

    return name + sep + names[name];
  };
}

const enumerate = enumerator();
const slugify = require("slugify");

const getAttrOptions = {
  leftDelimiter: "{",
  rightDelimiter: "}",
  allowedAttributes: [],
};

function parseParams(params) {
  const start = params.indexOf("{"),
    end = params.indexOf("}", start);
  let attrs = [],
    title = params;
  //console.log("parsing params", params, start, end);

  if (start >= 0 && end >= 0) {
    attrs = getAttrs(params, start, getAttrOptions);
    title =
      params.substr(0, start - 1).trim() +
      params.substr(end + start + 1).trim();
    //console.log("title:", title, "attrs", attrs);
  }

  return { title: title, attrs: attrs };
}

function attrsString(attrs, baseAttrs) {
  let attrs_ = attrs.reduce(function (total, [key, value]) {
    if (total[key]) {
      total[key] = total[key] + " " + value;
    } else {
      total[key] = value;
    }
    return total;
  }, baseAttrs);

  return Object.entries(attrs_).reduce(function (total, [key, value]) {
    total += ` ${key}="${value}"`;
    return total;
  }, "");
}

export default [
  {
    name: "section",
    validate: regexValidator(/^section\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^section\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        let { title, attrs } = parseParams(m[1]);
        let attrStr = attrsString(attrs, {});
        let titleEl =
        title.length > 0
          ? '<header><h2>' + title + "</h2></header>"
          : "";
        return `<section ${attrStr}>${titleEl}` + '<div class="content">\n';
      } else {
        return "</div>\n</section>\n";
      }
    },
  },
  {
    name: "aside",
    validate: regexValidator(/^aside\s+(.*)$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^aside\s+(.*)$/);
      if (tokens[idx].nesting == 1) {
        let { title, attrs } = parseParams(m[1]);
        let attrStr = attrsString(attrs, {});
        let titleEl =
        title.length > 0
          ? '<div class="header"><span class="title">' + title + "</span></div>"
          : "";
        return `<aside ${attrStr}>${titleEl}` + '<div class="content">\n';
      } else {
        return "</div>\n</aside>\n";
      }
    },
  },
  {
    name: "boxes",
    //validate: regexValidator(/^box\s+(?:{([^}]*)}\s+)?(.*)$/),
    validate: regexValidator(/^box\s+(.*)$/),
    render: function (tokens, idx) {
      if (tokens[idx].nesting == 1) {
        var m = tokens[idx].info.trim().match(/^box\s+(.*)$/);
        let { title, attrs } = parseParams(m[1]);
        let attrStr = attrsString(attrs, {
          class: "card",
        });
        let titleEl =
          title.length > 0
            ? '<div class="card-header">' + title + "</div>"
            : "";
        return `<div ${attrStr}>${titleEl}` + '<div class="card-body">\n';
      } else {
        return "</div></div>\n";
      }
    },
  },
  {
    name: "collapse",
    validate: regexValidator(/^collapse\s+(.*)$/),
    render: function (tokens, idx, options, env, slf) {
      var m = tokens[idx].info.trim().match(/^collapse\s+(.*)$/);
      if (tokens[idx].nesting == 1) {
        const { title, attrs } = parseParams(m[1]),
          id = enumerate(slugify(title, { remove: /\W/g })),
          baseAttrs = {
            class: "heading heading-collapse collapsed",
          };

        let attrstr = attrsString(attrs, baseAttrs);

        return `<span ${attrstr} data-toggle="collapse" data-target="#${id}">${title}</a><div class="collapse" id="${id}">\n`;
      } else {
        return "</div>\n";
      }
    },
  },
  {
    name: "output",
    validate: regexValidator(/^output\s*(.*)\s*$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^output\s*(.*)\s*$/);
      if (tokens[idx].nesting == 1) {
        return '<pre><samp class="' + m[1] + '">\n';
      } else {
        return "</samp></pre>\n";
      }
    },
  },
  {
    name: "example",
    validate: regexValidator(/^example\s*(.*)\s*$/),
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^example\s*(.*)\s*$/);
      if (tokens[idx].nesting == 1) {
        return '<div class="card example"><div class="card-header example-header">Example</div><div class="card-body">\n';
      } else {
        return "</div></div>";
      }
    },
  },
  /*{
      name: 'sample_output',
      marker: '~',
      validate: regexValidator(/^\s*(.*)\s*$/),
      render: function(tokens, idx) {
        var m = tokens[idx].info.trim().match(/^\s*(.*)\s*$/);
        if (tokens[idx].nesting == 1) {
          return '<pre><samp class="' + m[1] + '">\n'
        } else {
          return '</samp></pre>\n'
        }
      }
    }*/
];
