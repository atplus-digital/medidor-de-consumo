import { eq } from "drizzle-orm";
import { db } from "@/db";
import { type MeterFormData, metersTable } from "@/db/schema";
import { generateMeterId } from "./generate-meter-id";

export async function createMeter(data: MeterFormData) {
	const meterId = generateMeterId(data.prefix || undefined);

	const existingMeter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (existingMeter.length > 0) {
		throw new Error("Meter ID already exists");
	}

	const now = new Date();
	const newMeter = await db
		.insert(metersTable)
		.values({
			meterId,
			...data,
			status: data.status || "active",
			isInverted: data.isInverted ?? false,
			costPerKwh: String(data.costPerKwh),
			revenuePerKwh: String(data.revenuePerKwh),
			createdAt: now,
			updatedAt: now,
		})
		.returning();

	return newMeter[0];
}
