const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, '.\\src\\tsOutDir\\index.js')
    },
    output: {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'deploy'),
        clean: true

    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack Output",
            template: 'index.html'
        })
    ]
}