CREATE TABLE "meters" (
	"meter_id" varchar(100) PRIMARY KEY NOT NULL,
	"meter_type" varchar(50) NOT NULL,
	"location" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"prefix" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "energy_log" ALTER COLUMN "meter_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "energy_log" ADD CONSTRAINT "energy_log_meter_id_meters_meter_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("meter_id") ON DELETE no action ON UPDATE no action;