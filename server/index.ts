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

// Register API routes first
const server = registerRoutes(app);

// Set up webpack middleware in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Setting up webpack middleware...');
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: 'minimal',
  }));

  app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));
}

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, "0.0.0.0", () => {
  console.log(`${new Date().toLocaleTimeString()} [express] Server running at http://0.0.0.0:${port}`);
});