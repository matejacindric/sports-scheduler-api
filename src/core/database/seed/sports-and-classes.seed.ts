import { randomUUID } from 'crypto';
import { classes, sports } from '../schema';
import { drizzle } from 'drizzle-orm/node-postgres';

export async function seedSportsAndClasses(db: ReturnType<typeof drizzle>) {
  const initialSports = ['Baseball', 'Basketball', 'Football'];

  const insertedSports = await db
    .insert(sports)
    .values(initialSports.map((name) => ({ name })))
    .onConflictDoNothing()
    .returning({ id: sports.id, name: sports.name });

  const sportMap = Object.fromEntries(
    insertedSports.map((s) => [s.name, s.id]),
  );

  await db
    .insert(classes)
    .values([
      {
        id: randomUUID(),
        sportId: sportMap['Baseball'],
        description: 'Beginner baseball fundamentals for kids',
        classDays: ['Monday', 'Wednesday', 'Friday'],
        startAt: '17:00',
        endAt: '18:30',
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        sportId: sportMap['Basketball'],
        description: 'Intermediate basketball skills and drills',
        classDays: ['Tuesday', 'Thursday', 'Saturday'],
        startAt: '18:00',
        endAt: '20:00',
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        sportId: sportMap['Football'],
        description: 'Advanced football tactics and conditioning',
        classDays: ['Monday', 'Thursday', 'Sunday'],
        startAt: '19:30',
        endAt: '22:00',
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        sportId: sportMap['Football'],
        description: 'Intermediate football tactics and conditioning',
        classDays: ['Tuesday', 'Thursday', 'Friday'],
        startAt: '17:00',
        endAt: '18:30',
        createdAt: new Date(),
      },
    ])
    .onConflictDoNothing();
}
