const path = require('path');

module.exports = {
  entry: {
    'efmarkdown': './src/index.js',
  },
  output: {
	path: path.resolve(__dirname, './dist'),
	filename: 'efmarkdown.js',
    library: 'efmarkdown'
  },
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
