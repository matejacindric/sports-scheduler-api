import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  private readonly pool: Pool;
  public readonly db: NodePgDatabase<typeof schema>;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    try {
      await this.pool.end();
      this.logger.log('Database connection pool has been closed.');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to close DB connection:', error.message);
      }
    }
  }
}
