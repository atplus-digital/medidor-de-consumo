import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";

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
	const conditions = [];

	if (meterId) conditions.push(eq(energyLogTable.meterId, meterId));
	if (startDate)
		conditions.push(gte(energyLogTable.createdAt, new Date(startDate)));
	if (endDate)
		conditions.push(lte(energyLogTable.createdAt, new Date(endDate)));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [logs, countResult] = await Promise.all([
		db
			.select()
			.from(energyLogTable)
			.where(where)
			.orderBy(desc(energyLogTable.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql<number>`cast(count(*) as integer)` })
			.from(energyLogTable)
			.where(where),
	]);

	return { logs, total: countResult[0]?.count ?? 0 };
}
