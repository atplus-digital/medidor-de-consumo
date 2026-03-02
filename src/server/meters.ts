import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { meterFormSchema, type UpdateMeter } from "@/db/schema";
import * as metersService from "@/services/meters";

export const getMetersFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return metersService.getMeters();
	},
);

export const getMeterByIdFn = createServerFn({ method: "GET" })
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		return metersService.getMeterById(data);
	});

export const createMeterFn = createServerFn()
	.inputValidator(meterFormSchema)
	.handler(async ({ data }) => {
		return metersService.createMeter(data);
	});

export const updateMeterFn = createServerFn()
	.inputValidator(
		z.object({
			meterId: z.string(),
			data: meterFormSchema.partial(),
		}),
	)
	.handler(async ({ data: { meterId, data } }) => {
		return metersService.updateMeter(meterId, data as UpdateMeter);
	});

export const deleteMeterFn = createServerFn()
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		return metersService.deleteMeter(data);
	});

export const normalizeReadingsFn = createServerFn()
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		return metersService.normalizeReadings(data);
	});
