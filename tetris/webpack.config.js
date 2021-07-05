import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
// import {CleanWebpackPlugin} from "clean-webpack-plugin";
import path from "path";
const __dirname = path.resolve();

export default (env = {}) => {
    const {mode = "development"} = env;
    const isDev = mode === "development";
    const isProd = mode === "production";

    const getPlugins = () => {
        const plugins = [
            new HtmlWebpackPlugin({
                template: "./index.html"
            }),
			// new CleanWebpackPlugin()
        ];

        if (isProd) {
            plugins.push(
                new MiniCSSExtractPlugin({
                    filename: "style/main-[fullhash:8].css"
                })
            );
        }

        return plugins;
    }

    const cssLoaders = (extra, module = false) => {
        let loaders = [
            isProd ? MiniCSSExtractPlugin.loader : "style-loader",
            {
                loader: "css-loader",
                options: {
                    importLoaders: 2,
                    modules: module ? {
                        compileType: "module",
                        localIdentName: "[local]___[name]___[hash:base64:5]"
                    } : false
                }
            }
        ];

        // post css
        if (isProd) {
            loaders.push({
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [[
                            "postcss-preset-env"
                        ]],
                    },
                },
            });
        }

        // extra css
        if (extra) {
            if (typeof extra === "string") {
                loaders.push(extra);
            } else if (Array.isArray(extra)) {
                loaders = loaders.concat(extra);
            }
        }

        return loaders;
    }

    return {
        context: path.resolve(__dirname, "./src"),
        mode: mode,
        devServer: {
            port: 4200,
            open: true,
            hot: true,
            watchContentBase: true
        },
        entry: "./index.tsx",
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
			alias: {
				"@": path.resolve(__dirname, "src"),
				"components": path.resolve(__dirname, "src", "components")
			}
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
        },
		target: isProd ? "browserslist" : "web", // disable browserslist for development
		devtool: isProd ? undefined : "source-map",
        plugins: getPlugins(),
        module: {
            rules: [
                // Babel loader
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: "babel-loader"
                },

                // CSS loaders
                {
                    test: /\.(css)$/,
                    use: cssLoaders()
                },

                // SCSS loaders
                // SCSS except modules
                {
                    test: /\.(s[ca]ss)$/,
                    exclude: /\.module\.s[ca]ss$/,
                    use: cssLoaders("sass-loader", false)
                },
                // SCSS modules
                {
                    test: /\.module\.s[ca]ss$/,
                    use: cssLoaders("sass-loader", true)
                }
            ],
        },
    }
}
