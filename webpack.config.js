import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: [
    // Add webpack-hot-middleware entry points
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './client/src/main.tsx'
  ],
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
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false
            }
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'autoprefixer',
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html',
    }),
    // Add environment variables that should be available in the client
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  // Source maps for better debugging
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  // Optimization settings
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  // Performance hints
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
};