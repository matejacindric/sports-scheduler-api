import { Weekday, WEEKDAYS } from '@/common/constants/weekdays';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class FilterClassesDto {
  @ApiPropertyOptional({ example: 'Basketball,Football' })
  @IsOptional()
  @IsString()
  sports?: string;
}

export class ClassIdDto {
  @ApiProperty({
    description: 'Class ID',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID('4')
  id: string;
}

export class CreateClassDto {
  @ApiProperty({
    description: 'ID of the sport this class belongs to',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID('4')
  sportId: string;

  @ApiProperty({
    description: 'Description of the class',
    example: 'Beginner basketball fundamentals for kids',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Days of the week when the class is held',
    example: ['Monday', 'Wednesday', 'Friday'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(WEEKDAYS, { each: true })
  classDays: Weekday[];

  @ApiProperty({
    description: 'Start time of the class (HH:MM format)',
    example: '17:00',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  startAt: string;

  @ApiProperty({
    description: 'End time of the class (HH:MM format)',
    example: '18:30',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  endAt: string;
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}
