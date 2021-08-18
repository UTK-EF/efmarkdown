'use strict';

export default async function fetchContent(url) {
    const response = await fetch(url + '?embed=1');
    const content = await response.text();
    return content;
};