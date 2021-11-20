/* eslint-env node */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const Dotenv = require('dotenv-webpack')

const path = require('path')
const webpack = require('webpack')
const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = env => {
  return {
    entry: {
      bundle: ['./src/user.js']
    },
    devServer: {
      historyApiFallback: true
    },
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: ['.mjs', '.js', '.svelte', '.json'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
      path: path.join(__dirname, 'build', 'user'),
      filename: '[name].[contentHash].js',
      chunkFilename: '[name].[contentHash].[id].js'
    },
    optimization: {
      minimize: true,
      moduleIds: 'hashed',
      runtimeChunk: 'single'
    },
    node: {
      crypto: true
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: true
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    mode,
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/user.html',
        scriptLoading: 'defer'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contentHash].css'
      }),
      new PreloadWebpackPlugin({
        fileWhitelist: [/\.css$/]
      }),
      new Dotenv({ systemvars: true })
    ],
    devtool: prod ? false : 'source-map'
  }
}
