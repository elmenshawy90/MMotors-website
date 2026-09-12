const { Pool } = require('pg');

// Preferred on Vercel / hosted Postgres (Prisma Postgres, Neon, Supabase):
//   DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
// Local Docker dev fallback: DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
// (see server/.env.example)
const isProduction = process.env.NODE_ENV === 'production';
const useConnectionString = Boolean(process.env.DATABASE_URL);

const pool = useConnectionString
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Hosted PG (Prisma/Neon/Supabase) requires SSL; harmless locally.
      ssl: isProduction || /sslmode=require/.test(process.env.DATABASE_URL || '')
        ? { rejectUnauthorized: false }
        : undefined,
      // Vercel serverless: keep the pool small, fail fast, don't hang.
      max: Number(process.env.PG_POOL_MAX || 5),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

module.exports = pool;