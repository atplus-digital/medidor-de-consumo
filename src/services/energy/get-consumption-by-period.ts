import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";

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
