import { eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable, type RawEnergyData } from "@/db/schema";
import { parseRawEnergyData } from "./parse-raw-energy-data";

export async function logEnergy(raw: RawEnergyData) {
	const meterId = raw?.id || "0";

	if (!meterId || meterId === "0") {
		throw new Error("Invalid meter ID");
	}

	const meterResult = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	if (meterResult.length === 0) {
		throw new Error(
			`Meter with ID "${meterId}" does not exist. Please create the meter first.`,
		);
	}

	const meter = meterResult[0];
	const data = parseRawEnergyData(raw, meter.isInverted);

	if (!data || !data.meterId) {
		throw new Error("Parsed energy data is invalid");
	}

	await db.insert(energyLogTable).values(data);

	return { message: "Energy log saved successfully" };
}
