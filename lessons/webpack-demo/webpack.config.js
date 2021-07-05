const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
    entry: {
        root: path.resolve(__dirname, './src/index.tsx'),
        rootReact: path.resolve(__dirname, './src/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: argv.mode === "production" ? "[name].[contenthash].js" : "[name].js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true,
        port: 4200
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.svg$/,
                //type: 'asset/inline',
                loader: "svg-inline-loader"
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/template.html'), // шаблон
            // название выходного файла
            filename: "index.html",
            chunks: ["rootReact", "root"]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ],
})
