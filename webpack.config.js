var webpack = require("webpack");
var BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = {
	entry: "./src/app.coffee",
	output: {
		filename: "bundle.js",
		path: __dirname
	},
	resolve: {
		modulesDirectories: [__dirname + "/bower_components"]
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.coffee$/, loader: "coffee-loader" },
			{ test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
		]
	},
	plugins: [new BowerWebpackPlugin({
		excludes: /.*\.less/
	})]
};