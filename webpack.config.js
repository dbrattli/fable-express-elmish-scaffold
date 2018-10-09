var path = require("path");
var webpack = require("webpack");

function resolve(filePath) {
    return path.join(__dirname, filePath)
}

var babelOptions = {
    presets: [
        ["@babel/preset-env", {
            "targets": {
                "browsers": ["last 2 versions"]
            },
            "modules": false
        }]
    ],
    plugins: ["@babel/plugin-transform-runtime"]
};

var babelOptionsServer = {
    presets: [
        ["@babel/preset-env", {
            "targets": {
                "node": "current"
            }
        }]
    ],
    plugins: ["@babel/plugin-transform-modules-commonjs"]
};

var isProduction = process.argv.indexOf("-p") >= 0;
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");
var port = process.env.SUAVE_FABLE_PORT || "8085";

module.exports = [{
    devtool: "source-map",
    mode: "development",
    entry: "./Client/Client.fsproj",
    output: {
        path: path.join(__dirname, "./public/js"),
        publicPath: "/js",
        filename: "bundle.js",
    },
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://localhost:' + port,
                changeOrigin: true
            }
        },
        contentBase: "./public",
        port: 8080,
        hot: true,
        inline: true
    },
    resolve: {
        symlinks: false,
        modules: [resolve("node_modules/")]
    },
    module: {
        rules: [
            {
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptions,
                        define: isProduction ? [] : ["DEBUG"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                },
            }
        ]
    },
    plugins: isProduction ? [] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
},{
    node: {
        fs: 'empty',
        net: 'empty'
    },
    devtool: "source-map",
    mode: "development",
    entry: "./Server/Server.fsproj",
    output: {
        path: path.join(__dirname, "./public/"),
        filename: "server.js",
    },
    resolve: {
        symlinks: false,
        modules: [resolve("node_modules/")]
    },
    module: {
        rules: [
            {
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptionsServer,
                        define: isProduction ? [] : ["DEBUG"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptionsServer
                },
            }
        ]
    }
}]