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

		const data = parseRawEnergyData(raw);

		if (!data || !data.meterId || data.meterId === "0") {
			throw new Error("Parsed energy data is invalid");
		}

		// Validate that the meter exists
		const meterExists = await db
			.select()
			.from(metersTable)
			.where(eq(metersTable.meterId, data.meterId))
			.limit(1);

		if (!meterExists || meterExists.length === 0) {
			return jsonResponse.error(
				`Meter with ID "${data.meterId}" does not exist. Please create the meter first.`,
				400,
			);
		}

		await db.insert(energyLogTable).values(data);

		return jsonResponse.success({
			message: "Energy log saved successfully",
		});
	} catch (_) {
		return jsonResponse.error("Invalid energy log data", 400);
	}
}
