import express from "express";
import { registerRoutes } from "./routes";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
// @ts-ignore - webpack config is a CommonJS module
const webpackConfig = require("../webpack.config.js");
import type { Configuration } from 'webpack';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('Starting server setup...');

// Register API routes first
const server = registerRoutes(app);

// Set up webpack middleware in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Setting up webpack middleware...');
  const compiler = webpack(webpackConfig as Configuration);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output?.publicPath || '/',
    stats: 'minimal',
  }));

  app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));

  // Serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const filename = path.join(compiler.outputPath || '', 'index.html');

    // Type assertion to handle the readFile method
    const outputFileSystem = compiler.outputFileSystem as {
      readFile(path: string, callback: (err: NodeJS.ErrnoException | null, contents: Buffer) => void): void;
    };

    outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        console.error('Error reading index.html:', err);
        return next(err);
      }
      res.set('Content-Type', 'text/html');
      res.send(result);
    });
  });
}

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const port = parseInt(process.env.PORT || '5000', 10);
server.listen(port, '0.0.0.0', () => {
  console.log(`${new Date().toLocaleTimeString()} [express] Server running at http://0.0.0.0:${port}`);
});