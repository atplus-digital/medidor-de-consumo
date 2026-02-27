import type { NewEnergyLog } from "@/db/schema";

function invertReading(data: NewEnergyLog): NewEnergyLog {
	return {
		...data,
		activePower: -data.activePower,
		reactivePower: -data.reactivePower,
		consumedEnergy: data.generatedEnergy,
		generatedEnergy: data.consumedEnergy,
	};
}

export { invertReading };
