import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { NewUserDto } from './users.dto';
import { users } from '@/core/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: NewUserDto) {
    return this.databaseService.db.insert(users).values(data).returning();
  }

  async findByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }
}
