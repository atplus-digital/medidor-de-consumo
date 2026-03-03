import { db } from "@/db";
import { metersTable } from "@/db/schema";

export async function getEnergyMeters() {
	return db
		.select({
			id: metersTable.meterId,
			meterName: metersTable.meterName,
		})
		.from(metersTable)
		.orderBy(metersTable.meterName);
}
