import type { NewEnergyLog, RawEnergyData } from "@/db/schema";

function safeParseFloat(value: string | undefined, fallback = 0): number {
	const parsed = Number.parseFloat(value || "0");
	return Number.isNaN(parsed) ? fallback : parsed;
}

function adaptEnergyData(raw: RawEnergyData): NewEnergyLog {
	return {
		meterId: raw?.id || "0",
		activePower: safeParseFloat(raw?.pa),
		reactivePower: safeParseFloat(raw?.qa),
		apparentPower: safeParseFloat(raw?.sa),
		voltage: safeParseFloat(raw?.uarms),
		current: safeParseFloat(raw?.iarms),
		powerFactor: safeParseFloat(raw?.pfa),
		phaseAngle: safeParseFloat(raw?.pga),
		frequency: safeParseFloat(raw?.freq),
		consumedEnergy: safeParseFloat(raw?.epa_c),
		generatedEnergy: safeParseFloat(raw?.epa_g),
		operationTime: safeParseFloat(raw?.tpsd),
	};
}

export { adaptEnergyData };
