import { eq } from "drizzle-orm";
import { db } from "@/db";
import { metersInsertSchema, metersTable, type UpdateMeter } from "@/db/schema";

/**
 * Update a meter
 */
export async function updateMeter(meterId: string, data: UpdateMeter) {
	// Validate input
	const validatedData = metersInsertSchema.partial().parse(data);

	// Check if meter exists
	const existingMeter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (existingMeter.length === 0) {
		throw new Error("Meter not found");
	}

	// Update the meter
	const updatedMeter = await db
		.update(metersTable)
		.set({
			...(validatedData.meterName !== undefined && {
				meterName: validatedData.meterName,
			}),
			...(validatedData.meterType !== undefined && {
				meterType: validatedData.meterType,
			}),
			...(validatedData.location !== undefined && {
				location: validatedData.location,
			}),
			...(validatedData.status !== undefined && {
				status: validatedData.status,
			}),
			...(validatedData.isInverted !== undefined && {
				isInverted: validatedData.isInverted,
			}),
			updatedAt: new Date(),
		})
		.where(eq(metersTable.meterId, meterId))
		.returning();

	return updatedMeter[0];
}
