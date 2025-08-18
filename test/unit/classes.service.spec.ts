import { UpdateClassDto } from '@/resources/classes/classes.dto';
import { ClassesService } from '@/resources/classes/classes.service';
import { NotFoundException } from '@nestjs/common';

describe('class schedule update', () => {
  let classesService: ClassesService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    };

    classesService = new ClassesService({ db: mockDb } as any);
    classesService.getById = jest.fn();
  });

  it('should update class successfully', async () => {
    const dto: UpdateClassDto = {
      sportId: '1',
      description: 'Updated description',
      classDays: ['Monday', 'Wednesday', 'Saturday'],
      startAt: '10:00',
      endAt: '11:30',
    };

    const existingClass = {
      id: '1',
      sport: 'Basketball',
      description: 'Old description',
      classDays: ['Monday', 'Wednesday'],
      startAt: '09:00',
      endAt: '10:00',
    };

    const updatedClass = {
      id: '1',
      sport: 'Basketball',
      description: 'Updated description',
      classDays: ['Monday', 'Wednesday', 'Saturday'],
      startAt: '10:00',
      endAt: '11:30',
    };

    (classesService.getById as jest.Mock).mockResolvedValue(existingClass);

    mockDb.returning.mockResolvedValue([updatedClass]);

    const result = await classesService.update('1', dto);

    expect(result).toEqual(updatedClass);
  });

  it('should throw NotFoundException if no class updated', async () => {
    const dto: UpdateClassDto = { sportId: '1' } as any;

    (classesService.getById as jest.Mock).mockResolvedValue({
      id: '1',
      sport: 'Basketball',
      description: 'Old description',
      classDays: ['Monday'],
      startAt: '09:00',
      endAt: '10:00',
    });

    mockDb.returning.mockResolvedValue([]);

    await expect(classesService.update('1', dto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
