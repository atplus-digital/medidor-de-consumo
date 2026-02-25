CREATE TABLE "energy_log" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "energy_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"meter_id" varchar(50) NOT NULL,
	"active_power" double precision NOT NULL,
	"reactive_power" double precision NOT NULL,
	"apparent_power" double precision NOT NULL,
	"voltage" double precision NOT NULL,
	"current" double precision NOT NULL,
	"power_factor" double precision NOT NULL,
	"phase_angle" double precision NOT NULL,
	"frequency" double precision NOT NULL,
	"consumed_energy" double precision NOT NULL,
	"generated_energy" double precision NOT NULL,
	"operation_time" double precision NOT NULL,
	"raw_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
