

var path = require('path'),
    HtmlPlugin = require('html-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {

    let mode = env ? env.mode : 'development',
        prod = mode == 'production';

    return {
        mode: 'development',
        entry: {
            EasePlayer: './src/library/player.ts',
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: `[name].js`,
            libraryTarget: 'umd',
            library: 'EasePlayer'
        },
        optimization: {
            minimize: prod,
            minimizer: [new TerserPlugin()]
        },
        resolve: {
            extensions: ['webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader?transpileOnly=false'
                },
                {
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'less-loader']
                },
                {
                    test: /\.(jade)$/,
                    loader: 'jade-loader',
                }
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, './dist'),
            compress: true,
            port: 3000,
            open:true
        },
        plugins: [
            new HtmlPlugin({
                inject: true,
                template: './src/example/index.html',
                filename: './index.html',
            }),
        ],
        devtool: prod ? '' : 'source-map',
        mode: mode
    }
};