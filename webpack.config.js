var BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = {
	entry: "./src/app.coffee",
	output: {
		filename: "bundle.js",
		path: "."
	},
	resolve: {
		modulesDirectories: ["bower_components"]
	},
	module: {
		loaders: [
			{ test: /\.coffee$/, loader: "coffee-loader" },
			{ test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
		]
	},
	plugins: [new BowerWebpackPlugin()]
};