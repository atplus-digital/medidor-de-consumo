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

	await db.transaction(async (tx) => {
		await tx
			.delete(energyLogTable)
			.where(eq(energyLogTable.meterId, meterId));
		await tx.delete(metersTable).where(eq(metersTable.meterId, meterId));
	});

	return { message: "Meter and associated logs deleted successfully" };
}
