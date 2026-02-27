import { eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable } from "@/db/schema";

/**
 * Delete a meter and all associated logs
 */
export async function deleteMeter(meterId: string) {
	// Check if meter exists
	const existingMeter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (existingMeter.length === 0) {
		throw new Error("Meter not found");
	}

	// Delete all energy logs associated with this meter
	await db.delete(energyLogTable).where(eq(energyLogTable.meterId, meterId));

	// Delete the meter
	await db.delete(metersTable).where(eq(metersTable.meterId, meterId));

	return { message: "Meter and associated logs deleted successfully" };
}
