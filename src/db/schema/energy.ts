import {
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
	createUpdateSchema,
} from "drizzle-zod";
import { metersTable } from "./meters";

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

// Types
export type EnergyLog = typeof energyLogTable.$inferSelect;
export type NewEnergyLog = typeof energyLogTable.$inferInsert;
