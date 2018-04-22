var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, './');

module.exports = {
  
    entry: [
        path.join(parentDir, './dhis2API.js')
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    output: {
        path: parentDir + '/dist',
        filename: 'dhis2API.js',
        library: "dhis2API",
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true
    }
   
}
