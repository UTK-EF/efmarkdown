import hljs from 'highlight.js/lib/core';
require ('highlightjs-line-numbers.js');

//import 'highlight.js/styles/an-old-hope.css';

import matlab from 'highlight.js/lib/languages/matlab';
import excel from 'highlight.js/lib/languages/excel';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import css from 'highlight.js/lib/languages/css';

hljs.registerLanguage('matlab', matlab);
hljs.registerLanguage('excel', excel);
hljs.registerLanguage('python', python);
hljs.registerLanguage('php', php);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('markdown ', markdown);
hljs.registerLanguage('css', css);


/* why doesn't this work?
const languages = ['matlab', 'excel', 'python', 'markdown', 'javascript'];
languages.forEach(function(lang) {
    let modulePath = 'highlight.js/lib/languages/' + lang + '.js';
    import(modulePath)
        .then(obj =>{
            console.log('registering language', lang, obj);
            hljs.registerLanguage(lang, obj) })
        .catch(err => console.log('error loading highlight language ' + lang + ': no module at ' + modulePath));
});*/

export default hljs;