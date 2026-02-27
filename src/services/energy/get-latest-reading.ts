import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";

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
