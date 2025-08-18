import { DatabaseService } from '@/core/database/database.service';
import { classes, classSchedules, sports, users } from '@/core/database/schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, and, inArray, SQL, gte, lte, sql } from 'drizzle-orm';
import { CreateClassDto, UpdateClassDto } from './classes.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(filters?: { sports?: string[] }) {
    const conditions: Array<SQL | undefined> = [];

    if (filters?.sports?.length) {
      conditions.push(inArray(sports.name, filters.sports));
    }
    return this.databaseService.db
      .select({
        id: classes.id,
        sport: sports.name,
        description: classes.description,
        classDays: classes.classDays,
        startAt: classes.startAt,
        endAt: classes.endAt,
      })
      .from(classes)
      .leftJoin(sports, eq(classes.sportId, sports.id))
      .where(conditions.length ? and(...conditions) : undefined);
  }

  async getById(classId: string) {
    const [result] = await this.databaseService.db
      .select({
        id: classes.id,
        sport: sports.name,
        description: classes.description,
        classDays: classes.classDays,
        startAt: classes.startAt,
        endAt: classes.endAt,
      })
      .from(classes)
      .leftJoin(sports, eq(classes.sportId, sports.id))
      .where(eq(classes.id, classId));

    if (!result) {
      throw new NotFoundException(`Class with id ${classId} not found`);
    }

    return result;
  }

  async applyForClass(userId: string, classId: string) {
    const sportClass = await this.getById(classId);

    const userApplications = await this.databaseService.db
      .select({
        classId: classSchedules.classId,
        classDays: classes.classDays,
        startAt: classes.startAt,
        endAt: classes.endAt,
      })
      .from(classSchedules)
      .leftJoin(classes, eq(classSchedules.classId, classes.id))
      .where(eq(classSchedules.userId, userId));

    const conflict = userApplications.some(
      (application) =>
        application.classDays?.some((day) =>
          sportClass.classDays.includes(day),
        ) &&
        sportClass.startAt < application.endAt! &&
        sportClass.endAt > application.startAt!,
    );

    if (conflict) {
      throw new BadRequestException(
        'You already have a class at this time and day',
      );
    }

    await this.databaseService.db.insert(classSchedules).values({
      userId,
      classId,
    });

    return {
      message: 'Application successful',
      class: {
        sport: sportClass.sport,
        description: sportClass.description,
        classDays: sportClass.classDays,
        startAt: sportClass.startAt,
        endAt: sportClass.endAt,
      },
    };
  }

  async getApplicants(
    classId: string,
    filters?: { from?: string; to?: string },
  ) {
    const conditions: Array<SQL | undefined> = [
      eq(classSchedules.classId, classId),
      filters?.from
        ? gte(sql`DATE(${classSchedules.createdAt})`, new Date(filters.from))
        : undefined,
      filters?.to
        ? lte(sql`DATE(${classSchedules.createdAt})`, new Date(filters.to))
        : undefined,
    ].filter(Boolean);

    return this.databaseService.db
      .select({
        classId: classSchedules.classId,
        userId: users.id,
        userEmail: users.email,
        appliedDate: sql`DATE(${classSchedules.createdAt})`.as('appliedDate'),
      })
      .from(classSchedules)
      .leftJoin(users, eq(users.id, classSchedules.userId))
      .where(and(...conditions));
  }

  async create(dto: CreateClassDto) {
    const [newClass] = await this.databaseService.db
      .insert(classes)
      .values({
        sportId: dto.sportId,
        description: dto.description ?? null,
        classDays: dto.classDays,
        startAt: dto.startAt,
        endAt: dto.endAt,
      })
      .returning();
    return newClass;
  }

  async update(id: string, dto: UpdateClassDto) {
    await this.getById(id);

    const [updatedClass] = await this.databaseService.db
      .update(classes)
      .set({
        sportId: dto.sportId,
        description: dto.description ?? null,
        classDays: dto.classDays,
        startAt: dto.startAt,
        endAt: dto.endAt,
      })
      .where(eq(classes.id, id))
      .returning();

    if (!updatedClass) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    return updatedClass;
  }

  async delete(id: string) {
    const [deleted] = await this.databaseService.db
      .delete(classes)
      .where(eq(classes.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    return { message: 'Class deleted successfully', class: deleted };
  }
}
