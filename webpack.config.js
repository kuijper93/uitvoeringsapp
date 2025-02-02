import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './client/src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@db': path.resolve(__dirname, 'db'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:5000',
    },
    static: {
      directory: path.join(__dirname, 'dist/public'),
    },
    client: {
      overlay: true,
    },
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
};