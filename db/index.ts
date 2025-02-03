import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// Required for Neon serverless with WebSocket support
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

// Create a pool using Neon's serverless client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Add error handling
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Initialize Drizzle with the pool and schema
export const db = drizzle(pool, { schema });

// Export pool for potential direct usage
export { pool };