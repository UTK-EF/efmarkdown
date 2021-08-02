const path = require('path');

module.exports = {
  entry: {
    'efmarkdown': './src/index.js',
  },
  output: {
	path: path.resolve(__dirname, './dist'),
    library: 'efmarkdown'
  },/*
  externals: {
    hljs: 'highlight.js',
    'highlight.js': 'hljs',
    //katex: 'katex',
  },*/
  module: {
	rules: [
	  {
		test: /.js$/,
		loader: 'babel-loader',
		exclude: /node_modules/
	  }
	]
  }
};
