import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from 'url';
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
// @ts-ignore - webpack config is a JavaScript file
import webpackConfig from "../webpack.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('Starting server setup...');

// Register API routes first
const server = registerRoutes(app);

// Set up webpack middleware in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Setting up webpack middleware...');
  const compiler = webpack({
    ...webpackConfig,
    entry: {
      app: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', webpackConfig.entry.app[1]],
    },
  });

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: 'minimal',
  }));

  app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));

  // Serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    console.log(`Handling request for: ${req.path}`);
    if (req.path.startsWith('/api')) {
      return next();
    }
    const filename = path.join(compiler.outputPath || '', 'index.html');
    console.log(`Attempting to serve: ${filename}`);
    compiler.outputFileSystem?.readFile(filename, (err, result) => {
      if (err) {
        console.error('Error reading index.html:', err);
        return next(err);
      }
      res.set('Content-Type', 'text/html');
      res.send(result);
      console.log('Successfully served index.html');
    });
  });
}

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const port = parseInt(process.env.PORT || '5000', 10);
server.listen(port, '0.0.0.0', () => {
  console.log(`${new Date().toLocaleTimeString()} [express] Server running at http://0.0.0.0:${port}`);
});