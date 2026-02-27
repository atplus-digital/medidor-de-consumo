import { eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable } from "@/db/schema";

export async function deleteMeter(meterId: string) {
	const existingMeter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (existingMeter.length === 0) {
		throw new Error("Meter not found");
	}

	await db.delete(energyLogTable).where(eq(energyLogTable.meterId, meterId));
	await db.delete(metersTable).where(eq(metersTable.meterId, meterId));

	return { message: "Meter and associated logs deleted successfully" };
}
