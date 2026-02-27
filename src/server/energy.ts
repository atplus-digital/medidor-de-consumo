import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { RawEnergyData } from "@/db/schema";
import * as energyService from "@/services/energy";

export const postLogEnergyFn = createServerFn({ method: "POST" })
	.inputValidator((data: RawEnergyData) => data)
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
