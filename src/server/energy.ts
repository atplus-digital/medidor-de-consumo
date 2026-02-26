import { eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable } from "@/db/schema";
import { parseRawEnergyData, type RawEnergyData } from "@/lib/energy";
import { jsonResponse } from "@/lib/http";

export async function postLogEnergy({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const raw: RawEnergyData = await request.json();

		// First, check if meter exists and get its configuration
		const meterId = raw?.id || "0";

		if (!meterId || meterId === "0") {
			return jsonResponse.error("Invalid meter ID", 400);
		}

		const meterResult = await db
			.select()
			.from(metersTable)
			.where(eq(metersTable.meterId, meterId))
			.limit(1);

		if (!meterResult || meterResult.length === 0) {
			return jsonResponse.error(
				`Meter with ID "${meterId}" does not exist. Please create the meter first.`,
				400,
			);
		}

		const meter = meterResult[0];
		const isInverted = meter.isInverted;

		// Parse and transform data based on meter configuration
		const data = parseRawEnergyData(raw, isInverted);

		if (!data || !data.meterId) {
			throw new Error("Parsed energy data is invalid");
		}

		await db.insert(energyLogTable).values(data);

		return jsonResponse.success({
			message: "Energy log saved successfully",
		});
	} catch (_) {
		return jsonResponse.error("Invalid energy log data", 400);
	}
}
