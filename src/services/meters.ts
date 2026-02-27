import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	energyLogTable,
	metersInsertSchema,
	metersTable,
	type UpdateMeter,
} from "@/db/schema";
import { generateMeterId } from "@/lib/meters";

/**
 * Get all meters
 */
export async function getMeters() {
	const meters = await db
		.select()
		.from(metersTable)
		.orderBy(metersTable.createdAt);
	return meters;
}

/**
 * Get a specific meter by ID
 */
export async function getMeterById(meterId: string) {
	const meter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	return meter.length > 0 ? meter[0] : null;
}

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
