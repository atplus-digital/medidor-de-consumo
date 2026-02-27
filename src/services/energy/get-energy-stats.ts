import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";

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
