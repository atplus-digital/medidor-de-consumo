import { eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable, metersTable } from "@/db/schema";

export async function getEnergyMeters() {
	return db
		.selectDistinct({
			id: energyLogTable.meterId,
			meterName: metersTable.meterName,
		})
		.from(energyLogTable)
		.innerJoin(metersTable, eq(energyLogTable.meterId, metersTable.meterId));
}
