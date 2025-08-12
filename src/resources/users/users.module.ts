import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/core/database/database.module';
import { UsersController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
