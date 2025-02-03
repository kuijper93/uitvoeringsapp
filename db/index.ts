import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize Drizzle with the pool
export const db = drizzle(pool, { schema });

// Export pool for potential direct usage
export { pool };