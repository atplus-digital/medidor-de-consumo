import type { NewEnergyLog } from "@/db/schema";

function invertReading(data: NewEnergyLog): NewEnergyLog {
	return {
		...data,
		activePower: -data.activePower,
		reactivePower: -data.reactivePower,
		apparentPower: -data.apparentPower,
		//consumedEnergy becomes generatedEnergy and vice versa
		consumedEnergy: data.generatedEnergy,
		generatedEnergy: data.consumedEnergy,
	};
}

export { invertReading };
