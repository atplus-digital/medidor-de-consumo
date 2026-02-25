import {
	doublePrecision,
	integer,
	jsonb,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const energyLogTable = pgTable("energy_log", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),

	// Identification
	meterId: varchar("meter_id", { length: 50 }).notNull(),

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
});

export const energyLogSchema = createInsertSchema(energyLogTable);
export type EnergyLog = typeof energyLogTable.$inferSelect;
export type NewEnergyLog = typeof energyLogTable.$inferInsert;

/*
	const defaultInsert =  {
		meterId: "1",
		activePower: 100.0,
		reactivePower: 50.0,
		apparentPower: 111.8,
		voltage: 230.0,
		current: 0.43,
		powerFactor: 0.89,
		phaseAngle: 27.0,
		frequency: 50.0,
		consumedEnergy: 0.5,
		generatedEnergy: 0.0,
		operationTime: 60.0,
		rawData: {
			"example_field": "example_value"
			},	
		}
*/
