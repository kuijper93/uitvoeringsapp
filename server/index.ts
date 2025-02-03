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

  // Configure webpack dev middleware
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath || '/',
    writeToDisk: true,
    serverSideRender: true,
    index: true,
  });

  app.use(devMiddleware);
  app.use(webpackHotMiddleware(compiler));

  // Handle all routes in development
  app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }

    const filename = path.join(compiler.outputPath || '', 'index.html');
    if (!compiler.outputFileSystem) {
      return next(new Error('Webpack compiler output filesystem not available'));
    }

    compiler.outputFileSystem.readFile(filename, (err: any, result: Buffer | string | null) => {
      if (err) {
        return next(err);
      }
      if (!result) {
        return next(new Error('No output file generated'));
      }

      res.set('Content-Type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  // Production static file serving
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

// Try to find an available port
const startServer = (retries = 3, basePort = 5000) => {
  let currentPort = basePort;
  const tryListen = () => {
    server.listen(currentPort, "0.0.0.0", () => {
      console.log(`${new Date().toLocaleTimeString()} [express] Server running at http://0.0.0.0:${currentPort}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE' && retries > 0) {
        console.log(`Port ${currentPort} in use, trying ${currentPort + 1}...`);
        currentPort++;
        retries--;
        tryListen();
      } else {
        console.error('Server failed to start:', err);
        process.exit(1);
      }
    });
  };
  tryListen();
};

startServer();