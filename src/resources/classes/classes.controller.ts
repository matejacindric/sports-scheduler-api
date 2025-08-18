import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import {
  ClassIdDto,
  CreateClassDto,
  FilterApplicationsDto,
  FilterClassesDto,
  UpdateClassDto,
} from './classes.dto';
import { AuthenticatedRequest } from '@/common/types/auth-user.type';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all sports classes (optional filter by sports)',
  })
  @ApiOkResponse({ description: 'List of classes' })
  async getAll(@Query() filter: FilterClassesDto) {
    const sports = filter.sports?.split(',').map((s) => s.trim());
    return this.classesService.getAll({ sports });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a sport class by ID' })
  @ApiOkResponse({ description: 'Sport class' })
  @ApiNotFoundResponse({ description: 'Sport class not found' })
  async getById(@Param() param: ClassIdDto) {
    return this.classesService.getById(param.id);
  }

  @Post('/:id/apply')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for a sport class' })
  @ApiOkResponse({ description: 'Application successful' })
  @ApiNotFoundResponse({ description: 'Sport class not found' })
  @ApiBadRequestResponse({
    description: 'Schedule conflict or invalid request',
  })
  async apply(@Param() param: ClassIdDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const classId = param.id;
    return this.classesService.applyForClass(userId, classId);
  }

  @Get('/:id/applicants')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users who applied for a class in a given period',
    description:
      'Only users with the ADMIN role can see all users who applied for a class',
  })
  @ApiOkResponse({ description: 'List of applicants' })
  async getApplicants(
    @Param() param: ClassIdDto,
    @Query() filters: FilterApplicationsDto,
  ) {
    return this.classesService.getApplicants(param.id, filters);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new sport class',
    description: 'Only users with the ADMIN role can create a class',
  })
  @ApiOkResponse({ description: 'Class created' })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  async create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a sport class',
    description: 'Only users with the ADMIN role can update a class',
  })
  @ApiOkResponse({ description: 'Class updated' })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  @ApiNotFoundResponse({ description: 'Class not found' })
  async update(@Param() param: ClassIdDto, @Body() dto: UpdateClassDto) {
    return this.classesService.update(param.id, dto);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a sport class',
    description: 'Only users with the ADMIN role can delete a class',
  })
  @ApiOkResponse({
    description: 'Class deleted',
  })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  @ApiNotFoundResponse({ description: 'Class not found' })
  async delete(@Param() param: ClassIdDto) {
    return this.classesService.delete(param.id);
  }
}
