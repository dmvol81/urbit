const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const urbitrc = require('./urbitrc');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function copyFile(src,dest) {
  return new Promise((res,rej) =>
    fs.copyFile(src,dest, err => err ? rej(err) : res()));
}

class UrbitShipPlugin {
  constructor(urbitrc) {
    this.piers = urbitrc.URBIT_PIERS;
    this.herb = urbitrc.herb || false;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      'UrbitShipPlugin',
      async (compilation) => {
        const src = path.resolve(compiler.options.output.path, 'index.js');

        return Promise.all(this.piers.map((pier) => {
          const landscapeHtml = path.resolve(pier, 'app/landscape/index.html');
          fs.readFile(landscapeHtml, 'utf8', (err, data) => {
            if (err) {
              return console.log(err);
            }
            const result = data.replace('/~landscape/js/index.js', 'http://localhost:9000/index.js');

            if (data === result) {
              return;
            }

            fs.writeFile(landscapeHtml, result, 'utf8', (err) => {
              if (err) {
                return console.log(err);
              }
            });
          });
        }));
        // uncomment to copy into all piers
        //
        // return Promise.all(this.piers.map(pier => {
        //   const dst = path.resolve(pier, 'app/landscape/js/index.js');
        //   copyFile(src, dst).then(() => {
        //     if(!this.herb) {
        //       return;
        //     }
        //     pier = pier.split('/');
        //     const desk = pier.pop();
        //     return exec(`herb -p hood -d '+hood/commit %${desk}' ${pier.join('/')}`);
        //   });
        // }));
      }
    );
  }
}

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/typescript', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    port: 9000,
    historyApiFallback: true
  },
  plugins: [
    new UrbitShipPlugin(urbitrc)
    // new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   title: 'Hot Module Replacement',
    //   template: './public/index.html',
    // }),
  ],
  watch: true,
  output: {
    filename: 'index.js',
    chunkFilename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  optimization: {
    minimize: false,
    usedExports: true
  }
};
