const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, '.\\src\\tsOutDir\\index.js')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'deploy')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack Output",
        })
    ]
}