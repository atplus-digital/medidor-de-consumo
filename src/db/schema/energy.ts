import {
	doublePrecision,
	foreignKey,
	integer,
	jsonb,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
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
		rawData: jsonb("raw_data").$type<Record<string, string>>(),

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

// Raw data from device
export interface RawEnergyData {
	id?: string;
	pa?: string;
	qa?: string;
	sa?: string;
	uarms?: string;
	iarms?: string;
	pfa?: string;
	pga?: string;
	freq?: string;
	epa_c?: string;
	epa_g?: string;
	tpsd?: string;
}

// API response types
export interface EnergyStats {
	totalConsumed?: number;
	totalGenerated?: number;
	energyBalance?: number;
	avgActivePower?: number;
	maxActivePower?: number;
	minActivePower?: number;
	avgReactivePower?: number;
	avgApparentPower?: number;
	avgVoltage?: number;
	minVoltage?: number;
	maxVoltage?: number;
	avgCurrent?: number;
	maxCurrent?: number;
	avgPowerFactor?: number;
	minPowerFactor?: number;
	avgFrequency?: number;
	minFrequency?: number;
	maxFrequency?: number;
	totalReadings?: number;
	totalOperationTime?: number;
	avgDailyConsumption?: number;
	estimatedCost?: number;
	estimatedRevenue?: number;
	netCost?: number;
}

export interface ConsumptionData {
	date: string;
	totalConsumed: number;
	totalGenerated: number;
	energyBalance: number;
	avgActivePower: number;
	maxActivePower: number;
	minActivePower: number;
	avgVoltage: number;
	minVoltage: number;
	maxVoltage: number;
	avgCurrent: number;
	avgPowerFactor: number;
	avgFrequency: number;
	readings: number;
}

export type IntervalType = "15min" | "hourly" | "daily" | "weekly";

export interface ConsumptionByPeriodResult {
	data: ConsumptionData[];
	interval: IntervalType;
	intervalLabel: string;
}
