import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  private readonly pool: Pool;
  public readonly db: ReturnType<typeof drizzle>;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool);
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
