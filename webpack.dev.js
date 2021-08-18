const merge = require('webpack-merge');
const {targets, createConfig} = require('./webpack.common');
const path = require('path');

const efmarkdownConfig = createConfig(targets.shift(), true, false);
efmarkdownConfig.devServer = {
    contentBase: './dist',
}

module.exports = ([
    efmarkdownConfig,
    ...targets.map(target => createConfig(target, true, false))  
]);
