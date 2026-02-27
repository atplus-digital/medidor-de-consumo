import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	energyLogSchema,
	energyLogTable,
	metersTable,
	type NewEnergyLog,
	type RawEnergyData,
} from "@/db/schema";

function adaptEnergyData(raw: RawEnergyData): NewEnergyLog {
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
function applyInversion(data: NewEnergyLog): NewEnergyLog {
	return {
		...data,
		activePower: -data.activePower,
		reactivePower: -data.reactivePower,
		// Swap consumed and generated energy
		consumedEnergy: data.generatedEnergy,
		generatedEnergy: data.consumedEnergy,
	};
}

function parseRawEnergyData(raw: RawEnergyData, isInverted = false): NewEnergyLog {
	const adapted = adaptEnergyData(raw);
	const transformed = isInverted ? applyInversion(adapted) : adapted;
	const parsed = energyLogSchema.parse(transformed);

	return {
		...parsed,
		rawData: raw,
	};
}

/**
 * Log new energy data
 */
export async function logEnergy(raw: RawEnergyData) {
	// First, check if meter exists and get its configuration
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
	const isInverted = meter.isInverted;

	// Parse and transform data based on meter configuration
	const data = parseRawEnergyData(raw, isInverted);

	if (!data || !data.meterId) {
		throw new Error("Parsed energy data is invalid");
	}

	await db.insert(energyLogTable).values(data);

	return { message: "Energy log saved successfully" };
}
