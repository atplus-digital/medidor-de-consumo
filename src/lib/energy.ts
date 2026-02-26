import { energyLogSchema, type NewEnergyLog } from "@/db/schema";

export interface RawEnergyData {
	id?: string;
	pa?: string;
	qa?: string;
	sa?: string;
	uarms?: string;
	iarms?: string;
	pfa?: string;
	pga?: string;
	freq?: string;
	epa_c?: string;
	epa_g?: string;
	tpsd?: string;
}

export function adaptEnergyData(raw: RawEnergyData): NewEnergyLog {
	return {
		meterId: raw?.id || "0",
		activePower: parseFloat(raw?.pa || "0"),
		reactivePower: parseFloat(raw?.qa || "0"),
		apparentPower: parseFloat(raw?.sa || "0"),
		voltage: parseFloat(raw?.uarms || "0"),
		current: parseFloat(raw?.iarms || "0"),
		powerFactor: parseFloat(raw?.pfa || "0"),
		phaseAngle: parseFloat(raw?.pga || "0"),
		frequency: parseFloat(raw?.freq || "0"),
		consumedEnergy: parseFloat(raw?.epa_c || "0"),
		generatedEnergy: parseFloat(raw?.epa_g || "0"),
		operationTime: parseFloat(raw?.tpsd || "0"),
	};
}

/**
 * Apply inversion transformations when meter is installed inverted
 *
 * When a meter is installed inverted (reversed polarity), the following transformations are applied:
 * - Inverts the sign of active power (consumption becomes negative, generation becomes positive)
 * - Inverts the sign of reactive power
 * - Swaps consumed and generated energy values
 *
 * Note: Apparent power is not inverted as it represents magnitude.
 * Phase angle and power factor may need adjustments depending on specific use cases,
 * but are currently left unchanged as they represent physical angles/ratios.
 */
export function applyInversion(data: NewEnergyLog): NewEnergyLog {
	return {
		...data,
		activePower: -data.activePower,
		reactivePower: -data.reactivePower,
		// Swap consumed and generated energy
		consumedEnergy: data.generatedEnergy,
		generatedEnergy: data.consumedEnergy,
	};
}

export function parseRawEnergyData(
	raw: RawEnergyData,
	isInverted = false,
): NewEnergyLog {
	const adapted = adaptEnergyData(raw);
	const transformed = isInverted ? applyInversion(adapted) : adapted;
	const parsed = energyLogSchema.parse(transformed);

	const data = {
		...parsed,
		rawData: raw,
	};

	return data;
}
