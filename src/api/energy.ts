import { jsonResponse } from "@/api";
import type { RawEnergyData } from "@/db/schema";
import { postLogEnergyFn } from "@/server/energy";

export async function postLogEnergyHandler({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const raw: RawEnergyData = await request.json();
		const result = await postLogEnergyFn({ data: raw });
		return jsonResponse.success(result);
	} catch (error) {
		console.error("Error logging energy:", error);

		const message =
			error instanceof Error ? error.message : "Invalid energy log data";
		return jsonResponse.error(message, 400);
	}
}
