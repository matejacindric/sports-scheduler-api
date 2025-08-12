CREATE TYPE "public"."role" AS ENUM('user', 'employee', 'admin');--> statement-breakpoint
CREATE TYPE "public"."weekday" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');--> statement-breakpoint
CREATE TABLE "class_schedules" (
	"class_id" uuid NOT NULL,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_id" uuid NOT NULL,
	"description" varchar(256),
	"duration" integer NOT NULL,
	"class_days" "weekday"[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "classes_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "sports_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE cascade ON UPDATE no action;