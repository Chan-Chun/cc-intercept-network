const path = require('path')
const name = require('./package').name.replace(/-/g, '_');

module.exports = {
  entry: path.join(__dirname, 'lib', 'cc-intercept-network.js'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, "dist"),
    libraryTarget: 'umd',
    library: name
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
}
