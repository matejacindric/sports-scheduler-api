import 'dotenv/config';
import { Pool } from 'pg';
import { seedSportsAndClasses } from './seed/sports-and-classes.seed';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    await seedSportsAndClasses(db);
    console.log('Seeding complete');
  } catch (err) {
    console.error('Seeding failed', err);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Unhandled error in seed script:', err);
  process.exit(1);
});
