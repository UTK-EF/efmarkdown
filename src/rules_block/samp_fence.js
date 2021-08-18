// fences (``` lang, ~~~ lang)

'use strict';

//const MARKER = 0x2B; /* + */
const MARKER = 0x7E; /* ~ */

function fence(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem, token, markup,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (pos + 3 > max) { return false; }

  //console.log('looking for ' + MARKER);

  marker = state.src.charCodeAt(pos);

  if (marker !== MARKER) {
    return false;
  }

  //console.log('samp_fence found at least one +', marker);

  // scan marker length
  mem = pos;
  pos = state.skipChars(pos, marker);

  len = pos - mem;

  //console.log('looking for ' + MARKER + ' at len ' + len);

  if (len > 3) { return false; }

  //console.log('Inside +++');
  markup = state.src.slice(mem, pos);
  params = state.src.slice(pos, max);

  if (marker === MARKER /* ~ */) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }
  }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);

  token         = state.push('samp', 'samp', 0);
  token.info    = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};

function render(tokens, idx, options, env, slf) {
    var token = tokens[idx];

    return  '<pre' + slf.renderAttrs(token) + '><samp class="' + token.info.trim() + '">' +
            tokens[idx].content +
            '</samp></pre>\n';
}

module.exports = function samp_plugin(md) {
    md.block.ruler.before('fence', 'samp', fence, {
        alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
    });
    md.renderer.rules['samp'] = render;
    //md.renderer.rules['samp_close'] = render;
}