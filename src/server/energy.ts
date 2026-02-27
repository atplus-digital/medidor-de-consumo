import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as energyService from "@/services/energy";

const rawEnergyDataSchema = z.object({
	id: z.string().optional(),
	pa: z.string().optional(),
	qa: z.string().optional(),
	sa: z.string().optional(),
	uarms: z.string().optional(),
	iarms: z.string().optional(),
	pfa: z.string().optional(),
	pga: z.string().optional(),
	freq: z.string().optional(),
	epa_c: z.string().optional(),
	epa_g: z.string().optional(),
	tpsd: z.string().optional(),
});

export const postLogEnergyFn = createServerFn({ method: "POST" })
	.inputValidator(rawEnergyDataSchema)
	.handler(async ({ data }) => {
		return energyService.logEnergy(data);
	});

export const getLatestReadingFn = createServerFn({ method: "GET" })
	.inputValidator(z.object({ meterId: z.string().optional() }).optional())
	.handler(async ({ data }) => {
		return energyService.getLatestReading(data?.meterId);
	});

export const getEnergyLogsFn = createServerFn({ method: "GET" })
	.inputValidator(
		z
			.object({
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				meterId: z.string().optional(),
				limit: z.number().optional(),
				offset: z.number().optional(),
			})
			.optional(),
	)
	.handler(async ({ data }) => {
		return energyService.getEnergyLogs({
			startDate: data?.startDate,
			endDate: data?.endDate,
			meterId: data?.meterId,
			limit: data?.limit,
			offset: data?.offset,
		});
	});

export const getEnergyStatsFn = createServerFn({ method: "GET" })
	.inputValidator(
		z
			.object({
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				meterId: z.string().optional(),
			})
			.optional(),
	)
	.handler(async ({ data }) => {
		return energyService.getEnergyStats({
			startDate: data?.startDate,
			endDate: data?.endDate,
			meterId: data?.meterId,
		});
	});

export const getConsumptionByPeriodFn = createServerFn({ method: "GET" })
	.inputValidator(
		z
			.object({
				period: z.enum(["daily", "weekly", "monthly"]).optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				meterId: z.string().optional(),
			})
			.optional(),
	)
	.handler(async ({ data }) => {
		return energyService.getConsumptionByPeriod({
			period: data?.period,
			startDate: data?.startDate,
			endDate: data?.endDate,
			meterId: data?.meterId,
		});
	});

export const getEnergyMetersFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return energyService.getEnergyMeters();
	},
);
