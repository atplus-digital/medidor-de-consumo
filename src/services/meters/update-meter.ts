import { eq } from "drizzle-orm";
import { db } from "@/db";
import { metersTable, metersUpdateSchema, type UpdateMeter } from "@/db/schema";

export async function updateMeter(meterId: string, data: UpdateMeter) {
	const validatedData = metersUpdateSchema.parse(data);

	const existingMeter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (existingMeter.length === 0) {
		throw new Error("Meter not found");
	}

	const updatedMeter = await db
		.update(metersTable)
		.set({
			...validatedData,
			updatedAt: new Date(),
		})
		.where(eq(metersTable.meterId, meterId))
		.returning();

	return updatedMeter[0];
}
