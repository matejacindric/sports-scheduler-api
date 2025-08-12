import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { NewUserDto } from './users.dto';
import { users } from 'src/core/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly databseService: DatabaseService) {}

  async create(data: NewUserDto) {
    return this.databseService.db.insert(users).values(data).returning();
  }

  async findByEmail(email: string) {
    const [user] = await this.databseService.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }
}
