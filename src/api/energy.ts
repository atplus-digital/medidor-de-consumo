import { jsonResponse } from "@/api";
import type { RawEnergyData } from "@/db/schema";
import * as energyService from "@/services/energy";

/**
 * POST /api/energy - Log new energy data
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

/**
 * GET /api/energy/latest - Get the latest energy reading
 */
export async function getLatestReadingHandler({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const url = new URL(request.url);
		const meterId = url.searchParams.get("meterId");
		const result = await energyService.getLatestReading(meterId);
		return jsonResponse.success(result);
	} catch (_) {
		return jsonResponse.error("Erro ao buscar leitura mais recente", 500);
	}
}

/**
 * GET /api/energy/logs - Get paginated energy logs
 */
export async function getEnergyLogsHandler({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const url = new URL(request.url);
		const result = await energyService.getEnergyLogs({
			startDate: url.searchParams.get("startDate"),
			endDate: url.searchParams.get("endDate"),
			meterId: url.searchParams.get("meterId"),
			limit: parseInt(url.searchParams.get("limit") ?? "100", 10),
			offset: parseInt(url.searchParams.get("offset") ?? "0", 10),
		});
		return jsonResponse.success(result);
	} catch (_) {
		return jsonResponse.error("Erro ao buscar logs de energia", 500);
	}
}

/**
 * GET /api/energy/stats - Get aggregated energy statistics
 */
export async function getEnergyStatsHandler({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const url = new URL(request.url);
		const result = await energyService.getEnergyStats({
			startDate: url.searchParams.get("startDate"),
			endDate: url.searchParams.get("endDate"),
			meterId: url.searchParams.get("meterId"),
		});
		return jsonResponse.success(result);
	} catch (_) {
		return jsonResponse.error("Erro ao buscar estatísticas", 500);
	}
}

/**
 * GET /api/energy/consumption - Get consumption grouped by period
 */
export async function getConsumptionByPeriodHandler({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const url = new URL(request.url);
		const period = (url.searchParams.get("period") ?? "daily") as
			| "daily"
			| "weekly"
			| "monthly";
		const result = await energyService.getConsumptionByPeriod({
			period,
			startDate: url.searchParams.get("startDate"),
			endDate: url.searchParams.get("endDate"),
			meterId: url.searchParams.get("meterId"),
		});
		return jsonResponse.success(result);
	} catch (_) {
		return jsonResponse.error("Erro ao buscar consumo por período", 500);
	}
}

/**
 * GET /api/energy/meters - Get distinct meters with energy logs
 */
export async function getEnergyMetersHandler(): Promise<Response> {
	try {
		const result = await energyService.getEnergyMeters();
		return jsonResponse.success(result);
	} catch (_) {
		return jsonResponse.error("Erro ao buscar IDs de medidores", 500);
	}
}
