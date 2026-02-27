import {
	boolean,
	doublePrecision,
	foreignKey,
	integer,
	jsonb,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";

export const metersTable = pgTable("meters", {
	// Identification
	meterId: varchar("meter_id", { length: 100 }).primaryKey(),

	// Information
	meterName: varchar("meter_name", { length: 255 }).notNull(),
	meterType: varchar("meter_type", { length: 50 }).notNull(),
	location: varchar("location", { length: 255 }).notNull(),
	status: varchar("status", { length: 50 }).notNull().default("active"),
	prefix: varchar("prefix", { length: 50 }),

	// Configuration
	isInverted: boolean("is_inverted").notNull().default(false), // 0 = normal, 1 = inverted

	// Timestamps
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Meters schemas
export const metersSchema = createSelectSchema(metersTable);
export const metersInsertSchema = createInsertSchema(metersTable);
export const metersUpdateSchema = createUpdateSchema(metersTable);
export type Meter = typeof metersTable.$inferSelect;
export type NewMeter = typeof metersTable.$inferInsert;
export type UpdateMeter = z.infer<typeof metersUpdateSchema>;

export const energyLogTable = pgTable(
	"energy_log",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),

		// Identification
		meterId: varchar("meter_id", { length: 100 }).notNull(),

		// Power
		activePower: doublePrecision("active_power").notNull(), // W
		reactivePower: doublePrecision("reactive_power").notNull(), // VAR
		apparentPower: doublePrecision("apparent_power").notNull(), // VA

		// Electrical measurements
		voltage: doublePrecision("voltage").notNull(), // V
		current: doublePrecision("current").notNull(), // A
		powerFactor: doublePrecision("power_factor").notNull(),
		phaseAngle: doublePrecision("phase_angle").notNull(), // °
		frequency: doublePrecision("frequency").notNull(), // Hz

		// Accumulated energy
		consumedEnergy: doublePrecision("consumed_energy").notNull(), // kWh
		generatedEnergy: doublePrecision("generated_energy").notNull(), // kWh

		// Operation time
		operationTime: doublePrecision("operation_time").notNull(), // s

		// Raw data (backup)
		rawData: jsonb("raw_data"),

		// Timestamp
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.meterId],
			foreignColumns: [metersTable.meterId],
		}),
	],
);

// Energy logs schemas
export const energyLogSchema = createInsertSchema(energyLogTable);
export const energyLogUpdateSchema = createUpdateSchema(energyLogTable);
export type EnergyLog = typeof energyLogTable.$inferSelect;
export type NewEnergyLog = typeof energyLogTable.$inferInsert;
