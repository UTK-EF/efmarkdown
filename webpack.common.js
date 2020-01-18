const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
	path: path.resolve(__dirname, './dist'),
	filename: 'efmarkdown.js',
    libraryTarget: 'window',
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
