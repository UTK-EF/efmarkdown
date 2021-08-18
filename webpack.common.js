const markdownItAttrs = require('markdown-it-attrs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const targets = [
    {
        name: 'efmarkdown',
        entry: './src/efmarkdown.js',
        library: 'efmarkdown'
    },
    {
        name: 'auto-render',
        entry: './src/index.js',
        library: 'renderMarkdownInElements'
    },
    {
        name: 'highlight',
        entry: './src/highlight.js',
        library: 'hljs'
    }
];

function createConfig(target, dev, minimize)
{
    return {
        mode: dev ? 'development' : 'production',
        context: __dirname,
        entry: {
            [target.name]: target.entry
        },
        output: {
            filename: minimize ? '[name].min.js' : '[name].js',
            library: target.library,
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: "(typeof self !== 'undefined' ? self : this)",
            path: path.resolve(__dirname, 'dist'),
            //clean: true,
            publicPath: dev ? '/' : '',
        },
        module: {
            rules: [
              {
                test: /.js$/,
                exclude: /node_modules/,
                include: '/node_modules/markdown-it-attrs',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                      }
                }
              },
              {
                  test: /.css$/,
                  use: ['style-loader', 'css-loader']
              }
            ]
          },
        externals: ['hljs', 'renderMathInElement'],
        devtool: dev && 'inline-source-map',
        optimization: {
            minimize,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            ascii_only: true,
                        },
                    },
                }),
            ],
        },
        performance: {
            hints: false,
        },
        stats: {
            colors: true,
        },
    }
}

module.exports = {
    targets,
    createConfig,
};
