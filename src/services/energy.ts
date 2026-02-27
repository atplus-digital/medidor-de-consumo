import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
	energyLogSchema,
	energyLogTable,
	metersTable,
	type NewEnergyLog,
	type RawEnergyData,
} from "@/db/schema";

function adaptEnergyData(raw: RawEnergyData): NewEnergyLog {
	return {
		meterId: raw?.id || "0",
		activePower: parseFloat(raw?.pa || "0"),
		reactivePower: parseFloat(raw?.qa || "0"),
		apparentPower: parseFloat(raw?.sa || "0"),
		voltage: parseFloat(raw?.uarms || "0"),
		current: parseFloat(raw?.iarms || "0"),
		powerFactor: parseFloat(raw?.pfa || "0"),
		phaseAngle: parseFloat(raw?.pga || "0"),
		frequency: parseFloat(raw?.freq || "0"),
		consumedEnergy: parseFloat(raw?.epa_c || "0"),
		generatedEnergy: parseFloat(raw?.epa_g || "0"),
		operationTime: parseFloat(raw?.tpsd || "0"),
	};
}

/**
 * Apply inversion transformations when meter is installed inverted
 *
 * When a meter is installed inverted (reversed polarity), the following transformations are applied:
 * - Inverts the sign of active power (consumption becomes negative, generation becomes positive)
 * - Inverts the sign of reactive power
 * - Swaps consumed and generated energy values
 *
 * Note: Apparent power is not inverted as it represents magnitude.
 * Phase angle and power factor may need adjustments depending on specific use cases,
 * but are currently left unchanged as they represent physical angles/ratios.
 */
function applyInversion(data: NewEnergyLog): NewEnergyLog {
	return {
		...data,
		activePower: -data.activePower,
		reactivePower: -data.reactivePower,
		// Swap consumed and generated energy
		consumedEnergy: data.generatedEnergy,
		generatedEnergy: data.consumedEnergy,
	};
}

function parseRawEnergyData(raw: RawEnergyData, isInverted = false): NewEnergyLog {
	const adapted = adaptEnergyData(raw);
	const transformed = isInverted ? applyInversion(adapted) : adapted;
	const parsed = energyLogSchema.parse(transformed);

	return {
		...parsed,
		rawData: raw as Record<string, string>,
	};
}

/**
 * Log new energy data
 */
export async function logEnergy(raw: RawEnergyData) {
	// First, check if meter exists and get its configuration
	const meterId = raw?.id || "0";

	if (!meterId || meterId === "0") {
		throw new Error("Invalid meter ID");
	}

	const meterResult = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (meterResult.length === 0) {
		throw new Error(
			`Meter with ID "${meterId}" does not exist. Please create the meter first.`,
		);
	}

	const meter = meterResult[0];
	const isInverted = meter.isInverted;

	// Parse and transform data based on meter configuration
	const data = parseRawEnergyData(raw, isInverted);

	if (!data || !data.meterId) {
		throw new Error("Parsed energy data is invalid");
	}

	await db.insert(energyLogTable).values(data);

	return { message: "Energy log saved successfully" };
}

/**
 * Get the latest energy reading, optionally filtered by meter
 */
export async function getLatestReading(meterId?: string | null) {
	const conditions = [];
	if (meterId) conditions.push(eq(energyLogTable.meterId, meterId));

	const result = await db
		.select()
		.from(energyLogTable)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(desc(energyLogTable.createdAt))
		.limit(1);

	return result[0] ?? null;
}

/**
 * Get paginated energy logs with optional filters
 */
export async function getEnergyLogs({
	startDate,
	endDate,
	meterId,
	limit = 100,
	offset = 0,
}: {
	startDate?: string | null;
	endDate?: string | null;
	meterId?: string | null;
	limit?: number;
	offset?: number;
}) {
	const conditions: Array<ReturnType<typeof eq | typeof gte | typeof lte>> =
		[];

	if (meterId) conditions.push(eq(energyLogTable.meterId, meterId));
	if (startDate)
		conditions.push(gte(energyLogTable.createdAt, new Date(startDate)));
	if (endDate)
		conditions.push(lte(energyLogTable.createdAt, new Date(endDate)));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const logs = await db
		.select()
		.from(energyLogTable)
		.where(where)
		.orderBy(desc(energyLogTable.createdAt))
		.limit(limit)
		.offset(offset);

	const countResult = await db
		.select({ count: sql<number>`cast(count(*) as integer)` })
		.from(energyLogTable)
		.where(where);

	return { logs, total: countResult[0]?.count ?? 0 };
}

/**
 * Get aggregated energy statistics with optional filters
 */
export async function getEnergyStats({
	startDate,
	endDate,
	meterId,
}: {
	startDate?: string | null;
	endDate?: string | null;
	meterId?: string | null;
}) {
	const conditions = [];

	if (meterId) conditions.push(eq(energyLogTable.meterId, meterId));
	if (startDate)
		conditions.push(gte(energyLogTable.createdAt, new Date(startDate)));
	if (endDate)
		conditions.push(lte(energyLogTable.createdAt, new Date(endDate)));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const result = await db
		.select({
			totalConsumed: sql<number>`coalesce(sum(${energyLogTable.consumedEnergy}), 0)`,
			totalGenerated: sql<number>`coalesce(sum(${energyLogTable.generatedEnergy}), 0)`,
			avgActivePower: sql<number>`coalesce(avg(${energyLogTable.activePower}), 0)`,
			maxActivePower: sql<number>`coalesce(max(${energyLogTable.activePower}), 0)`,
			minActivePower: sql<number>`coalesce(min(${energyLogTable.activePower}), 0)`,
			avgVoltage: sql<number>`coalesce(avg(${energyLogTable.voltage}), 0)`,
			avgCurrent: sql<number>`coalesce(avg(${energyLogTable.current}), 0)`,
			avgPowerFactor: sql<number>`coalesce(avg(${energyLogTable.powerFactor}), 0)`,
			totalReadings: sql<number>`cast(count(*) as integer)`,
		})
		.from(energyLogTable)
		.where(where);

	return result[0];
}

/**
 * Get energy consumption grouped by period (daily, weekly, monthly)
 */
export async function getConsumptionByPeriod({
	period = "daily",
	startDate,
	endDate,
	meterId,
}: {
	period?: "daily" | "weekly" | "monthly";
	startDate?: string | null;
	endDate?: string | null;
	meterId?: string | null;
}) {
	const conditions = [];

	if (meterId) conditions.push(eq(energyLogTable.meterId, meterId));
	if (startDate)
		conditions.push(gte(energyLogTable.createdAt, new Date(startDate)));
	if (endDate)
		conditions.push(lte(energyLogTable.createdAt, new Date(endDate)));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	let dateExpr = sql`date(${energyLogTable.createdAt})`;

	switch (period) {
		case "weekly":
			dateExpr = sql`date_trunc('week', ${energyLogTable.createdAt})::date`;
			break;
		case "monthly":
			dateExpr = sql`date_trunc('month', ${energyLogTable.createdAt})::date`;
			break;
		default:
			dateExpr = sql`date(${energyLogTable.createdAt})`;
	}

	return db
		.select({
			date: sql<string>`${dateExpr}`,
			totalConsumed: sql<number>`coalesce(sum(${energyLogTable.consumedEnergy}), 0)`,
			totalGenerated: sql<number>`coalesce(sum(${energyLogTable.generatedEnergy}), 0)`,
			avgActivePower: sql<number>`coalesce(avg(${energyLogTable.activePower}), 0)`,
			maxActivePower: sql<number>`coalesce(max(${energyLogTable.activePower}), 0)`,
			avgVoltage: sql<number>`coalesce(avg(${energyLogTable.voltage}), 0)`,
			avgCurrent: sql<number>`coalesce(avg(${energyLogTable.current}), 0)`,
			readings: sql<number>`cast(count(*) as integer)`,
		})
		.from(energyLogTable)
		.where(where)
		.groupBy(dateExpr)
		.orderBy(dateExpr);
}

/**
 * Get distinct meters that have energy logs
 */
export async function getEnergyMeters() {
	return db
		.selectDistinct({
			id: energyLogTable.meterId,
			meterName: metersTable.meterName,
		})
		.from(energyLogTable)
		.innerJoin(metersTable, eq(energyLogTable.meterId, metersTable.meterId));
}
