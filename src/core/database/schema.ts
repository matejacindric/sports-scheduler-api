import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const role = pgEnum('role', ['user', 'employee', 'admin']);

export const weekdayEnum = pgEnum('weekday', [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);

export const users = pgTable('users', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .unique()
    .primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: role('role').default('user').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => {
  return {
    classSchedules: many(classSchedules, {
      relationName: 'class_schedules',
    }),
  };
});

export const sports = pgTable('sports', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .unique()
    .primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const sportsRelations = relations(sports, ({ many }) => {
  return {
    classes: many(classes, {
      relationName: 'classes',
    }),
  };
});

export const classes = pgTable('classes', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .unique()
    .primaryKey(),
  sportId: uuid('sport_id')
    .references(() => sports.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  description: varchar('description', { length: 256 }),
  duration: integer('duration').notNull(),
  classDays: weekdayEnum('class_days').array().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const classesRelations = relations(classes, ({ one, many }) => {
  return {
    sport: one(sports, {
      fields: [classes.sportId],
      references: [sports.id],
    }),
    classSchedules: many(classSchedules, {
      relationName: 'class_schedules',
    }),
  };
});

export const classSchedules = pgTable('class_schedules', {
  classId: uuid('class_id')
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const classSchedulesRelations = relations(classSchedules, ({ one }) => {
  return {
    class: one(classes, {
      fields: [classSchedules.classId],
      references: [classes.id],
    }),
    user: one(users, {
      fields: [classSchedules.userId],
      references: [users.id],
    }),
  };
});
