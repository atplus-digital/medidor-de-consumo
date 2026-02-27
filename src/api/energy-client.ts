import axios from "axios";
import type {
	ConsumptionData,
	EnergyLog,
	EnergyStats,
} from "@/db/schema";

async function fetchApi<T>(url: string): Promise<T> {
	const response = await axios.get<{ data: T }>(url);
	return response.data.data;
}

export async function getLatestReading(
	meterId?: string,
): Promise<EnergyLog | null> {
	const params = new URLSearchParams();
	if (meterId) params.append("meterId", meterId);

	return fetchApi<EnergyLog | null>(`/api/energy/latest?${params}`);
}

export async function getEnergyLogs(
	startDate?: string,
	endDate?: string,
	meterId?: string,
	limit = 100,
	offset = 0,
): Promise<{ logs: EnergyLog[]; total: number }> {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (meterId) params.append("meterId", meterId);
	params.append("limit", String(limit));
	params.append("offset", String(offset));

	return fetchApi<{ logs: EnergyLog[]; total: number }>(
		`/api/energy/logs?${params}`,
	);
}

export async function getEnergyStats(
	startDate?: string,
	endDate?: string,
	meterId?: string,
): Promise<EnergyStats> {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (meterId) params.append("meterId", meterId);

	return fetchApi<EnergyStats>(`/api/energy/stats?${params}`);
}

export async function getConsumptionByPeriod(
	period: "daily" | "weekly" | "monthly",
	startDate?: string,
	endDate?: string,
	meterId?: string,
): Promise<ConsumptionData[]> {
	const params = new URLSearchParams();
	params.append("period", period);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (meterId) params.append("meterId", meterId);

	return fetchApi<ConsumptionData[]>(`/api/energy/consumption?${params}`);
}

export async function getMeterIds(): Promise<
	Array<{ id: string; meterName: string }>
> {
	return fetchApi<Array<{ id: string; meterName: string }>>(
		"/api/energy/meters",
	);
}
