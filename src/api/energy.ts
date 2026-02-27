import { jsonResponse } from "@/api";
import type { RawEnergyData } from "@/db/schema";
import * as energyService from "@/services/energy";

/**
 * POST /api/energy - Log new energy data (called by external IoT devices)
 */
export async function postLogEnergyHandler({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const raw: RawEnergyData = await request.json();
		const result = await energyService.logEnergy(raw);
		return jsonResponse.success(result);
	} catch (error) {
		console.error("Error logging energy:", error);

		if (error instanceof Error && error.message.includes("Invalid meter ID")) {
			return jsonResponse.error(error.message, 400);
		}
		if (error instanceof Error && error.message.includes("does not exist")) {
			return jsonResponse.error(error.message, 400);
		}
		if (error instanceof Error && error.message.includes("invalid")) {
			return jsonResponse.error(error.message, 400);
		}

		return jsonResponse.error("Invalid energy log data", 400);
	}
}

