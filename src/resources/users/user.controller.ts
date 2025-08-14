import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'User found successfully',
    schema: {
      example: {
        id: '123-da-cjdfbdak-34',
        email: 'user@example.com',
        password: 'SecurePass123',
        role: 'user',
        createdAt: '2025-08-10T12:00:00Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User with the specified email not found',
  })
  async getByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.usersService.findByEmail(email);
  }
}
