import { eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable, metersInsertSchema } from "@/db/schema";
import { jsonResponse } from "@/lib/http";
import { generateMeterId } from "@/lib/meters";

/**
 * GET /api/meters - Get all meters
 */
export async function getMeters() {
	try {
		const meters = await db
			.select()
			.from(metersTable)
			.orderBy(metersTable.createdAt);
		return jsonResponse.success(meters);
	} catch (error) {
		console.error("Error fetching meters:", error);
		return jsonResponse.error("Failed to fetch meters", 500);
	}
}

/**
 * GET /api/meters/:meterId - Get a specific meter
 */
export async function getMeterById(meterId: string) {
	try {
		const meter = await db
			.select()
			.from(metersTable)
			.where(eq(metersTable.meterId, meterId))
			.limit(1);

		if (!meter || meter.length === 0) {
			return jsonResponse.error("Meter not found", 404);
		}

		return jsonResponse.success(meter[0]);
	} catch (error) {
		console.error("Error fetching meter:", error);
		return jsonResponse.error("Failed to fetch meter", 500);
	}
}

/**
 * POST /api/meters - Create a new meter
 */
export async function createMeter({ request }: { request: Request }) {
	try {
		const body = await request.json();

		// Validate input - omit auto-generated fields
		const validatedData = metersInsertSchema
			.omit({ meterId: true, createdAt: true, updatedAt: true })
			.parse(body);

		// Generate unique meter ID
		const meterId = generateMeterId(validatedData.prefix || undefined);

		// Check if meter ID already exists
		const existingMeter = await db
			.select()
			.from(metersTable)
			.where(eq(metersTable.meterId, meterId))
			.limit(1);

		if (existingMeter && existingMeter.length > 0) {
			return jsonResponse.error("Meter ID already exists", 409);
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

		return jsonResponse.success(newMeter[0], "Meter created successfully", 201);
	} catch (error) {
		console.error("Error creating meter:", error);

		if (error instanceof SyntaxError) {
			return jsonResponse.error("Invalid JSON", 400);
		}
		if (error instanceof Error && error.message.includes("validation")) {
			return jsonResponse.error(error.message, 400);
		}
		return jsonResponse.error("Failed to create meter", 500);
	}
}

/**
 * PUT /api/meters/:meterId - Update a meter
 */
export async function updateMeter({
	meterId,
	request,
}: {
	meterId: string;
	request: Request;
}) {
	try {
		const body = await request.json();

		// Validate input
		const validatedData = metersInsertSchema.partial().parse(body);

		// Check if meter exists
		const existingMeter = await db
			.select()
			.from(metersTable)
			.where(eq(metersTable.meterId, meterId))
			.limit(1);

		if (!existingMeter || existingMeter.length === 0) {
			return jsonResponse.error("Meter not found", 404);
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

		return jsonResponse.success(updatedMeter[0]);
	} catch (error) {
		if (error instanceof SyntaxError) {
			return jsonResponse.error("Invalid JSON", 400);
		}
		console.error("Error updating meter:", error);
		return jsonResponse.error("Failed to update meter", 500);
	}
}

/**
 * DELETE /api/meters/:meterId - Delete a meter and all associated logs
 */
export async function deleteMeter(meterId: string) {
	try {
		// Check if meter exists
		const existingMeter = await db
			.select()
			.from(metersTable)
			.where(eq(metersTable.meterId, meterId))
			.limit(1);

		if (!existingMeter || existingMeter.length === 0) {
			return jsonResponse.error("Meter not found", 404);
		}

		// Delete all energy logs associated with this meter
		await db.delete(energyLogTable).where(eq(energyLogTable.meterId, meterId));

		// Delete the meter
		await db.delete(metersTable).where(eq(metersTable.meterId, meterId));

		return jsonResponse.success({
			message: "Meter and associated logs deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting meter:", error);
		return jsonResponse.error("Failed to delete meter", 500);
	}
}
