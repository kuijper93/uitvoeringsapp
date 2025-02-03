import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

// Required for Neon serverless with WebSocket support
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

// Simple pool configuration
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

// Export Drizzle instance
export const db = drizzle(pool, { schema });
export { pool };