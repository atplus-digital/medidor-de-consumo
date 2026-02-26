import { randomUUID } from "crypto";
import { z } from "zod";

/**
 * Generates a unique meter ID with optional prefix + UUID hash
 * @param prefix Optional prefix for the meter ID
 * @returns Unique meter ID in format: "prefix-uuid" or just "uuid" if no prefix
 */
export function generateMeterId(prefix?: string): string {
	const uuid = randomUUID();
	const cleanUuid = uuid.replace(/-/g, "").substring(0, 12);

	if (prefix && prefix.trim().length > 0) {
		return `${prefix.trim()}-${cleanUuid}`;
	}

	return cleanUuid;
}

/**
 * Validation schema for creating a new meter
 */
export const createMeterSchema = z.object({
	meterName: z.string().min(1, "Meter name is required"),
	meterType: z.string().min(1, "Meter type is required"),
	location: z.string().min(1, "Location is required"),
	prefix: z.string().optional(),
	status: z.enum(["active", "inactive", "maintenance"]).default("active"),
});

/**
 * Validation schema for updating a meter
 */
export const updateMeterSchema = z.object({
	meterName: z.string().min(1, "Meter name is required").optional(),
	meterType: z.string().min(1, "Meter type is required").optional(),
	location: z.string().min(1, "Location is required").optional(),
	status: z.enum(["active", "inactive", "maintenance"]).optional(),
});

export type CreateMeterInput = z.infer<typeof createMeterSchema>;
export type UpdateMeterInput = z.infer<typeof updateMeterSchema>;
