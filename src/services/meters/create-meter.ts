import { eq } from "drizzle-orm";
import { db } from "@/db";
import { metersInsertSchema, metersTable } from "@/db/schema";
import { generateMeterId } from "./generate-meter-id";

/**
 * Create a new meter
 */
export async function createMeter(data: Record<string, unknown>) {
	const validatedData = metersInsertSchema.parse(data);

	const meterId = generateMeterId(validatedData.prefix || undefined);

	const existingMeter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (existingMeter.length > 0) {
		throw new Error("Meter ID already exists");
	}

	// Create the meter
	const newMeter = await db
		.insert(metersTable)
		.values({
			meterId,
			meterName: validatedData.meterName,
			meterType: validatedData.meterType,
			location: validatedData.location,
			status: validatedData.status || "active",
			prefix: validatedData.prefix,
			isInverted: validatedData.isInverted ?? false,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();

	return newMeter[0];
}
