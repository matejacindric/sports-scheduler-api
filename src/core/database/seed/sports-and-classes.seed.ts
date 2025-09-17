import { randomUUID } from 'crypto';
import { classes, sports, users } from '../schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as bcrypt from 'bcrypt';
import * as schema from '../schema';

export async function seedSportsAndClasses(db: NodePgDatabase<typeof schema>) {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await db
    .insert(users)
    .values([
      {
        id: randomUUID(),
        email: 'test@example.com',
        password: hashedPassword,
      },
    ])
    .onConflictDoNothing();

  const initialSports = ['Baseball', 'Basketball', 'Football'];

  await db
    .insert(sports)
    .values(initialSports.map((name) => ({ name })))
    .onConflictDoNothing();

  const allSports = await db.select().from(sports);

  const sportMap = Object.fromEntries(allSports.map((s) => [s.name, s.id]));

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
