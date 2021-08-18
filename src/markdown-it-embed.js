import debug from './utils/debug';

const EMBED_REGEX = /@\[([a-zA-Z].+)]\([\s]*(.*?)[\s]*[)]/im;

function customEmbed(md, options) {
  const optionsCopy = options;
  function embedReturn(state, silent) {
    var serviceEnd;
    var serviceStart;
    var token;
    var urlText;
    var theState = state;
    var url = null;
    const oldPos = state.pos;

    //console.log('embedReturn', state, silent);
    if (state.src.charCodeAt(oldPos) !== 0x40/* @ */ ||
        state.src.charCodeAt(oldPos + 1) !== 0x5B/* [ */) {
      return false;
    }

    const match = EMBED_REGEX.exec(state.src.slice(state.pos, state.src.length));

    if (!match || match.length < 3) {
      return false;
    }

    const service = match[1];
    urlText = match[2];
    const serviceLower = service.toLowerCase();

    // If the urlText field is empty, regex currently make it the close parenthesis.
    if (urlText === ')') {
      urlText = '';
    }

    if (urlText.indexOf('://') > -1) {
        url = new URL(urlText);     
    }

    serviceStart = oldPos + 2;
    serviceEnd = md.helpers.parseLinkLabel(state, oldPos + 1, false);

     //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      theState.pos = serviceStart;
      theState.service = theState.src.slice(serviceStart, serviceEnd);
      const newState = new theState.md.inline.State(service, theState.md, theState.env, []);
      newState.md.inline.tokenize(newState);
      token = theState.push('embed', '');
      token.urlParts = url;
      token.service = service;
      token.url = urlText;
      token.level = theState.level;
    }

    theState.pos += theState.src.indexOf(')', theState.pos);
      return true;
  }

  return embedReturn;
}

const defaults = {
};

function tokenizeEmbed(md, options) {
  function tokenizeReturn(tokens, idx) {
    const linkString = md.utils.escapeHtml(tokens[idx].url);
    const service = md.utils.escapeHtml(tokens[idx].service).toLowerCase();

    //console.log('tokenizeReturn', tokens, idx);
    if (options.services[service]) {
      const sopts = options.services[service];
      return linkString === '' ? '<!-- ERROR: blank location string -->' : sopts.render(linkString, tokens[idx].urlParts, sopts.options);
    } else {
      return `<!-- ERROR: unknown service ${service} -->`;
    }
  }

  return tokenizeReturn;
}

export default function embedPlugin(md, options) {
  var theOptions = options;
  var theMd = md;
  if (theOptions) {
  } else {
    theOptions = defaults;
  }

    debug.log('loading embed plugin', theOptions);
    theMd.renderer.rules.embed = tokenizeEmbed(theMd, theOptions);
    theMd.inline.ruler.before('emphasis', 'embed', customEmbed(theMd, theOptions));
};
