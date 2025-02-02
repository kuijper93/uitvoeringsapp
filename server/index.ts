import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from 'url';
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
// @ts-ignore - webpack config is a JavaScript file
import webpackConfig from "../webpack.config.js";

// ESM module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for Replit domains
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.endsWith('.replit.dev') || origin.endsWith('.repl.co'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`${new Date().toLocaleTimeString()} [express] ${logLine}`);
    }
  });

  next();
});

// Register API routes first
const server = registerRoutes(app);

// Set up webpack middleware in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Setting up webpack middleware...');
  const compiler = webpack(webpackConfig);

  // Configure webpack dev middleware with proper MIME types and history fallback
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath || '/',
    writeToDisk: true,
    serverSideRender: true,
    index: true,
    mimeTypes: {
      'application/javascript': ['js', 'jsx', 'ts', 'tsx'],
      'text/css': ['css'],
    },
  });

  app.use(devMiddleware);
  app.use(webpackHotMiddleware(compiler));

  // Handle all routes in development
  app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }

    const filename = path.join(compiler.outputPath, 'index.html');

    compiler.outputFileSystem.readFile(filename, (err: any, result: any) => {
      if (err) {
        return next(err);
      }

      res.set('Content-Type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  // Production static file serving
  express.static.mime.define({
    'application/javascript': ['js', 'jsx', 'ts', 'tsx'],
    'text/css': ['css'],
  });

  app.use(express.static(path.join(__dirname, '../dist/public')));

  // Handle all routes in production
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
}

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`${new Date().toLocaleTimeString()} [express] Server running at http://0.0.0.0:${PORT}`);
});