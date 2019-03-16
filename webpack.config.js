const path = require('path');

module.exports = {
    entry: './www/src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './www/dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]  //Preset used for env setup
                    }
                }
            }
        ]
    }
};