const path = require('path');
const OptimizeCssAssetsPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const GenerateVersionPlugin = require('./GenerateVersionPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const PJSON_PATH = path.resolve(__dirname, '..', 'package.json');
const pjson = require(PJSON_PATH);

module.exports = {
  mode: 'production',
  entry: {
    'stylemanager.ol.min': path.resolve(__dirname, '..', 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      facade: path.resolve(__dirname, '..', 'src', 'facade', 'js'),
      templates: path.resolve(__dirname, '..', 'src', 'templates'),
      css: path.resolve(__dirname, '..', 'src', 'facade', 'assets', 'css'),
      fonts: path.resolve(__dirname, '..', 'src', 'facade', 'assets', 'fonts'),
      impl: path.resolve(__dirname, '..', 'src', 'impl', 'ol', 'js'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html',
      '.woff', '.woff2', '.eot', '.ttf', '.svg',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules\/(?!ol)|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: [/\.hbs$/, /\.html$/],
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: MiniCssExtractPlugin.loader,
      }, {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    emitOnErrors: false,
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin({
        terserOptions: {
          sourceMap: true,
        },
      }),
    ],
  },
  plugins: [
    // new GenerateVersionPlugin({
    //   version: pjson.version,
    //   regex: /([A-Za-z]+)(\..*)/,
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ESLintPlugin({
      extensions: [`js`, `jsx`],
      // files: 'src/**/*.js',
      exclude: ['**/node_modules/**', '/lib/', '/test/', '/dist/'],
    }),
    new CopywebpackPlugin({
      patterns: [
        {
          from: 'src/api.json',
          to: 'api.json',
        }
      ],
    }),
  ],
  devtool: 'source-map',
};