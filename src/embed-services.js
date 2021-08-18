import debug from './utils/debug';

const embedServices = {
    'video': {
        render: (videoID, url, options) => {
          //console.log('video embed render', videoID, url, options);
          return `<div class="html5-video" data-file="${videoID}"></div>`;
        }
    },
    'link': {
        render: (linkID, url, options) => {
            return `<a href="#" class="ef-link" data-link-id="${linkID}"></a>`
        }
    },
    'page': {
        render:(linkID, url, options) => {
            const location = window.location;
            //console.log('url', url);
            if (!url) {
                const path = linkID.replace(/^\/|\/$/g, '');
                url = `${location.origin}/${path}?embed=1`; 
            }
            let theOptions = {...options, height: 600};
            //return `<div class="page-inject" data-href="${url}"></div>`;
            return `<div class="embedded_thing"><iframe src="${url}" width="99%" height="${theOptions.height}px"></iframe></div>\n`;
        }
    },
    'assess': {
        render: (assessID, url, options) => {
            var location = window.location;
            const classPathParts = location.pathname.replace(/^\/|\/$/g, '').split('/');
            let classPath = '';
            if (classPathParts.length > 0) {
                classPath = classPathParts[0];
            }
            debug.log('classPath', classPath);
            url = `${location.origin}/${classPath}/sys.php?f=assess/main&name=${assessID}&embed=1`;
            debug.log('location', location, 'url', url);
            let theOptions = {...options, height: 600};
            //return `<div class="page-inject assessment" data-href="${url}"></div>`;
            return `<div class="embedded_thing"><iframe src="${url}" width="99%" height="${theOptions.height}px"></iframe></div>\n`;
        }
    }
};


export default embedServices;