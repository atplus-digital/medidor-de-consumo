import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable, type RawEnergyData } from "@/db/schema";
import { parseRawEnergyData } from "../energy/log-energy/parse-raw-energy-data";

const BATCH_SIZE = 1000;

export async function normalizeReadings(meterId: string) {
	const meterResult = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (meterResult.length === 0) {
		throw new Error(`Meter with ID "${meterId}" not found`);
	}

	const meter = meterResult[0];

	const countResult = await db
		.select({ count: sql<number>`cast(count(*) as integer)` })
		.from(energyLogTable)
		.where(eq(energyLogTable.meterId, meterId));

	const totalLogs = Number(countResult[0]?.count ?? 0);

	if (totalLogs === 0) {
		return { message: "No energy logs to normalize" };
	}

	let processedCount = 0;
	const totalBatches = Math.ceil(totalLogs / BATCH_SIZE);

	for (let batch = 0; batch < totalBatches; batch++) {
		const offset = batch * BATCH_SIZE;

		const energyLogs = await db
			.select()
			.from(energyLogTable)
			.where(eq(energyLogTable.meterId, meterId))
			.orderBy(sql`id DESC`)
			.limit(BATCH_SIZE)
			.offset(offset);

		for (const log of energyLogs) {
			const rawData = log.rawData as RawEnergyData;

			const normalized = parseRawEnergyData(rawData, meter.isInverted);

			await db
				.update(energyLogTable)
				.set(normalized)
				.where(eq(energyLogTable.id, log.id));

			processedCount++;
		}
	}
	console.log({
		processedCount,
		totalLogs,
	});

	return {
		message: `Successfully normalized ${processedCount} energy logs in ${totalBatches} batch(es)`,
	};
}
