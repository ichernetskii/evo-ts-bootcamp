import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
const __dirname = path.resolve();

export default {
    context: path.resolve(__dirname, "./src"),
    mode: "development",
    devServer: {
        port: 4200,
            open: true
    },
    entry: "./index.ts",
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./index.html"
    })],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(svg|png)$/,
                use: "file-loader"
            }
        ],
    },
}
