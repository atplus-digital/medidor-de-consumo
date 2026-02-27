import {
	energyLogSchema,
	type NewEnergyLog,
	type RawEnergyData,
} from "@/db/schema";
import { adaptEnergyData } from "./adapt-energy-data";
import { invertReading } from "./invert-reading";

function parseRawEnergyData(
	raw: RawEnergyData,
	isInverted = false,
): NewEnergyLog {
	const adapted = adaptEnergyData(raw);
	const transformed = isInverted ? invertReading(adapted) : adapted;
	const parsed = energyLogSchema.parse(transformed);

	return {
		...parsed,
		rawData: raw as Record<string, string>,
	};
}
export { parseRawEnergyData };
