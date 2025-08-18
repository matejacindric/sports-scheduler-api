CREATE EXTENSION IF NOT EXISTS citext;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "sports" ALTER COLUMN "name" SET DATA TYPE citext;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "start_at" time NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "end_at" time NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" DROP COLUMN "duration";--> statement-breakpoint
ALTER TABLE "sports" ADD CONSTRAINT "sports_name_unique" UNIQUE("name");