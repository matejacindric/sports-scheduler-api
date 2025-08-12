# sports-scheduler-api

This project is a NestJS + TypeScript + Express backend application for managing sports programs in a sports complex.
It provides RESTful APIs for user registration, sports class scheduling, role-based access control, and class applications.
The backend is fully documented with Swagger and uses a relational database with an Drizzle ORM.

## Features
- User Registration & Login
- Role-Based Authorization
- Sports Class Management (CRUD operations for admins)
- Filter Classes by Sport (e.g., /api/classes?sports=Basketball,Football)
- View Class Details (schedule, duration, description)
- Apply for a Sports Class (for registered users)
- Swagger API Documentation

## Tech Stack
- Backend Framework: NestJS (TypeScript + Express)
- Database: PostgreSQL
- ORM: Drizzle ORM
- Authentication: JWT-based authentication
- API Docs: Swagger

## Installation & Setup

Clone repository
```bash
git clone https://github.com/matejacindric/sports-scheduler-api.git
```

Run PostgreSQL in Docker:
```bash
$ docker run --name sports-scheduler-pg -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres
```

Switch to the project's Node version:
```bash
$ nvm use
```

Install dependencies
```bash
npm install
```

## Compile and run the project
1. Create your environment file:
- Duplicate `.env.example` and rename it to `.env.`
- Adjust any values as needed for your local setup.

2. Start the development server:
```bash
$ npm run start:dev
```

## Migrations
**Generate a Migration**

When you make changes to the database schema:

```bash
npm run db:generate
```

**Drop Migrations Safely**

If a migration needs to be removed, never delete it manually.
Instead, run:

```bash
npm run db:migrate-drop
```

**Apply Migrations**

To update your local database schema:

```bash
npm run db:migrate-run
```

## Run tests

**unit tests**
```bash
$ npm run test
````

**e2e tests**
```bash
$ npm run test:e2e
```

## API Documentation
Swagger UI available at:
```bash
http://localhost:3000/api
```
