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
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath || '/',
      writeToDisk: true,
      stats: 'minimal',
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Server error:", err);
  res.status(status).json({ message });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/public')));
}

// Handle all routes - This should be the last middleware
app.get('*', (req, res) => {
  // Skip API routes
  if (req.originalUrl.startsWith('/api')) {
    return;
  }

  // Send the appropriate index.html file
  const indexPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../dist/public/index.html')
    : path.join(__dirname, '../client/index.html');

  res.sendFile(indexPath);
});

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`${new Date().toLocaleTimeString()} [express] Server running at http://0.0.0.0:${PORT}`);
});