import { z } from "zod";

export const meterSchema = z.object({
	meterName: z.string().trim().min(1, "Meter name is required"),
	meterType: z.string().trim().min(1, "Meter type is required"),
	location: z.string().trim().min(1, "Location is required"),
	status: z.enum(["active", "inactive", "maintenance"]),
	prefix: z.string().trim().max(50).optional(),
});

export type MeterFormValues = z.infer<typeof meterSchema>;
