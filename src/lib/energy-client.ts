import type { EnergyLog } from "@/db/schema";

interface EnergyStats {
	totalConsumed?: number;
	totalGenerated?: number;
	avgActivePower?: number;
	maxActivePower?: number;
	minActivePower?: number;
	avgVoltage?: number;
	avgCurrent?: number;
	avgPowerFactor?: number;
	totalReadings?: number;
}

interface ConsumptionData extends Record<string, unknown> {
	date: string;
	totalConsumed: number;
	totalGenerated: number;
	avgActivePower: number;
	maxActivePower: number;
	avgVoltage: number;
	avgCurrent: number;
	readings: number;
}

export async function getLatestReading(
	meterId?: string,
): Promise<EnergyLog | null> {
	const params = new URLSearchParams();
	if (meterId) params.append("meterId", meterId);

	const response = await fetch(`/api/energy/latest?${params}`);
	const data = (await response.json()) as { data: EnergyLog | null };
	return data.data;
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

	const response = await fetch(`/api/energy/logs?${params}`);
	const data = (await response.json()) as {
		data: { logs: EnergyLog[]; total: number };
	};
	return data.data;
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

	const response = await fetch(`/api/energy/stats?${params}`);
	const data = (await response.json()) as { data: EnergyStats };
	return data.data;
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

	const response = await fetch(`/api/energy/consumption?${params}`);
	const data = (await response.json()) as { data: ConsumptionData[] };
	return data.data;
}

export async function getMeterIds(): Promise<
	Array<{ id: string; meterName: string }>
> {
	const response = await fetch("/api/energy/meters");
	const data = (await response.json()) as {
		data: Array<{ id: string; meterName: string }>;
	};
	return data.data;
}
