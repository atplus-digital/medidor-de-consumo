import { eq } from "drizzle-orm";
import { db } from "@/db";
import { metersTable, metersUpdateSchema, type UpdateMeter } from "@/db/schema";

export async function updateMeter(meterId: string, data: UpdateMeter) {
	const processedData = {
		...data,
		...(data.costPerKwh !== undefined && {
			costPerKwh: String(data.costPerKwh),
		}),
		...(data.revenuePerKwh !== undefined && {
			revenuePerKwh: String(data.revenuePerKwh),
		}),
	};
	const validatedData = metersUpdateSchema.parse(processedData);

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
