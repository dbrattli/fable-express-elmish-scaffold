var path = require("path");
var webpack = require("webpack");
var fableUtils = require("fable-utils");

function resolve(filePath) {
  return path.join(__dirname, filePath)
}

var babelOptions = fableUtils.resolveBabelOptions({
  presets: [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions"]
      },
      "modules": false
    }]
  ],
  plugins: ["transform-runtime"]
});

var isProduction = process.argv.indexOf("-p") >= 0;
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

module.exports = [{
  devtool: "source-map",
  entry: resolve('./Client/Client.fsproj'),
  mode: isProduction ? "production" : "development",
  output: {
    filename: 'bundle.js',
    path: resolve('./public'),
  },
  resolve: {
    modules: [
      "node_modules", resolve("./node_modules/")
    ]
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
  plugins : isProduction ? [] : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
},
{
  devtool: "source-map",
  entry: resolve('./Server/Server.fsproj'),
  mode: isProduction ? "production" : "development",
  target: "node",
  output: {
    filename: 'server.js',
    path: resolve('./public'),
  },
  resolve: {
    modules: [
      "node_modules", resolve("./node_modules/")
    ]
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
  }
}]
